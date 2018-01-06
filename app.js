require("dotenv").config()

const
express = require("express"),
app = express(),
router = express.Router()
http = require("http"),
path = require("path"),
PORT = process.env.PORT || 3000,
morgan = require("morgan"),
bodyParser = require("body-parser"),
request = require("request"),
URL = require("url-parser"),
// db = require("./config/db"),
init = require("./database/init.js"),
f = require("./beFunctions/handlers.js"),
bcrypt = require("bcrypt"),
pg = require('pg'),
{ Client } = require('pg'),
username = process.env.PGUSER,
password = process.env.PGPASSWORD,
host = process.env.PGHOST,
database = process.env.PGDATABASE,
port = process.env.PGPORT,
connectionString = process.env.DATABASE_URL || `postgres://${username}:${password}@${host}:${port}/${database}`,
client = new pg.Client(connectionString);{}

// init.initQuery();

// client.connect()

// client.query('SELECT * FROM users', [], (err, res) => {
//   console.log(err ? err.stack : res.rows[0].message) // Hello World!
//   client.end()
// })


app
	.use(morgan("dev"))
	.use(bodyParser.json())
	.use(bodyParser.urlencoded({ extended : true }))
	.use(express.static(__dirname + "/"))
	.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')))

http
	.createServer(app)
	.listen(PORT)
	.on("error", () => console.log("error: ", error))
	.on("listening", () => console.log("serving port: ", PORT))


app.put("/calc", (req, res) => {
	if (!req.body) return res.sendStatus(400)
	var results = f.calc(req.body)
	res.send(results)
})

app.get("/allaccountvalues", (req, res) => {
	f.getAllAccountValues(req, res)
})

// app.post("/signup", (req, res) => {
// 	if (!req.body) return res.sendStatus(400)
// 	console.log('hit api', req.body)
// 	bcrypt.hash(myPlaintextPassword, 10, function(err, hash) {
// 	  // Store hash in your password DB.
// 	});
// })

app.post('/signup', (req, res, next) => {

  if (!req.body) return res.sendStatus(400)

  const results = [];
  const data = req.body

  const myPlaintextPassword = req.body.password;

  bcrypt.hash(req.body.password, 10, function(err, hash) {
    
    const client = new Client({
      connectionString: connectionString,
    })
    client.connect()

    client.query('SELECT MAX(id) FROM users', (err, res) => {
      console.log("here is res", res)
      if(err) res.send({ success: false, error: err })

    })

    // client.query(`SELECT MAX(id) FROM users);`, (err, res) => {

    //   console.log(err, res)
    // })


  })

  //   client.query(`INSERT INTO users VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`, [
  //   	id,
  //   	versionid,
  // 		time.Now(),
  // 		data.firstname,
  // 		data.lastname,
  // 		data.email,
  // 		passwordHash,
  // 		activationCode,
  // 		false,
  // 		false
  // 	]);



  //   // SQL Query > Select Data
  //   const query = client.query('SELECT * FROM users ORDER BY id ASC');
  //   // Stream results back one row at a time
  //   query.on('row', (row) => {
  //     results.push(row);
  //   });
  //   // After all data is returned, close connection and return results
  //   query.on('end', () => {
  //     done();
  //     return res.json(results);
  //   });
  // });


});











