import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'visitor_visits'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('gen_random_uuid()'))
      table
        .uuid('visitor_id')
        .notNullable()
        .references('id')
        .inTable('visitors')
        .onDelete('CASCADE')
      table.timestamp('visit_date').notNullable()
      table.integer('visit_duration').nullable().comment('Duration in minutes')
      table.enum('visit_type', ['family', 'legal', 'medical', 'other']).defaultTo('family')
      table.enum('status', ['scheduled', 'in_progress', 'completed', 'cancelled']).defaultTo('scheduled')
      table.text('notes').nullable()
      table.string('registered_by').nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

