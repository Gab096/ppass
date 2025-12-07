import Visitor from '#models/visitor'

export default class ListVisitorsUseCase {
  async execute(inmateId?: number, page: number = 1, limit: number = 10) {
    const query = Visitor.query().preload('inmate').orderBy('created_at', 'desc')

    if (inmateId) {
      query.where('inmate_id', inmateId)
    }

    const visitors = await query.paginate(page, limit)

    return visitors
  }
}

