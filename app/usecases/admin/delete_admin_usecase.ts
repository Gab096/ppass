import Admin from '#models/admin'

export default class DeleteAdminUseCase {
  /**
   * Deleta um administrador (apenas super admin pode executar)
   * Não permite deletar o próprio super admin
   */
  async execute(adminId: string, currentAdminId: string): Promise<void> {
    // Não permitir deletar a si mesmo
    if (adminId === currentAdminId) {
      throw new Error('Você não pode deletar sua própria conta')
    }

    const admin = await Admin.findOrFail(adminId)

    // Não permitir deletar outro super admin (accessLevel 1)
    if (admin.accessLevel === 1) {
      throw new Error('Não é possível deletar um super administrador')
    }

    await admin.delete()
  }
}

