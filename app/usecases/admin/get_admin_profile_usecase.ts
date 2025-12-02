import Admin from '#models/admin'

type ProfileResult = {
  id: number
  email: string
  fullName: string | null
  createdAt: Admin['createdAt']
}

export default class GetAdminProfileUseCase {
  /**
   * Retorna os dados básicos do administrador autenticado.
   */
  execute(admin: Admin): ProfileResult {
    return {
      id: admin.id,
      email: admin.email,
      fullName: admin.fullName,
      createdAt: admin.createdAt,
    }
  }
}

