import express from 'express';
import { celebrate, Joi } from 'celebrate'

import multerConfig from './config/multer'
import multer from 'multer'

import ItemsController from './controllers/itemsController'
import PointsController from './controllers/pointsController'

const Router = express.Router();
const upload = multer(multerConfig);

Router.get('/items', ItemsController().index)

Router.get('/points', PointsController().index)

Router.get('/points/:id', PointsController().read)

Router.post('/points', 
    upload.single('image'), 
    celebrate({
        body: Joi.object().keys({
            name: Joi.string().required(),
            email: Joi.string().required().email(),
            whatsapp: Joi.number().required(),
            latitude: Joi.number().required(),
            longitude: Joi.number().required(),
            city: Joi.string().required(),
            uf: Joi.string().required().max(2),
            items: Joi.string().required()
        })
    }, {
        abortEarly: false
    }),
    PointsController().create
)

export default Router