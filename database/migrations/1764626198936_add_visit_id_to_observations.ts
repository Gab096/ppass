import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    // Adicionar inmate_visit_id à tabela inmate_observations
    this.schema.alterTable('inmate_observations', (table) => {
      table
        .uuid('inmate_visit_id')
        .nullable()
        .references('id')
        .inTable('inmate_visits')
        .onDelete('SET NULL')
        .after('inmate_id')
    })

    // Adicionar visitor_visit_id à tabela visitor_observations
    this.schema.alterTable('visitor_observations', (table) => {
      table
        .uuid('visitor_visit_id')
        .nullable()
        .references('id')
        .inTable('visitor_visits')
        .onDelete('SET NULL')
        .after('visitor_id')
    })
  }

  async down() {
    this.schema.alterTable('inmate_observations', (table) => {
      table.dropColumn('inmate_visit_id')
    })

    this.schema.alterTable('visitor_observations', (table) => {
      table.dropColumn('visitor_visit_id')
    })
  }
}

