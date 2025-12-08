import VisitorVisit from '#models/visitor_visit'
import Visitor from '#models/visitor'
import { DateTime } from 'luxon'

type CreateVisitorVisitData = {
  visitorId: string
  visitDate: string
  visitDuration?: number | null
  visitType?: 'family' | 'legal' | 'medical' | 'other'
  status?: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
  notes?: string | null
  registeredBy?: string | null
}

export default class CreateVisitorVisitUseCase {
  async execute(data: CreateVisitorVisitData) {
    const visitor = await Visitor.find(data.visitorId)

    if (!visitor) {
      const error = new Error('Visitor não encontrado')
      ;(error as any).status = 404
      ;(error as any).code = 'E_ROW_NOT_FOUND'
      throw error
    }

    const visit = await VisitorVisit.create({
      visitorId: data.visitorId,
      visitDate: DateTime.fromISO(data.visitDate),
      visitDuration: data.visitDuration || null,
      visitType: data.visitType || 'family',
      status: data.status || 'scheduled',
      notes: data.notes || null,
      registeredBy: data.registeredBy || null,
    })

    await visit.load('visitor')
    await visit.load('observations')

    return visit
  }
}
