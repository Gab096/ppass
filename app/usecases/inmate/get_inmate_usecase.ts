import Inmate from '#models/inmate'

export default class GetInmateUseCase {
  async execute(id: number) {
    const inmate = await Inmate.query()
      .where('id', id)
      .preload('observations')
      .preload('visitors')
      .first()

    if (!inmate) {
      const error = new Error('Inmate não encontrado')
      ;(error as any).status = 404
      ;(error as any).code = 'E_ROW_NOT_FOUND'
      throw error
    }

    return inmate
  }
}
