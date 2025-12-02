import VisitorObservation from '#models/visitor_observation'
import Visitor from '#models/visitor'
import { errors } from '@adonisjs/core'

type CreateVisitorObservationData = {
  visitorId: number
  visitorVisitId?: number | null
  title: string
  description: string
  observationType?: 'behavioral' | 'suspicious' | 'compliant' | 'general'
  observedBy?: string | null
}

export default class CreateVisitorObservationUseCase {
  async execute(data: CreateVisitorObservationData) {
    const visitor = await Visitor.find(data.visitorId)

    if (!visitor) {
      throw new errors.E_ROW_NOT_FOUND('Visitor não encontrado')
    }

    const observation = await VisitorObservation.create({
      visitorId: data.visitorId,
      visitorVisitId: data.visitorVisitId || null,
      title: data.title,
      description: data.description,
      observationType: data.observationType || 'general',
      observedBy: data.observedBy || null,
    })

    await observation.load('visitor')
    if (data.visitorVisitId) {
      await observation.load('visit')
    }

    return observation
  }
}

