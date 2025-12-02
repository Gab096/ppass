import VisitorObservation from '#models/visitor_observation'

export default class ListVisitorObservationsUseCase {
  async execute(visitorId?: number, page: number = 1, limit: number = 10) {
    const query = VisitorObservation.query().preload('visitor').orderBy('created_at', 'desc')

    if (visitorId) {
      query.where('visitor_id', visitorId)
    }

    const observations = await query.paginate(page, limit)

    return observations
  }
}

