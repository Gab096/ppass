import type { HttpContext } from '@adonisjs/core/http'
import CreateInmateVisitUseCase from '#usecases/inmate_visit/create_inmate_visit_usecase'
import ListInmateVisitsUseCase from '#usecases/inmate_visit/list_inmate_visits_usecase'
import { createInmateVisitValidator } from '#validators/inmate_visit_validator'

export default class InmateVisitController {
  private readonly createUseCase = new CreateInmateVisitUseCase()
  private readonly listUseCase = new ListInmateVisitsUseCase()

  /**
   * Lista todas as visitas de detentos
   */
  async index({ request, params, response }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)
    const inmateId = params.inmateId ? Number(params.inmateId) : request.input('inmate_id')

    const result = await this.listUseCase.execute(
      inmateId ? Number(inmateId) : undefined,
      page,
      limit
    )

    return response.json(result)
  }

  /**
   * Cria uma nova visita de detento
   */
  async store({ request, params, response }: HttpContext) {
    const data = await request.validateUsing(createInmateVisitValidator)

    // Se vier da rota aninhada, usar o inmateId da URL
    const inmateId = params.inmateId ? Number(params.inmateId) : data.inmateId

    if (!inmateId) {
      return response.badRequest({ message: 'inmateId é obrigatório' })
    }

    const visit = await this.createUseCase.execute({
      ...data,
      inmateId,
      visitDate: data.visitDate.toISOString(),
    })

    return response.status(201).json(visit)
  }
}
