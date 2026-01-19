import VisitorCheckin from '#models/visitor_checkin'
import Visitor from '#models/visitor'
import VisitorObservation from '#models/visitor_observation'

type CreateVisitorCheckinData = {
  visitorId: string
  checkType: 'in' | 'out'
  adminId: string // Obrigatório - sempre deve ter um admin que criou o check-in
  notes?: string | null
  observationTitle?: string | null
  observationDescription?: string | null
}

export default class CreateVisitorCheckinUseCase {
  async execute(data: CreateVisitorCheckinData) {
    const visitor = await Visitor.find(data.visitorId)

    if (!visitor) {
      const error = new Error('Visitor não encontrado')
      ;(error as any).status = 404
      ;(error as any).code = 'E_ROW_NOT_FOUND'
      throw error
    }

    let observationId: string | null = null

    // Se foi fornecida observação, criar uma observation
    if (data.observationTitle || data.observationDescription) {
      const observation = await VisitorObservation.create({
        visitorId: data.visitorId,
        visitorVisitId: null,
        title: data.observationTitle || `Check-${data.checkType}`,
        description: data.observationDescription || data.notes || '',
        observationType: 'general',
        observedBy: null,
      })
      observationId = observation.id
    }

    const checkin = await VisitorCheckin.create({
      visitorId: data.visitorId,
      visitorObservationId: observationId,
      checkType: data.checkType,
      adminId: data.adminId, // Sempre deve ter um adminId
      notes: data.notes || null,
    })

    // Sempre carregar os relacionamentos
    await checkin.load('visitor')
    await checkin.load('admin')
    if (observationId) {
      await checkin.load('observation')
    }

    return checkin
  }
}
