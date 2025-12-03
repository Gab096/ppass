import Inmate from '#models/inmate'

export default class DeleteInmateUseCase {
  async execute(id: number) {
    const inmate = await Inmate.find(id)

    if (!inmate) {
      const error = new Error('Inmate não encontrado')
      ;(error as any).status = 404
      ;(error as any).code = 'E_ROW_NOT_FOUND'
      throw error
    }

    await inmate.delete()
  }
}
