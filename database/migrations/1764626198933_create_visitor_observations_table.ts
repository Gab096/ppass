import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'visitor_observations'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table
        .integer('visitor_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('visitors')
        .onDelete('CASCADE')
      table.string('title').notNullable()
      table.text('description').notNullable()
      table.enum('observation_type', ['behavioral', 'suspicious', 'compliant', 'general']).defaultTo('general')
      table.string('observed_by').nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

