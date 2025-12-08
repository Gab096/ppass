import Admin from '#models/admin'

type ProfileResult = {
  id: string
  email: string
  fullName: string | null
  accessLevel: number
  cargo: string | null
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
      accessLevel: admin.accessLevel,
      cargo: admin.cargo,
      createdAt: admin.createdAt,
    }
  }
}

