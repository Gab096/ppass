import Admin from '#models/admin'

type UpdateAdminData = {
  email?: string
  password?: string
  fullName?: string
  accessLevel?: number
  cargo?: string
}

type UpdateAdminResult = {
  id: string
  email: string
  fullName: string | null
  accessLevel: number
  cargo: string | null
  createdAt: Admin['createdAt']
  updatedAt: Admin['updatedAt']
}

export default class UpdateAdminUseCase {
  /**
   * Atualiza um administrador (apenas super admin pode executar)
   */
  async execute(adminId: string, data: UpdateAdminData): Promise<UpdateAdminResult> {
    const admin = await Admin.findOrFail(adminId)

    // Se está atualizando o email, verificar se não existe outro admin com este email
    if (data.email && data.email !== admin.email) {
      const existingAdmin = await Admin.findBy('email', data.email)
      if (existingAdmin) {
        throw new Error('Já existe um administrador com este email')
      }
      admin.email = data.email
    }

    // Atualizar outros campos
    if (data.fullName !== undefined) {
      admin.fullName = data.fullName || null
    }

    if (data.cargo !== undefined) {
      admin.cargo = data.cargo || null
    }

    if (data.password) {
      admin.password = data.password
    }

    if (data.accessLevel !== undefined) {
      // Não permitir que um super admin altere seu próprio nível
      // O super admin deve sempre permanecer como nível 1
      if (admin.accessLevel === 1 && data.accessLevel !== 1) {
        throw new Error('O super administrador não pode alterar seu próprio nível de acesso.')
      }

      // Validar accessLevel (deve ser entre 1 e 5)
      if (data.accessLevel < 1 || data.accessLevel > 5) {
        throw new Error('Nível de acesso deve ser entre 1 e 5')
      }

      // Não permitir alterar para super admin (accessLevel 1) se já existir outro
      // Só pode existir um super admin no sistema (criado pelo seed)
      if (data.accessLevel === 1 && admin.accessLevel !== 1) {
        const existingSuperAdmin = await Admin.findBy('accessLevel', 1)
        if (existingSuperAdmin && existingSuperAdmin.id !== admin.id) {
          throw new Error('Já existe um super administrador no sistema. Não é possível alterar outro admin para super admin.')
        }
      }
      
      admin.accessLevel = data.accessLevel
    }

    await admin.save()

    return {
      id: admin.id,
      email: admin.email,
      fullName: admin.fullName,
      accessLevel: admin.accessLevel,
      cargo: admin.cargo,
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt,
    }
  }
}

