import Knex from 'knex';

export async function seed(instance: Knex){
    await instance('items').insert([
        { title: 'Lights', image: 'lampadas.svg' },
        { title: 'Batteries', image: 'baterias.svg' },
        { title: 'Papers', image: 'papeis-papelao.svg' },
        { title: 'Eletronic waste', image: 'eletronicos.svg' },
        { title: 'Organics waste', image: 'organicos.svg' },
        { title: 'Kitchen oil', image: 'oleo.svg' },
    ])
}