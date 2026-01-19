import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import AutoCheckoutVisitorsUseCase from '#usecases/visitor_checkin/auto_checkout_visitors_usecase'
import Admin from '#models/admin'

export default class AutoCheckoutVisitors extends BaseCommand {
  static commandName = 'auto:checkout-visitors'
  static description = 'Faz check-out automático de todos os visitantes com check-in aberto às 18h'

  static options: CommandOptions = {
    startApp: true, // Inicializa a aplicação para ter acesso aos models
  }

  async run() {
    this.logger.info('Iniciando check-out automático de visitantes...')

    try {
      // Tentar obter um admin do sistema para associar ao check-out
      // Se não encontrar, usa null (sistema)
      // Tratar erro caso a tabela não exista (migrações não rodadas)
      let systemAdminId: string | null = null
      try {
        const systemAdmin = await Admin.query().first()
        systemAdminId = systemAdmin?.id || null
      } catch (error: any) {
        // Se a tabela não existir, continuar com null (sistema)
        if (error.code === '42P01' || error.message?.includes('does not exist')) {
          this.logger.info('Tabela admins não encontrada. Usando sistema como responsável.')
        } else {
          throw error
        }
      }

      const useCase = new AutoCheckoutVisitorsUseCase()
      const result = await useCase.execute(systemAdminId)

      if (result.processed > 0) {
        this.logger.success(result.message)
        this.logger.info(`Check-outs criados:`)
        result.checkouts?.forEach((checkout) => {
          this.logger.info(
            `  - Visitante: ${checkout.visitorName} (ID: ${checkout.visitorId}) às ${checkout.createdAt.toFormat('dd/MM/yyyy HH:mm')}`
          )
        })
      } else {
        this.logger.info(result.message)
      }
    } catch (error: any) {
      this.logger.error('Erro ao executar check-out automático:', error.message)
      this.exitCode = 1
    }
  }
}
