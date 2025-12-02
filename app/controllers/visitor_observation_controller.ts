import type { HttpContext } from '@adonisjs/core/http'
import CreateVisitorObservationUseCase from '#usecases/visitor_observation/create_visitor_observation_usecase'
import ListVisitorObservationsUseCase from '#usecases/visitor_observation/list_visitor_observations_usecase'
import { createVisitorObservationValidator } from '#validators/observation_validator'

export default class VisitorObservationController {
  private readonly createUseCase = new CreateVisitorObservationUseCase()
  private readonly listUseCase = new ListVisitorObservationsUseCase()

  /**
   * Lista todas as observações de visitantes
   */
  async index({ request, params, response }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)
    const visitorId = params.visitorId ? Number(params.visitorId) : request.input('visitor_id')

    const result = await this.listUseCase.execute(visitorId ? Number(visitorId) : undefined, page, limit)

    return response.json(result)
  }

  /**
   * Cria uma nova observação de visitante
   */
  async store({ request, params, response }: HttpContext) {
    const data = await request.validateUsing(createVisitorObservationValidator)
    
    // Se vier da rota aninhada, usar o visitorId da URL
    const visitorId = params.visitorId ? Number(params.visitorId) : data.visitorId
    
    if (!visitorId) {
      return response.badRequest({ message: 'visitorId é obrigatório' })
    }
    
    const observation = await this.createUseCase.execute({
      ...data,
      visitorId,
    })

    return response.status(201).json(observation)
  }
}

