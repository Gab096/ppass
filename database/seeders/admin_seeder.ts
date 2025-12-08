import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Admin from '#models/admin'
import hash from '@adonisjs/core/services/hash'
import { randomUUID } from 'node:crypto'

export default class extends BaseSeeder {
  async run() {
    // Verifica se já existe um admin com este email
    const existingAdmin = await Admin.findBy('email', 'admin@p-pass.com')

    if (existingAdmin) {
      console.log('Admin já existe no banco de dados')
      // Testa se a senha está correta, se não, atualiza
      try {
        await Admin.verifyCredentials('admin@p-pass.com', '12345678')
        console.log('Senha do admin está correta')
      } catch {
        console.log('Senha incorreta, atualizando...')
        existingAdmin.password = await hash.use('scrypt').make('12345678')
        await existingAdmin.save()
        console.log('Senha atualizada com sucesso!')
      }

      // Atualizar accessLevel caso o admin já exista mas não tenha o nível correto
      if (existingAdmin.accessLevel !== 1) {
        existingAdmin.accessLevel = 1
        await existingAdmin.save()
        console.log('AccessLevel do admin atualizado para 1 (super admin)')
      }

      return
    }

    // Cria o admin padrão usando o mesmo hash que o withAuthFinder usa
    // Super admin com accessLevel 1
    // Gera UUID explicitamente
    const adminId = randomUUID()

    const admin = await Admin.create({
      id: adminId,
      fullName: 'Administrador',
      email: 'admin@p-pass.com',
      password: '12345678',
      accessLevel: 1,
    })

    console.log('Admin criado com sucesso!')
    console.log('ID:', admin.id)
    console.log('Email: admin@p-pass.com')
    console.log('Senha: 12345678')
    console.log('AccessLevel: 1 (Super Admin)')
  }
}
