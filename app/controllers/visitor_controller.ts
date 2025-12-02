import type { HttpContext } from '@adonisjs/core/http'
import CreateVisitorUseCase from '#usecases/visitor/create_visitor_usecase'
import ListVisitorsUseCase from '#usecases/visitor/list_visitors_usecase'
import { createVisitorValidator } from '#validators/visitor_validator'

export default class VisitorController {
  private readonly createUseCase = new CreateVisitorUseCase()
  private readonly listUseCase = new ListVisitorsUseCase()

  /**
   * Lista todos os visitantes
   */
  async index({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)
    const inmateId = request.input('inmate_id')

    const result = await this.listUseCase.execute(inmateId ? Number(inmateId) : undefined, page, limit)

    return response.json(result)
  }

  /**
   * Cria um novo visitante
   */
  async store({ request, response }: HttpContext) {
    const data = await request.validateUsing(createVisitorValidator)
    const visitor = await this.createUseCase.execute(data)

    return response.status(201).json(visitor)
  }
}

