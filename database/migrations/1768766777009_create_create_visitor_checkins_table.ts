import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'visitor_checkins'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('gen_random_uuid()'))
      table
        .uuid('visitor_id')
        .notNullable()
        .references('id')
        .inTable('visitors')
        .onDelete('CASCADE')
      table
        .uuid('visitor_observation_id')
        .nullable()
        .references('id')
        .inTable('visitor_observations')
        .onDelete('SET NULL')
      table.enum('check_type', ['in', 'out']).notNullable()
      table
        .uuid('admin_id')
        .nullable()
        .references('id')
        .inTable('admins')
        .onDelete('SET NULL')
      table.text('notes').nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()

      // Índices para melhor performance
      table.index(['visitor_id', 'created_at'], 'visitor_checkins_visitor_created_idx')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}