import { Request, Response } from 'express';
import knex from '../database/database';
import dotenv from 'dotenv'
import catchAsync from '../utils/catchAsync'

dotenv.config()

function ItemsController(){
    const controller = {
        index: (req: Request, res: Response) => {}
    };

    controller.index = catchAsync(async (req: Request, res: Response) => {
        const items = await knex('items').select('*');
        
        const serializeItems = items.map((item) => {
            return { 
                id: item.id,
                title: item.title,
                image_url: `http://192.168.1.4:${process.env.PORT}/uploads/${item.image}`
            }
        })

        return res.status(200).json(serializeItems)
    })

    return controller
}

export default ItemsController