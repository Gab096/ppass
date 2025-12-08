import Visitor from '#models/visitor'

export default class GetVisitorUseCase {
  async execute(id: string) {
    const visitor = await Visitor.query()
      .where('id', id)
      .preload('inmate')
      .preload('observations')
      .preload('visits')
      .preload('statuses', (query) => {
        query.preload('admin')
      })
      .first()

    if (!visitor) {
      const error = new Error('Visitor não encontrado')
      ;(error as any).status = 404
      ;(error as any).code = 'E_ROW_NOT_FOUND'
      throw error
    }

    return visitor
  }
}


