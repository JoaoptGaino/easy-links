/*
User Controller, here I'll put the functions to create, remove, show, authenticate and update a user.
*/
import { Request, Response } from 'express';
import db from '../database/connection';


export default class UsersController {
    async create(req: Request, res: Response) {
        const {
            image,
            name,
            username,
            email,
            password
        } = req.body;
        const user = { image, name, username, email, password };
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
            return res
                .json(users);
        }catch(err){
            return res.status(500).json({
                error:"Internal error"
            });
        }
    }
}