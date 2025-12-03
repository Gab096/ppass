import type { HttpContext } from '@adonisjs/core/http'
import CreateVisitorVisitUseCase from '#usecases/visitor_visit/create_visitor_visit_usecase'
import ListVisitorVisitsUseCase from '#usecases/visitor_visit/list_visitor_visits_usecase'
import { createVisitorVisitValidator } from '#validators/visitor_visit_validator'

export default class VisitorVisitController {
  private readonly createUseCase = new CreateVisitorVisitUseCase()
  private readonly listUseCase = new ListVisitorVisitsUseCase()

  /**
   * Lista todas as visitas de visitantes
   */
  async index({ request, params, response }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)
    const visitorId = params.visitorId ? Number(params.visitorId) : request.input('visitor_id')

    const result = await this.listUseCase.execute(
      visitorId ? Number(visitorId) : undefined,
      page,
      limit
    )

    return response.json(result)
  }

  /**
   * Cria uma nova visita de visitante
   */
  async store({ request, params, response }: HttpContext) {
    const data = await request.validateUsing(createVisitorVisitValidator)

    // Se vier da rota aninhada, usar o visitorId da URL
    const visitorId = params.visitorId ? Number(params.visitorId) : data.visitorId

    if (!visitorId) {
      return response.badRequest({ message: 'visitorId é obrigatório' })
    }

    const visit = await this.createUseCase.execute({
      ...data,
      visitorId,
      visitDate: data.visitDate.toISOString(),
    })

    return response.status(201).json(visit)
  }
}
