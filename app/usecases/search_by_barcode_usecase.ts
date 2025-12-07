import Inmate from '#models/inmate'
import Visitor from '#models/visitor'

type SearchResult = {
  type: 'inmate' | 'visitor'
  data: Inmate | Visitor
} | null

export default class SearchByBarcodeUseCase {
  async execute(barcode: string): Promise<SearchResult> {
    // Buscar primeiro em inmates
    const inmate = await Inmate.query()
      .where('barcode', barcode)
      .preload('observations')
      .preload('visitors')
      .first()

    if (inmate) {
      return {
        type: 'inmate',
        data: inmate,
      }
    }

    // Se não encontrou em inmates, buscar em visitors
    const visitor = await Visitor.query()
      .where('barcode', barcode)
      .preload('inmate')
      .preload('observations')
      .preload('visits')
      .first()

    if (visitor) {
      return {
        type: 'visitor',
        data: visitor,
      }
    }

    // Não encontrado em nenhum
    return null
  }
}

