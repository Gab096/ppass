import type { HttpContext } from '@adonisjs/core/http'
import CreateVisitorUseCase from '#usecases/visitor/create_visitor_usecase'
import ListVisitorsUseCase from '#usecases/visitor/list_visitors_usecase'
import FindVisitorByBarcodeUseCase from '#usecases/visitor/find_visitor_by_barcode_usecase'
import GetVisitorUseCase from '#usecases/visitor/get_visitor_usecase'
import UpdateVisitorStatusUseCase from '#usecases/visitor/update_visitor_status_usecase'
import { createVisitorValidator } from '#validators/visitor_validator'
import FileUploadService from '#services/file_upload_service'

export default class VisitorController {
  private readonly createUseCase = new CreateVisitorUseCase()
  private readonly listUseCase = new ListVisitorsUseCase()
  private readonly getUseCase = new GetVisitorUseCase()
  private readonly findByBarcodeUseCase = new FindVisitorByBarcodeUseCase()
  private readonly updateStatusUseCase = new UpdateVisitorStatusUseCase()
  private readonly fileUploadService = new FileUploadService()

  /**
   * Lista todos os visitantes
   */
  async index({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)
    const inmateId = request.input('inmate_id')

    const result = await this.listUseCase.execute(inmateId || undefined, page, limit)

    return response.json(result)
  }

  /**
   * Cria um novo visitante
   */
  async store({ request, response }: HttpContext) {
    const data = await request.validateUsing(createVisitorValidator)
    
    // Processar upload de foto se existir
    let profilePhoto: string | null = null
    const photoFile = request.file('profilePhoto')
    if (photoFile && photoFile.isValid) {
      profilePhoto = await this.fileUploadService.saveProfilePhoto(photoFile, 'visitors')
    }

    const visitor = await this.createUseCase.execute({
      ...data,
      profilePhoto,
    })

    return response.status(201).json(visitor)
  }

  /**
   * Exibe um visitante específico
   */
  async show({ params, response }: HttpContext) {
    const visitor = await this.getUseCase.execute(params.id)

    return response.json(visitor)
  }

  /**
   * Busca um visitante por código de barras
   */
  async findByBarcode({ params, response }: HttpContext) {
    const { barcode } = params

    if (!barcode) {
      return response.status(400).json({
        message: 'Código de barras é obrigatório',
      })
    }

    const visitor = await this.findByBarcodeUseCase.execute(barcode)

    if (!visitor) {
      return response.status(404).json({
        message: 'Visitor não encontrado com este código de barras',
        barcode,
        action: 'create_visitor',
        status: 'not_found',
      })
    }

    return response.json(visitor)
  }

  /**
   * Atualiza o status de um visitante
   */
  async updateStatus({ params, request, response, auth }: HttpContext) {
    const { status, notes } = request.only(['status', 'notes'])

    if (!status || !['liberado', 'bloqueado', 'atenção'].includes(status)) {
      return response.status(400).json({
        message: 'Status inválido. Deve ser: liberado, bloqueado ou atenção',
      })
    }

    const admin = auth.getUserOrFail()
    const visitorStatus = await this.updateStatusUseCase.execute(params.id, {
      status: status as 'liberado' | 'bloqueado' | 'atenção',
      notes: notes || null,
      adminId: admin.id,
    })

    return response.json(visitorStatus)
  }
}

