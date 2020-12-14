import { Request, Response } from 'express';
import db from '../database/connection';


export default class AllLinksController {
    async remove(req: Request, res: Response) {
        const { user, id } = req.params;
        if (!user) {
            return res.status(500).json({
                message: `User was not specified`
            });
        }
        try {
            const users = await db('users').where('username', '=', user).select('*');
            const usersArray = JSON.stringify(users);
            const usersJson = JSON.parse(usersArray);
            const userid = usersJson[0].id;

            const deletedItem = await db('allLinks').where('user_id', '=', userid).andWhere('id', '=', id).delete();
            console.log(deletedItem);
            if (deletedItem > 0) {
                return res.status(200).json({
                    message: "Deleted successfuly"
                });
            }else{
                return res.status(404).json({
                    message:"Couldn't find link"
                })
            }
        } catch (err) {
            return res.status(404).json({
                message: "Couldn't find anything"
            })
        }
    }
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
                .select('allLinks.id', 'allLinks.url', 'allLinks.link_name', 'users.username')
                .orderBy('id');
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
                message: "Created new link",
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