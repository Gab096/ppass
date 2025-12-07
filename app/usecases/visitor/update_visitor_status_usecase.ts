import Visitor from '#models/visitor'
import VisitorStatus from '#models/visitor_status'

type UpdateVisitorStatusData = {
  status: 'liberado' | 'bloqueado' | 'atenção'
  notes?: string | null
  adminId?: number | null
}

export default class UpdateVisitorStatusUseCase {
  async execute(visitorId: number, data: UpdateVisitorStatusData) {
    const visitor = await Visitor.find(visitorId)

    if (!visitor) {
      const error = new Error('Visitor não encontrado')
      ;(error as any).status = 404
      ;(error as any).code = 'E_ROW_NOT_FOUND'
      throw error
    }

    // Desativar todos os status ativos anteriores
    await VisitorStatus.query()
      .where('visitor_id', visitorId)
      .where('active', true)
      .update({ active: false })

    // Criar novo status ativo
    const newStatus = await VisitorStatus.create({
      visitorId: visitorId,
      adminId: data.adminId || null,
      status: data.status,
      active: true,
      notes: data.notes || null,
    })

    await newStatus.load('visitor')
    if (newStatus.adminId) {
      await newStatus.load('admin')
    }

    return newStatus
  }
}

