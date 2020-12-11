import { Request, Response } from 'express';
import db from '../database/connection';


export default class AllLinksController {
    async show(req: Request, res: Response) {
        const { user } = req.params;
        if (!user) {
            return res.status(500).json({
                message: "Internal error"
            });
        }
        try {
            const links = await db('allLinks')
                .join('users', 'users.id', '=', 'allLinks.user_id')
                .where('users.username', '=', String(user))
                .select('allLinks.url', 'allLinks.link_name', 'users.username');
            if (links.length === 0) {
                res.status(404).json({
                    message: "Couldn't find any link"
                });
            } else {
                res.status(200).json(links);
            }
        } catch (err) {
            return res.json(err);
        }
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