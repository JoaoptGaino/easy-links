import express, { Router } from 'express';
import UsersController from './controllers/UsersController';
import AllLinksController from './controllers/AllLinksController';

const usersController = new UsersController();
const allLinksController = new AllLinksController();
const routes = express.Router();


routes.get('/',(req,res)=>{
    res.json({
        message:"Hello from route",
    });
});


routes.post('/users',usersController.create);
routes.get('/users',usersController.index);


//-------------------- LINKS ---------------------//
routes.post('/link',allLinksController.create);
routes.get('/link',allLinksController.show);


export default routes;