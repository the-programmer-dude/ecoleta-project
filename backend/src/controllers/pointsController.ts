import { Request, Response } from 'express';
import db from '../database/database';
import dotenv from 'dotenv'
import catchAsync from '../utils/catchAsync'

dotenv.config()

interface indexResponse{
    where: Function;
    whereIn: Function;
    join: Function;
    distinct: Function;
    select: Function;
}

function PointsController(){
    const controller = {
        create: (req: Request, res: Response) => {},
        read: (req: Request, res: Response) => {}, 
        index: (req: Request, res: Response) => {}
    }

    controller.create = catchAsync(async (req: Request, res: Response) => {
        const {
            name,
            email, whatsapp, 
            latitude, longitude,
            city, uf,
            items
        } = req.body
        
        if(req.body.length > 9){
            return res.status(400).json({
                message: 'Invalid length, please pass the correct items'
            })
        }

        const trx = await db.transaction()

        const pointFields = {
            image: req.file.filename, 
            name,
            email, 
            whatsapp, 
            latitude, 
            longitude,
            city, 
            uf
        }

        const pointInsertedIds = await trx('points').insert(pointFields)

        const pointItems = items
            .split(',')
            .map((item: string) => Number(item))
            .map((itemId: Number) => {
                return {
                    'item-id': itemId, 
                    'point-id': pointInsertedIds[0]
                }
            })

        await trx('point-items').insert(pointItems)
        await trx.commit()

        return res.status(201).json({
            ...pointFields,
            id: pointInsertedIds[0]
        })
    })

    controller.read = catchAsync(async (req: Request, res: Response) => {
        const { id } = req.params

        const pointsElement = await db('points').select('*').where({ id }).first()

        const items = await db('items')
            .join('point-items', 'items.id', '=', 'point-items.item-id')
            .where('point-items.point-id', id)
            .select('items.title')


        if(!pointsElement)
            return res.status(400).json({ message: 'Point not found' })

        const serializePoint = { 
            ...pointsElement,
            image_url: `http://192.168.1.4:${process.env.PORT}/uploads/${pointsElement.image}`
        }

        return res.status(200).json({ point: serializePoint, items})
    })

    controller.index = catchAsync(async (req: Request, res: Response) => {
        const { city, uf, items } = req.query

        const parsedItems = String(items)
            .split(',')
            .map(element => Number(element.trim()))

        let pointsToShow : indexResponse = db('points')
        .join('point-items', 'points.id', '=', 'point-items.point-id')
        .distinct()
        .select('points.*')

        if(city)
            pointsToShow.where('city', String(city))

        if(uf)
            pointsToShow.where('uf', String(uf))

        if(items)
            pointsToShow.whereIn('point-items.item-id', parsedItems)

        const response : any = await pointsToShow

        const serializePoints = response.map((point: any) => {
            return { 
                ...point, 
                image_url: `http://192.168.1.4:${process.env.PORT}/uploads/${point.image}` 
            }
        })

        return res.status(200).json(serializePoints)
    })

    return controller
}

export default PointsController