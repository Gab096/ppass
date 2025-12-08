import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'visitor_statuses'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('gen_random_uuid()'))
      table
        .uuid('visitor_id')
        .notNullable()
        .references('id')
        .inTable('visitors')
        .onDelete('CASCADE')
      table.enum('status', ['liberado', 'bloqueado', 'atenção']).notNullable()
      table.boolean('active').defaultTo(false).notNullable()
      table.text('notes').nullable().comment('Observações sobre o status')

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()

      // Índice para garantir apenas um status ativo por visitor
      table.index(['visitor_id', 'active'], 'visitor_statuses_visitor_active_idx')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}