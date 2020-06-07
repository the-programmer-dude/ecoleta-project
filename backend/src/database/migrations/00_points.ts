import Knex from 'knex'

export async function up(instance: Knex){
    return instance.schema.createTable('points', table => {
        table.increments('id').primary();

        table.string('image').notNullable();
        table.string('name').notNullable();
        table.string('email').notNullable();
        table.integer('whatsapp').notNullable();
        table.decimal('latitude').notNullable();
        table.decimal('longitude').notNullable();
        table.string('city').notNullable();
        table.string('uf', 2).notNullable();
    })
} //criar

export async function down(instance: Knex){
    return instance.schema.dropTable('point');
} //undo, delete table