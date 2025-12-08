import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

/**
 * SuperAdmin middleware é usado para verificar se o admin autenticado
 * tem accessLevel 1 (super admin) e pode gerenciar outros admins.
 */
export default class SuperAdminMiddleware {
  /**
   * A URL para redirecionar quando a autenticação falha
   */
  redirectTo = '/admin/login'

  async handle(ctx: HttpContext, next: NextFn) {
    await ctx.auth.authenticateUsing(['admin'], { loginRoute: this.redirectTo })
    
    const admin = ctx.auth.user
    if (!admin || admin.accessLevel !== 1) {
      return ctx.response.forbidden({ 
        message: 'Acesso negado. Apenas super administradores podem realizar esta ação.' 
      })
    }

    return next()
  }
}

