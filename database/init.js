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

	var str = `CREATE TABLE IF NOT EXISTS users (
		id INTEGER PRIMARY KEY,
		versionid varchar(64),
		createdat DATE,
		firstname varchar(64),
		lastname varchar(64),
		email varchar(64) NOT NULL UNIQUE,
		passwordHash varchar(64) NOT NULL,
		activationCode varchar(64) NOT NULL,
		emailVerified BOOLEAN,
		phoneVerified BOOLEAN
	);
`
	// CREATE INDEX CONCURRENTLY IF NOT EXISTS email_idx on (lower(email));
	// CREATE INDEX CONCURRENTLY IF NOT EXISTS full_name_idx on (CONCAT(lower(firstname), ' ', lower(lastname)));

	// await client.connect();
	// var res = await client.query(str);
	// res.rows.forEach(row=>{
	//     console.log(row);
	// });
	// await client.end();


	client.connect();
	var query = client.query(str).then(res => console.log(res))

	console.log(query)

	// query.on('end', () => { client.end(); });
}

module.exports = {
	initQuery: initQuery
}
