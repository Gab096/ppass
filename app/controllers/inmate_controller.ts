import type { HttpContext } from '@adonisjs/core/http'
import CreateInmateUseCase from '#usecases/inmate/create_inmate_usecase'
import ListInmatesUseCase from '#usecases/inmate/list_inmates_usecase'
import GetInmateUseCase from '#usecases/inmate/get_inmate_usecase'
import UpdateInmateUseCase from '#usecases/inmate/update_inmate_usecase'
import DeleteInmateUseCase from '#usecases/inmate/delete_inmate_usecase'
import FindInmateByBarcodeUseCase from '#usecases/inmate/find_inmate_by_barcode_usecase'
import UpdateInmateStatusUseCase from '#usecases/inmate/update_inmate_status_usecase'
import { createInmateValidator, updateInmateValidator } from '#validators/inmate_validator'
import FileUploadService from '#services/file_upload_service'

export default class InmateController {
  private readonly createUseCase = new CreateInmateUseCase()
  private readonly listUseCase = new ListInmatesUseCase()
  private readonly getUseCase = new GetInmateUseCase()
  private readonly updateUseCase = new UpdateInmateUseCase()
  private readonly deleteUseCase = new DeleteInmateUseCase()
  private readonly findByBarcodeUseCase = new FindInmateByBarcodeUseCase()
  private readonly updateStatusUseCase = new UpdateInmateStatusUseCase()
  private readonly fileUploadService = new FileUploadService()

  /**
   * Lista todos os detentos
   */
  async index({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)
    const status = request.input('status')

    const result = await this.listUseCase.execute(page, limit, status)

    return response.json(result)
  }

  /**
   * Cria um novo detento
   */
  async store({ request, response }: HttpContext) {
    const data = await request.validateUsing(createInmateValidator)
    
    // Processar upload de foto se existir
    let profilePhoto: string | null = null
    const photoFile = request.file('profilePhoto')
    if (photoFile && photoFile.isValid) {
      profilePhoto = await this.fileUploadService.saveProfilePhoto(photoFile, 'inmates')
    }

    const inmate = await this.createUseCase.execute({
      ...data,
      profilePhoto,
      dateOfBirth: data.dateOfBirth ? data.dateOfBirth.toISOString() : null,
      admissionDate: data.admissionDate.toISOString(),
      releaseDate: data.releaseDate ? data.releaseDate.toISOString() : null,
    })

    return response.status(201).json(inmate)
  }

  /**
   * Exibe um detento específico
   */
  async show({ params, response }: HttpContext) {
    const inmate = await this.getUseCase.execute(params.id)

    return response.json(inmate)
  }

  /**
   * Atualiza um detento
   */
  async update({ params, request, response }: HttpContext) {
    const data = await request.validateUsing(updateInmateValidator)
    
    // Processar upload de foto se existir
    let profilePhoto: string | undefined = undefined
    const photoFile = request.file('profilePhoto')
    if (photoFile && photoFile.isValid) {
      // Buscar inmate atual para deletar foto antiga se existir
      const currentInmate = await this.getUseCase.execute(params.id)
      if (currentInmate.profilePhoto) {
        await this.fileUploadService.deleteProfilePhoto(currentInmate.profilePhoto)
      }
      
      profilePhoto = await this.fileUploadService.saveProfilePhoto(photoFile, 'inmates')
    }

    const inmate = await this.updateUseCase.execute(params.id, {
      ...data,
      profilePhoto,
      dateOfBirth: data.dateOfBirth ? data.dateOfBirth.toISOString() : null,
      admissionDate: data.admissionDate ? data.admissionDate.toISOString() : undefined,
      releaseDate: data.releaseDate ? data.releaseDate.toISOString() : null,
    })

    return response.json(inmate)
  }

  /**
   * Remove um detento
   */
  async destroy({ params, response }: HttpContext) {
    await this.deleteUseCase.execute(params.id)

    return response.noContent()
  }

  /**
   * Busca um detento por código de barras
   */
  async findByBarcode({ params, response }: HttpContext) {
    const { barcode } = params

    if (!barcode) {
      return response.status(400).json({
        message: 'Código de barras é obrigatório',
      })
    }

    const inmate = await this.findByBarcodeUseCase.execute(barcode)

    if (!inmate) {
      return response.status(404).json({
        message: 'Inmate não encontrado com este código de barras',
        barcode,
        action: 'create_inmate',
        status: 'not_found',
      })
    }

    return response.json(inmate)
  }

  /**
   * Atualiza o status de um detento
   */
  async updateStatus({ params, request, response, auth }: HttpContext) {
    const { status, notes } = request.only(['status', 'notes'])

    if (!status || !['liberado', 'bloqueado', 'atenção'].includes(status)) {
      return response.status(400).json({
        message: 'Status inválido. Deve ser: liberado, bloqueado ou atenção',
      })
    }

    const admin = auth.getUserOrFail()
    const inmateStatus = await this.updateStatusUseCase.execute(params.id, {
      status: status as 'liberado' | 'bloqueado' | 'atenção',
      notes: notes || null,
      adminId: admin.id,
    })

    return response.json(inmateStatus)
  }
}
