import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import env from '#start/env'

/**
 * Middleware para validar o header X-App-Key
 * Garante que apenas requisições com a chave correta da aplicação sejam aceitas
 */
export default class AppKeyMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const appKey = ctx.request.header('x-app-key')
    const expectedKey = env.get('APP_KEY')

    if (!appKey) {
      return ctx.response.status(401).json({
        message: 'X-App-Key header é obrigatório',
      })
    }

    if (appKey !== expectedKey) {
      return ctx.response.status(403).json({
        message: 'X-App-Key inválido',
      })
    }

    return next()
  }
}

