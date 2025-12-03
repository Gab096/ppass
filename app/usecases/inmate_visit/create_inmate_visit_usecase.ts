import InmateVisit from '#models/inmate_visit'
import Inmate from '#models/inmate'
import { DateTime } from 'luxon'

type CreateInmateVisitData = {
  inmateId: number
  visitorName: string
  visitorDocument?: string | null
  relationship?: string | null
  visitDate: string
  visitDuration?: number | null
  visitType?: 'family' | 'legal' | 'medical' | 'other'
  status?: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
  notes?: string | null
  registeredBy?: string | null
}

export default class CreateInmateVisitUseCase {
  async execute(data: CreateInmateVisitData) {
    const inmate = await Inmate.find(data.inmateId)

    if (!inmate) {
      const error = new Error('Inmate não encontrado')
      ;(error as any).status = 404
      ;(error as any).code = 'E_ROW_NOT_FOUND'
      throw error
    }

    const visit = await InmateVisit.create({
      inmateId: data.inmateId,
      visitorName: data.visitorName,
      visitorDocument: data.visitorDocument || null,
      relationship: data.relationship || null,
      visitDate: DateTime.fromISO(data.visitDate),
      visitDuration: data.visitDuration || null,
      visitType: data.visitType || 'family',
      status: data.status || 'scheduled',
      notes: data.notes || null,
      registeredBy: data.registeredBy || null,
    })

    await visit.load('inmate')
    await visit.load('observations')

    return visit
  }
}
