import VisitorCheckin from '#models/visitor_checkin'
import db from '@adonisjs/lucid/services/db'

export default class AutoCheckoutVisitorsUseCase {
  /**
   * Encontra todos os visitantes que têm check-in aberto (último check-in é 'in')
   * e cria check-out automático para eles
   */
  async execute(systemAdminId: string | null = null) {
    // Encontrar todos os visitantes com check-in aberto
    // Um visitante tem check-in aberto se o último check-in é do tipo 'in'
    // Query: seleciona visitor_id onde o último check-in (MAX created_at) é 'in'
    
    const result = await db.rawQuery(
      `
      SELECT DISTINCT vc1.visitor_id
      FROM visitor_checkins vc1
      WHERE vc1.check_type = 'in'
      AND vc1.created_at = (
        SELECT MAX(vc2.created_at)
        FROM visitor_checkins vc2
        WHERE vc2.visitor_id = vc1.visitor_id
      )
      `
    )

    const visitorIds = result.rows.map((row: any) => row.visitor_id)

    if (visitorIds.length === 0) {
      return {
        processed: 0,
        message: 'Nenhum visitante com check-in aberto encontrado',
        checkouts: [],
      }
    }

    // Criar check-out para cada visitante
    const checkouts = []
    for (const visitorId of visitorIds) {
      try {
        const checkout = await VisitorCheckin.create({
          visitorId: visitorId,
          checkType: 'out',
          adminId: systemAdminId,
          notes: 'Check-out automático às 18:00',
          visitorObservationId: null,
        })

        await checkout.load('visitor')
        checkouts.push(checkout)
      } catch (error) {
        console.error(`Erro ao fazer check-out automático do visitante ${visitorId}:`, error)
      }
    }

    return {
      processed: checkouts.length,
      checkouts: checkouts.map((c) => ({
        id: c.id,
        visitorId: c.visitorId,
        visitorName: c.visitor?.fullName || 'N/A',
        createdAt: c.createdAt,
      })),
      message: `${checkouts.length} check-out(s) automático(s) criado(s) com sucesso`,
    }
  }
}
