import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'inmate_statuses'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table
        .integer('inmate_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('inmates')
        .onDelete('CASCADE')
      table.enum('status', ['liberado', 'bloqueado', 'atenção']).notNullable()
      table.boolean('active').defaultTo(false).notNullable()
      table.text('notes').nullable().comment('Observações sobre o status')

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()

      // Índice para garantir apenas um status ativo por inmate
      table.index(['inmate_id', 'active'], 'inmate_statuses_inmate_active_idx')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}