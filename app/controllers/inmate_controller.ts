import type { HttpContext } from '@adonisjs/core/http'
import CreateInmateUseCase from '#usecases/inmate/create_inmate_usecase'
import ListInmatesUseCase from '#usecases/inmate/list_inmates_usecase'
import GetInmateUseCase from '#usecases/inmate/get_inmate_usecase'
import UpdateInmateUseCase from '#usecases/inmate/update_inmate_usecase'
import DeleteInmateUseCase from '#usecases/inmate/delete_inmate_usecase'
import { createInmateValidator, updateInmateValidator } from '#validators/inmate_validator'

export default class InmateController {
  private readonly createUseCase = new CreateInmateUseCase()
  private readonly listUseCase = new ListInmatesUseCase()
  private readonly getUseCase = new GetInmateUseCase()
  private readonly updateUseCase = new UpdateInmateUseCase()
  private readonly deleteUseCase = new DeleteInmateUseCase()

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
    const inmate = await this.createUseCase.execute({
      ...data,
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
    const inmate = await this.updateUseCase.execute(params.id, {
      ...data,
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
}
