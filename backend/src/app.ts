//dependencies and core modules
import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors'
import { errors } from 'celebrate'

//my modules
import routes from './routes';

//app
const app = express();

//uncaughtExceptions handler
process.on('uncaughtException', (err) => {
    console.log('ERROR: ' + err);
    process.exit();
})

//dotenv configuration
dotenv.config();

//middlewares and routes
app.use(cors())
app.use(express.json())
app.use(routes);
app.use(errors())

app.use('/uploads', express.static('uploads'))

//start server
app.listen(process.env.PORT, () => 
    console.log(`Listening to requests on port ${process.env.PORT}`)
);

process.on('unhandledRejection', (err) => {
    console.log('Unhandled promise rejection: ' + err);
    process.exit();
})