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


//-------------------- USERS ---------------------//
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
routes.post('/auth', usersController.auth);
routes.put('/users', usersController.update);
routes.delete('/users/:user', usersController.delete);
routes.get('/allusers', usersController.count);
routes.get('/oneUser/:username', usersController.showOne);



//-------------------- LINKS ---------------------//
routes.post('/link', allLinksController.create);
routes.get('/:user', allLinksController.read);
routes.put('/:user/:id', allLinksController.update)
routes.delete('/:user/:id', allLinksController.delete);



export default routes;