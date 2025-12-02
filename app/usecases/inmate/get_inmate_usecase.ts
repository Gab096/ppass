import Inmate from '#models/inmate'
import { errors } from '@adonisjs/core'

export default class GetInmateUseCase {
  async execute(id: number) {
    const inmate = await Inmate.query()
      .where('id', id)
      .preload('observations')
      .preload('visitors')
      .first()

    if (!inmate) {
      throw new errors.E_ROW_NOT_FOUND('Inmate não encontrado')
    }

    return inmate
  }
}

