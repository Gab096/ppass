import VisitorObservation from '#models/visitor_observation'

export default class DeleteVisitorObservationUseCase {
  async execute(observationId: string) {
    const observation = await VisitorObservation.findOrFail(observationId)
    await observation.delete()
    return { success: true }
  }
}

