import knex from 'knex';
import {db_name} from '../configs/index';
const db = knex({
    client: 'mysql',
    connection: {
        host: 'localhost',
        user: 'root',
        password: '',
        database: db_name,
        port: 3306,
    },
    useNullAsDefault: true,
});

export default db;