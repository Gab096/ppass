import app from '@adonisjs/core/services/app'
import { HttpContext, ExceptionHandler } from '@adonisjs/core/http'

export default class HttpExceptionHandler extends ExceptionHandler {
  /**
   * In debug mode, the exception handler will display verbose errors
   * with pretty printed stack traces.
   */
  protected debug = !app.inProduction

  /**
   * The method is used for handling errors and returning
   * response to the client
   */
  async handle(error: unknown, ctx: HttpContext) {
    // Tratar erros de autenticação do AdonisJS
    // Verificar se é erro de autenticação através do código ou nome da exceção
    if (error && typeof error === 'object') {
      const errorObj = error as any
      
      // Verificar código de erro
      if (errorObj.code === 'E_UNAUTHORIZED_ACCESS' || errorObj.code === 'E_INVALID_ACCESS_TOKEN') {
        return ctx.response.status(401).json({
          message: 'Sessão expirada. Por favor, faça login novamente.',
          code: errorObj.code,
        })
      }

      // Verificar nome da exceção
      if (
        errorObj.name === 'E_UNAUTHORIZED_ACCESS' ||
        errorObj.constructor?.name === 'E_UNAUTHORIZED_ACCESS'
      ) {
        return ctx.response.status(401).json({
          message: 'Sessão expirada. Por favor, faça login novamente.',
          code: 'E_UNAUTHORIZED_ACCESS',
        })
      }
    }

    return super.handle(error, ctx)
  }

  /**
   * The method is used to report error to the logging service or
   * the third party error monitoring service.
   *
   * @note You should not attempt to send a response from this method.
   */
  async report(error: unknown, ctx: HttpContext) {
    return super.report(error, ctx)
  }
}
