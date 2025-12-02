import VisitorVisit from '#models/visitor_visit'
import Visitor from '#models/visitor'
import { errors } from '@adonisjs/core'

type CreateVisitorVisitData = {
  visitorId: number
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
      throw new errors.E_ROW_NOT_FOUND('Visitor não encontrado')
    }

    const visit = await VisitorVisit.create({
      visitorId: data.visitorId,
      visitDate: new Date(data.visitDate),
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

