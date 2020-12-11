import { Request, Response } from 'express';
import db from '../database/connection';


export default class AllLinksController {
    async show(req: Request, res: Response) {
        const links = await db('allLinks')
        .join('users', 'users.id', '=', 'allLinks.user_id')
        .select('allLinks.url','allLinks.link_name','users.username');

        return res.status(200).json(links);
    }
    async create(req: Request, res: Response) {
        const { url, link_name, user_id } = req.body;
        const link = { url, link_name, user_id };

        const trx = await db.transaction();

        try {
            await trx('allLinks').insert(link);
            await trx.commit();
            return res.status(201).json({
                message: "Criou novo link",
                link
            });
        } catch (err) {
            await trx.rollback();
            return res.status(400).json({
                message: `Unable to create new link`,
                err
            })
        }
    }
}