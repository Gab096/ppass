import type { HttpContext } from '@adonisjs/core/http'
import ListAdminsUseCase from '#usecases/admin/list_admins_usecase'
import CreateAdminUseCase from '#usecases/admin/create_admin_usecase'
import UpdateAdminUseCase from '#usecases/admin/update_admin_usecase'
import DeleteAdminUseCase from '#usecases/admin/delete_admin_usecase'
import { adminCreateValidator, adminUpdateValidator } from '#validators/admin_management_validator'

export default class AdminManagementController {
  private readonly listUseCase = new ListAdminsUseCase()
  private readonly createUseCase = new CreateAdminUseCase()
  private readonly updateUseCase = new UpdateAdminUseCase()
  private readonly deleteUseCase = new DeleteAdminUseCase()

  /**
   * Lista todos os administradores
   */
  async index({ response }: HttpContext) {
    try {
      const admins = await this.listUseCase.execute()
      return response.json(admins)
    } catch (error: any) {
      return response.status(500).json({ message: error.message || 'Erro ao listar administradores' })
    }
  }

  /**
   * Cria um novo administrador
   */
  async store({ request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(adminCreateValidator)
      const admin = await this.createUseCase.execute(data)
      return response.status(201).json(admin)
    } catch (error: any) {
      return response.status(400).json({ message: error.message || 'Erro ao criar administrador' })
    }
  }

  /**
   * Atualiza um administrador
   */
  async update({ params, request, response }: HttpContext) {
    try {
      const { id } = params
      const data = await request.validateUsing(adminUpdateValidator)
      const admin = await this.updateUseCase.execute(id, data)
      return response.json(admin)
    } catch (error: any) {
      if (error.status === 404) {
        return response.status(404).json({ message: 'Administrador não encontrado' })
      }
      return response.status(400).json({ message: error.message || 'Erro ao atualizar administrador' })
    }
  }

  /**
   * Deleta um administrador
   */
  async destroy({ params, auth, response }: HttpContext) {
    try {
      const { id } = params
      const currentAdmin = auth.getUserOrFail()
      await this.deleteUseCase.execute(id, currentAdmin.id)
      return response.json({ message: 'Administrador deletado com sucesso' })
    } catch (error: any) {
      if (error.status === 404) {
        return response.status(404).json({ message: 'Administrador não encontrado' })
      }
      return response.status(400).json({ message: error.message || 'Erro ao deletar administrador' })
    }
  }
}

