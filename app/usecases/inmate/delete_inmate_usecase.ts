import Inmate from '#models/inmate'
import { errors } from '@adonisjs/core'

export default class DeleteInmateUseCase {
  async execute(id: number) {
    const inmate = await Inmate.find(id)

    if (!inmate) {
      throw new errors.E_ROW_NOT_FOUND('Inmate não encontrado')
    }

    await inmate.delete()
  }
}

