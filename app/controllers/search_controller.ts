import type { HttpContext } from '@adonisjs/core/http'
import SearchByBarcodeUseCase from '#usecases/search_by_barcode_usecase'

export default class SearchController {
  private readonly searchByBarcodeUseCase = new SearchByBarcodeUseCase()

  /**
   * Busca um Inmate ou Visitor por código de barras
   * Retorna status 404 com ação sugerida se não encontrar
   */
  async findByBarcode({ params, response }: HttpContext) {
    const { barcode } = params

    if (!barcode) {
      return response.status(400).json({
        message: 'Código de barras é obrigatório',
      })
    }

    const result = await this.searchByBarcodeUseCase.execute(barcode)

    if (!result) {
      return response.status(404).json({
        message: 'Nenhum registro encontrado com este código de barras',
        barcode,
        status: 'not_found',
        actions: [
          {
            type: 'create_inmate',
            message: 'Criar novo Inmate',
          },
          {
            type: 'create_visitor',
            message: 'Criar novo Visitor',
          },
        ],
      })
    }

    return response.json({
      type: result.type,
      data: result.data,
    })
  }
}

