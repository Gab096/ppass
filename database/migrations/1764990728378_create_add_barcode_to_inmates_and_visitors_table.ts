import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    // Adicionar campo barcode na tabela inmates
    this.schema.alterTable('inmates', (table) => {
      table.string('barcode').nullable().unique().after('registration_number')
    })

    // Adicionar campo barcode na tabela visitors
    this.schema.alterTable('visitors', (table) => {
      table.string('barcode').nullable().unique().after('document_number')
    })
  }

  async down() {
    // Remover campo barcode da tabela inmates
    this.schema.alterTable('inmates', (table) => {
      table.dropColumn('barcode')
    })

    // Remover campo barcode da tabela visitors
    this.schema.alterTable('visitors', (table) => {
      table.dropColumn('barcode')
    })
  }
}
