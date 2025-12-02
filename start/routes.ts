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

// Rotas públicas
router.get('/', async () => {
  return {
    hello: 'world',
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

    // Rotas de Inmates (apenas admin pode cadastrar)
    router.resource('/inmates', '#controllers/inmate_controller')

    // Rotas de Visitas de Detentos
    router.get('/inmates/:inmateId/visits', '#controllers/inmate_visit_controller.index')
    router.post('/inmates/:inmateId/visits', '#controllers/inmate_visit_controller.store')
    router.get('/inmate-visits', '#controllers/inmate_visit_controller.index')
    router.post('/inmate-visits', '#controllers/inmate_visit_controller.store')

    // Rotas de Observações de Detentos
    router.get('/inmates/:inmateId/observations', '#controllers/inmate_observation_controller.index')
    router.post('/inmates/:inmateId/observations', '#controllers/inmate_observation_controller.store')
    router.get('/inmate-observations', '#controllers/inmate_observation_controller.index')
    router.post('/inmate-observations', '#controllers/inmate_observation_controller.store')

    // Rotas de Visitors
    router.get('/visitors', '#controllers/visitor_controller.index')
    router.post('/visitors', '#controllers/visitor_controller.store')

    // Rotas de Visitas de Visitantes
    router.get('/visitors/:visitorId/visits', '#controllers/visitor_visit_controller.index')
    router.post('/visitors/:visitorId/visits', '#controllers/visitor_visit_controller.store')
    router.get('/visitor-visits', '#controllers/visitor_visit_controller.index')
    router.post('/visitor-visits', '#controllers/visitor_visit_controller.store')

    // Rotas de Observações de Visitantes
    router.get('/visitors/:visitorId/observations', '#controllers/visitor_observation_controller.index')
    router.post('/visitors/:visitorId/observations', '#controllers/visitor_observation_controller.store')
    router.get('/visitor-observations', '#controllers/visitor_observation_controller.index')
    router.post('/visitor-observations', '#controllers/visitor_observation_controller.store')
  })
  .use(middleware.admin())
