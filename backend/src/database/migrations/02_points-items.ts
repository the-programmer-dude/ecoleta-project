import Knex from 'knex'

export async function up(instance: Knex){
    return instance.schema.createTable('point-items', table => {
        table.increments('id').primary();

        table.integer('point-id')
        .notNullable()
        .references('id')
        .inTable('points');

        table.integer('item-id')
        .notNullable()
        .references('id')
        .inTable('items');

        table.timestamps();
    })
} //criar

export async function down(instance: Knex){
    return instance.schema.dropTable('point-items');
} //undo, delete table