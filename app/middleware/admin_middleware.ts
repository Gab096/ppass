import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

/**
 * Admin middleware é usado para autenticar requisições HTTP de administradores
 * e negar acesso a usuários não autenticados ou que não sejam admins.
 */
export default class AdminMiddleware {
  /**
   * A URL para redirecionar quando a autenticação falha
   */
  redirectTo = '/admin/login'

  async handle(ctx: HttpContext, next: NextFn) {
    await ctx.auth.authenticateUsing(['admin'], { loginRoute: this.redirectTo })
    return next()
  }
}

