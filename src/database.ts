// import { Pool } from 'pg';

// const postgres = require('postgres');
// require('dotenv').config();
// let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;
// PGPASSWORD = decodeURIComponent(`${PGPASSWORD}`);

// const pool = new Pool({
// 	host: PGHOST,
//     database: PGDATABASE,
//     username: PGUSER,
//     password: PGPASSWORD,
//     port: 5432,
//     ssl: true,
//     connection: {
//     	options: `project=${ENDPOINT_ID}`,
//   	}
// 	// connectionString: process.env.POSTGRES_URL + `?sslmode=required`,
// })

// pool.connect((error:any) => {
// 	if(error) throw error;
// 	console.log('Connected DB')
	
// })

// module.exports = pool

// app.js
// const postgres = require('postgres');
// require('dotenv').config();

// let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;
// PGPASSWORD = decodeURIComponent(`${PGPASSWORD}`);

// const sql = postgres({
//   host: PGHOST,
//   database: PGDATABASE,
//   username: PGUSER,
//   password: PGPASSWORD,
//   port: 5432,
//   ssl: 'require',
//   connection: {
//     options: `project=${ENDPOINT_ID}`,
//   },
// });

// async function getPgVersion() {
//   const result = await sql`select version()`;
//   console.log(result);
// }

// getPgVersion();

// module.exports = sql


// app.js (hoặc tên tệp tương ứng)


import { DataSource } from 'typeorm';

import { Category } from './entities/category.entity';
import { User } from './entities/user.entity';
import { Post } from './entities/post.entity';
import { Book } from './entities/book.entity';


require('dotenv').config();

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;
const decodedPassword = decodeURIComponent(`${PGPASSWORD}`);

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: PGHOST,
  database: PGDATABASE,
  username: PGUSER,
  password: decodedPassword,
  port: 5432,
  ssl: true, // Sử dụng SSL
  extra: {
    // Thêm các tùy chọn kết nối khác (nếu cần)
    options: `project=${ENDPOINT_ID}`,
  },
  entities: [
    Category, 
    Post, 
    User, 
    Book
  ],
  synchronize: false,
  logging: true,
  // dropSchema: true,
});
