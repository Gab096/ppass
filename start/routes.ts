/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
import app from '@adonisjs/core/services/app'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

// Rotas públicas
router.get('/', async () => {
  return {
    hello: 'world',
  }
})

// Rota para servir arquivos estáticos (fotos de perfil)
router.get('/uploads/:folder/:filename', async ({ params, response }) => {
  try {
    const { folder, filename } = params
    const filePath = join(app.makePath('public'), 'uploads', folder, filename)
    
    console.log('Tentando servir arquivo:', filePath)
    
    // Verificar se o arquivo existe
    const { existsSync } = await import('node:fs')
    if (!existsSync(filePath)) {
      console.error('Arquivo não encontrado:', filePath)
      return response.status(404).json({ message: 'Arquivo não encontrado', path: filePath })
    }
    
    const file = await readFile(filePath)
    const ext = filename.split('.').pop()?.toLowerCase()
    
    // Mapeamento de extensões para tipos MIME
    const mimeTypes: Record<string, string> = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'webp': 'image/webp',
      'gif': 'image/gif',
      'bmp': 'image/bmp',
      'tiff': 'image/tiff',
      'tif': 'image/tiff',
      'heic': 'image/heic',
      'heif': 'image/heif',
      'svg': 'image/svg+xml',
    }
    
    const contentType = ext ? (mimeTypes[ext] || 'application/octet-stream') : 'application/octet-stream'
    
    console.log('Arquivo servido com sucesso:', filename, 'Tipo:', contentType)
    return response.type(contentType).send(file)
  } catch (error: any) {
    console.error('Erro ao servir arquivo:', error)
    return response.status(404).json({ message: 'Arquivo não encontrado', error: error.message })
  }
})

// Rotas de autenticação de admin (públicas)
router.post('/admin/login', '#controllers/admin_auth_controller.login')

// Rotas protegidas do dashboard admin
router
  .group(() => {
    router.get('/admin/dashboard', '#controllers/admin_dashboard_controller.index')
    router.get('/admin/profile', '#controllers/admin_auth_controller.me')
    router.post('/admin/logout', '#controllers/admin_auth_controller.logout')

    // Rotas de gerenciamento de admins (apenas super admin)
    router
      .group(() => {
        router.get('/admin/admins', '#controllers/admin_management_controller.index')
        router.post('/admin/admins', '#controllers/admin_management_controller.store')
        router.put('/admin/admins/:id', '#controllers/admin_management_controller.update')
        router.delete('/admin/admins/:id', '#controllers/admin_management_controller.destroy')
      })
      .use(middleware.superAdmin())

    // Busca unificada por código de barras (busca em inmates e visitors)
    router.get('/search/barcode/:barcode', '#controllers/search_controller.findByBarcode')

    // Rotas de Inmates (apenas admin pode cadastrar)
    // Busca por código de barras específica de inmates (deve vir antes do resource para evitar conflito)
    router.get('/inmates/barcode/:barcode', '#controllers/inmate_controller.findByBarcode')
    router.post('/inmates/:id/status', '#controllers/inmate_controller.updateStatus')
    router.resource('/inmates', '#controllers/inmate_controller')

    // Rotas de Visitas de Detentos
    router.get('/inmates/:inmateId/visits', '#controllers/inmate_visit_controller.index')
    router.post('/inmates/:inmateId/visits', '#controllers/inmate_visit_controller.store')
    router.get('/inmate-visits', '#controllers/inmate_visit_controller.index')
    router.post('/inmate-visits', '#controllers/inmate_visit_controller.store')

    // Rotas de Observações de Detentos
    router.get(
      '/inmates/:inmateId/observations',
      '#controllers/inmate_observation_controller.index'
    )
    router.post(
      '/inmates/:inmateId/observations',
      '#controllers/inmate_observation_controller.store'
    )
    router.get('/inmate-observations', '#controllers/inmate_observation_controller.index')
    router.post('/inmate-observations', '#controllers/inmate_observation_controller.store')

    // Rotas de Visitors
    // Busca por código de barras (deve vir antes das outras rotas)
    router.get('/visitors/barcode/:barcode', '#controllers/visitor_controller.findByBarcode')
    router.get('/visitors/:id', '#controllers/visitor_controller.show')
    router.post('/visitors/:id/status', '#controllers/visitor_controller.updateStatus')
    router.get('/visitors', '#controllers/visitor_controller.index')
    router.post('/visitors', '#controllers/visitor_controller.store')

    // Rotas de Visitas de Visitantes
    router.get('/visitors/:visitorId/visits', '#controllers/visitor_visit_controller.index')
    router.post('/visitors/:visitorId/visits', '#controllers/visitor_visit_controller.store')
    router.get('/visitor-visits', '#controllers/visitor_visit_controller.index')
    router.post('/visitor-visits', '#controllers/visitor_visit_controller.store')

    // Rotas de Observações de Visitantes
    router.get(
      '/visitors/:visitorId/observations',
      '#controllers/visitor_observation_controller.index'
    )
    router.post(
      '/visitors/:visitorId/observations',
      '#controllers/visitor_observation_controller.store'
    )
    router.put(
      '/visitor-observations/:id',
      '#controllers/visitor_observation_controller.update'
    )
    router.delete(
      '/visitor-observations/:id',
      '#controllers/visitor_observation_controller.destroy'
    )
    router.get('/visitor-observations', '#controllers/visitor_observation_controller.index')
    router.post('/visitor-observations', '#controllers/visitor_observation_controller.store')
  })
  .use(middleware.admin())
