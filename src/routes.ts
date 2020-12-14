import express from 'express';
import multer from 'multer';
import UsersController from './controllers/UsersController';
import AllLinksController from './controllers/AllLinksController';
import multerConfig from './config/multer';
import { celebrate, Joi } from 'celebrate';

const usersController = new UsersController();
const allLinksController = new AllLinksController();
const routes = express.Router();
const upload = multer(multerConfig);

routes.get('/', (req, res) => {
    res.json({
        message: "Hello from route",
    });
});


routes.post('/users',
    upload.single('image'),
    celebrate({
        body: Joi.object().keys({
            name: Joi.string().required(),
            username: Joi.string().required(),
            email: Joi.string().required(),
            password: Joi.string().required()
        })
    }, {
        abortEarly: false
    }),
    usersController.create);
routes.get('/users', usersController.index);


//-------------------- LINKS ---------------------//
routes.post('/link', allLinksController.create);
routes.get('/:user', allLinksController.show);

routes.delete('/:user/:id',allLinksController.remove);


export default routes;