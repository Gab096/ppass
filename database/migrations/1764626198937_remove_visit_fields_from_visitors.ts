import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.alterTable('visitors', (table) => {
      table.dropColumn('visit_date')
      table.dropColumn('visit_duration')
    })
  }

  async down() {
    this.schema.alterTable('visitors', (table) => {
      table.timestamp('visit_date').notNullable()
      table.integer('visit_duration').nullable().comment('Duration in minutes')
    })
  }
}

