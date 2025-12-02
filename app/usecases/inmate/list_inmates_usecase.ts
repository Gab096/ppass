import Inmate from '#models/inmate'

export default class ListInmatesUseCase {
  async execute(page: number = 1, limit: number = 10, status?: string) {
    const query = Inmate.query().preload('observations').preload('visitors')

    if (status) {
      query.where('status', status)
    }

    const inmates = await query.paginate(page, limit)

    return inmates
  }
}

