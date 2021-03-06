/*
User Controller, here I'll put the functions to create, remove, show, authenticate and update a user.
*/
import { Request, Response } from 'express';
import db from '../database/connection';


export default class UsersController {

    async auth(req: Request, res: Response) {
        const { username, password } = req.body;

        const login = await db('users')
            .where('username', '=', username)
            .andWhere('password', '=', password)
            .select('*');

        if (login.length > 0) {
            res.status(200).json({
                message: "Authenticated"
            });
        } else {
            res.status(400).json({
                message: "Not authenticated"
            });
        }
    }
    async create(req: Request, res: Response) {
        const {
            name,
            username,
            email,
            password
        } = req.body;
        const user = { image: req.file.filename, name, username, email, password };
        const trx = await db.transaction();
        try {
            await trx('users').insert(user);
            await trx.commit();
            return res.status(201).json({
                message: "Created",
                user
            }).send();
        } catch (err) {
            await trx.rollback();
            console.log(err.message);
            res.status(400).json({
                error: 'unable to create new user'
            });
        }
    }
    async index(req: Request, res: Response) {
        try {
            const users = await db('users').select('*');
            const serializedUser = users.map(user => {
                return {
                    id: user.id,
                    name: user.name,
                    username: user.username,
                    email: user.email,
                    password: user.password,
                    image_url: `http://localhost:5050/uploads/${user.image}`
                }
            });
            return res.json(serializedUser);
        } catch (err) {
            return res.status(500).json({
                error: "Internal error"
            });
        }
    }
    async showOne(req: Request, res: Response) {
        const { username } = req.params;
        try {
            const users = await db('users').where('username', '=', username).select('*');
            const serializedUser = users.map(user => {
                return ({
                    id: user.id,
                    name: user.name,
                    username: user.username,
                    email: user.email,
                    image_url: `http://localhost:5050/uploads/${user.image}`
                })
            });
            return res.json(serializedUser);
        } catch (err) {
            return res.status(500).json({
                error: "Internal error"
            })
        }
    }
    async update(req: Request, res: Response) {
        const { name, username, email, password, img_url } = req.body;
        const updatedItems = { name, username, password, img_url };
        try {
            const updateUser = await db('users').where('email', '=', email).update(updatedItems);
            if (updateUser > 0) {
                return res.status(200).json({
                    message: "Updated successfully"
                });
            } else {
                return res.status(404).json({
                    message: "Couldn't find this email"
                });
            }
        } catch (err) {
            return res.status(500).json({
                message: "Internal error"
            });
        }
    }
    async delete(req: Request, res: Response) {
        const { user } = req.params;

        try {
            const deletedUser = await db('users').where('username', '=', user).delete();
            if (deletedUser > 0) {
                return res.status(200).json({
                    message: `${user} deleted succesfuly`
                });
            } else {
                return res.status(404).json({
                    message: `Couldn't find user ${user}`
                });
            }
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                message: "Internal error"
            })
        }
    }
    async count(req: Request, res: Response) {
        const allUsers = await db('users')
            .count('* as total');
        const { total } = allUsers[0];


        return res.json({ total });
    }
}