import InmateVisit from '#models/inmate_visit'

export default class ListInmateVisitsUseCase {
  async execute(inmateId?: number, page: number = 1, limit: number = 10) {
    const query = InmateVisit.query()
      .preload('inmate')
      .preload('observations')
      .orderBy('visit_date', 'desc')

    if (inmateId) {
      query.where('inmate_id', inmateId)
    }

    const visits = await query.paginate(page, limit)

    return visits
  }
}

