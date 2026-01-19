import type { HttpContext } from '@adonisjs/core/http'
import CreateVisitorCheckinUseCase from '#usecases/visitor_checkin/create_visitor_checkin_usecase'
import ListVisitorCheckinsUseCase from '#usecases/visitor_checkin/list_visitor_checkins_usecase'
import {
  listVisitorCheckinsValidator,
  createVisitorCheckinValidator,
} from '#validators/visitor_checkin_validator'

export default class VisitorCheckinController {
  private readonly createUseCase = new CreateVisitorCheckinUseCase()
  private readonly listUseCase = new ListVisitorCheckinsUseCase()

  /**
   * Lista todos os check-ins/check-outs de um visitante
   */
  async index({ params, request, response }: HttpContext) {
    const { page = 1, limit = 100 } = await request.validateUsing(listVisitorCheckinsValidator)

    const result = await this.listUseCase.execute(params.visitorId, page, limit)

    return response.json(result)
  }

  /**
   * Cria um novo check-in ou check-out
   */
  async store({ params, request, response, auth }: HttpContext) {
    const data = await request.validateUsing(createVisitorCheckinValidator)

    const admin = auth.getUserOrFail()
    const checkin = await this.createUseCase.execute({
      visitorId: params.visitorId,
      checkType: data.check_type,
      adminId: admin.id,
      notes: data.notes || null,
      observationTitle: data.observation_title || null,
      observationDescription: data.observation_description || null,
    })

    return response.status(201).json(checkin)
  }
}
