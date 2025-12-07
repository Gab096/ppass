import Visitor from '#models/visitor'

export default class FindVisitorByBarcodeUseCase {
  async execute(barcode: string) {
    const visitor = await Visitor.query()
      .where('barcode', barcode)
      .preload('inmate')
      .preload('observations')
      .preload('visits')
      .first()

    return visitor
  }
}

