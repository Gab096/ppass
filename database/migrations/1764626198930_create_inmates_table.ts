import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'inmates'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('gen_random_uuid()'))
      table.string('full_name').notNullable()
      table.string('registration_number').notNullable().unique()
      table.date('date_of_birth').nullable()
      table.string('gender', 20).nullable()
      table.string('cell_number').nullable()
      table.enum('status', ['active', 'released', 'transferred']).defaultTo('active')
      table.date('admission_date').notNullable()
      table.date('release_date').nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

