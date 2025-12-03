import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Admin from '#models/admin'
import hash from '@adonisjs/core/services/hash'

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
      return
    }

    // Cria o admin padrão usando o mesmo hash que o withAuthFinder usa

    await Admin.firstOrCreate({
      fullName: 'Administrador',
      email: 'admin@p-pass.com',
      password: '12345678',
    })

    console.log('Admin criado com sucesso!')
    console.log('Email: admin@p-pass.com')
    console.log('Senha: 12345678')
  }
}
