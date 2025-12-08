import VisitorObservation from '#models/visitor_observation'

type UpdateVisitorObservationData = {
  title?: string
  description?: string
  observationType?: 'behavioral' | 'suspicious' | 'compliant' | 'general'
  observedBy?: string | null
}

export default class UpdateVisitorObservationUseCase {
  async execute(observationId: string, data: UpdateVisitorObservationData) {
    const observation = await VisitorObservation.findOrFail(observationId)

    if (data.title !== undefined) {
      observation.title = data.title
    }

    if (data.description !== undefined) {
      observation.description = data.description
    }

    if (data.observationType !== undefined) {
      observation.observationType = data.observationType
    }

    if (data.observedBy !== undefined) {
      observation.observedBy = data.observedBy
    }

    await observation.save()
    await observation.load('visitor')
    if (observation.visitorVisitId) {
      await observation.load('visit')
    }

    return observation
  }
}

