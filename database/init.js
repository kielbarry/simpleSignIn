const path = require('path')

require("dotenv").config({ path : path.join(__dirname, "../.env") })

const 
pg = require('pg'),
username = process.env.PGUSER,
password = process.env.PGPASSWORD,
host = process.env.PGHOST,
database = process.env.PGDATABASE,
port = process.env.PGPORT,
conn = process.env.DATABASE_URL || `postgres://${username}:${password}@${host}:${port}/${database}`,
client = new pg.Client(conn);

console.log()

function initQuery() {
	console.log('in initQuery')

	client.connect();
	// const query = client.query(
	//   `CREATE TABLE IF NOT EXISTS users(
	// 	id INT SERIAL PRIMARY KEY,
	// 	versionid STRING,
	// 	createdat DATE,
	// 	firstname STRING,
	// 	lastname STRING,
	// 	email STRING NOT NULL UNIQUE,
	// 	passwordHash STRING NOT NULL,
	// 	activationCode STRING NOT NULL VARCHAR(60),
	// 	emailVerified BOOL,
	// 	phoneVerified BOOL,
	// 	UNIQUE_CONSTRAINT (id, versionid)
	// );
	// CREATE INDEX CONCURRENTLY IF NOT EXISTS email_idx on (lower(email));
	// CREATE INDEX CONCURRENTLY IF NOT EXISTS full_name_idx on (CONCAT(lower(firstname), ' ', lower(lastname)));
	// `);
	const query = client.query(`\list`);
	console.log(query)



	// query.on('end', () => { client.end(); });
}

module.exports = {
	initQuery: initQuery
}
