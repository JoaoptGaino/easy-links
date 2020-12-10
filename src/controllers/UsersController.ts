import { Request, Response } from 'express';
import db from '../database/connection';


export default class UsersController {
    async create(req: Request, res: Response) {
        const {
            name,
            username,
            email,
            password
        } = req.body;
        const user = { name, username, email, password };
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
}