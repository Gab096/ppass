import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'inmate_observations'

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
      table.string('title').notNullable()
      table.text('description').notNullable()
      table.enum('observation_type', ['medical', 'behavioral', 'disciplinary', 'general']).defaultTo('general')
      table.string('observed_by').nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

