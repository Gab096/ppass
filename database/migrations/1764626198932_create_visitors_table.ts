import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'visitors'

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
      table.string('full_name').notNullable()
      table.string('document_number').nullable()
      table.string('relationship').nullable()
      table.timestamp('visit_date').notNullable()
      table.integer('visit_duration').nullable().comment('Duration in minutes')
      table.text('notes').nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

