import VisitorCheckin from '#models/visitor_checkin'

export default class ListVisitorCheckinsUseCase {
  async execute(visitorId: string, page: number = 1, limit: number = 100) {
    const query = VisitorCheckin.query()
      .where('visitor_id', visitorId)
      .preload('visitor')
      .preload('admin')
      .preload('observation')
      .orderBy('created_at', 'desc')

    const checkins = await query.paginate(page, limit)

    return checkins
  }
}
