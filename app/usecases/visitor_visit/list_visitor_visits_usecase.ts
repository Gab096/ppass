import VisitorVisit from '#models/visitor_visit'

export default class ListVisitorVisitsUseCase {
  async execute(visitorId?: number, page: number = 1, limit: number = 10) {
    const query = VisitorVisit.query()
      .preload('visitor')
      .preload('observations')
      .orderBy('visit_date', 'desc')

    if (visitorId) {
      query.where('visitor_id', visitorId)
    }

    const visits = await query.paginate(page, limit)

    return visits
  }
}

