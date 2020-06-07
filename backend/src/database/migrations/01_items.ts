import Knex from 'knex'

export async function up(instance: Knex){
    return instance.schema.createTable('items', table => {
        table.increments('id').primary();

        table.string('image').notNullable();
        table.string('title').notNullable();

        table.timestamps();
    })
} //criar

export async function down(instance: Knex){
    return instance.schema.dropTable('items');
} //undo, delete table