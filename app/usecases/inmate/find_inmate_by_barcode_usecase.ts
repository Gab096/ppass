import Inmate from '#models/inmate'

export default class FindInmateByBarcodeUseCase {
  async execute(barcode: string) {
    const inmate = await Inmate.query()
      .where('barcode', barcode)
      .preload('observations')
      .preload('visitors')
      .first()

    return inmate
  }
}

