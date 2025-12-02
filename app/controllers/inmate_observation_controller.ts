import type { HttpContext } from '@adonisjs/core/http'
import CreateInmateObservationUseCase from '#usecases/inmate_observation/create_inmate_observation_usecase'
import ListInmateObservationsUseCase from '#usecases/inmate_observation/list_inmate_observations_usecase'
import { createInmateObservationValidator } from '#validators/observation_validator'

export default class InmateObservationController {
  private readonly createUseCase = new CreateInmateObservationUseCase()
  private readonly listUseCase = new ListInmateObservationsUseCase()

  /**
   * Lista todas as observações de detentos
   */
  async index({ request, params, response }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)
    const inmateId = params.inmateId ? Number(params.inmateId) : request.input('inmate_id')

    const result = await this.listUseCase.execute(inmateId ? Number(inmateId) : undefined, page, limit)

    return response.json(result)
  }

  /**
   * Cria uma nova observação de detento
   */
  async store({ request, params, response }: HttpContext) {
    const data = await request.validateUsing(createInmateObservationValidator)
    
    // Se vier da rota aninhada, usar o inmateId da URL
    const inmateId = params.inmateId ? Number(params.inmateId) : data.inmateId
    
    if (!inmateId) {
      return response.badRequest({ message: 'inmateId é obrigatório' })
    }
    
    const observation = await this.createUseCase.execute({
      ...data,
      inmateId,
    })

    return response.status(201).json(observation)
  }
}

