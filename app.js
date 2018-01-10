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
model = require("./database/models.js"),
init = require("./database/init.js"),
f = require("./beFunctions/handlers.js"),
bcrypt = require("bcrypt"),
rcsk = process.env.recaptchaSecret,
nodemailer = require('nodemailer'),
redis = require("redis"),
redisClient = redis.reateClient(),
Nexmo = require('nexmo');
nexmo = new Nexmo({
  apiKey: process.env.NEXMOKEY,
  apiSecret: process.env.NEXMOSECRET
}),
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

app.post('/sendsms', (req, res, next) => {
    nexmo.verify.request({number: req.body.number, code_length: 6}, (err, result) => {
    if(err) return res.sendStatus(500);
    if(result.status !== '0') return res.status(401).send(result.error_text)
    res.render('verify', {requestId: result.request_id})
  });
});


app.post('/signup', (req, res, next) => {


  if (!req.body) return res.sendStatus(400)

  if([undefined, '', null].includes(req.body['g-recaptcha-response'])) {
      return res.json({"responseCode" : 1,"responseDesc" : "Please select captcha"});
  }

  var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + rcsk + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;

  request(verificationUrl, function(error, response, body) {
    body = JSON.parse(body);
    if(body.success !== undefined && !body.success) {
      return res.json({"responseCode" : 1, "responseDesc" : body["error-codes"]});
    }
  });



/*
redis stuff
*/

redisClient.on('connect', (err, res) => err ? console.log(err) : console.log('redis connected'))


/*
redis stuff
*/



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
  })


nodemailer.createTestAccount((err, account) => {

    var smtpTransport = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        auth: {
            user: process.env.USEREMAIL,
            pass: process.env.USERPASSWORD
        }
    });

    let mailOptions = {
        from: process.env.USEREMAIL,
        to: req.body.email,
        subject: `Welcome to Telemis, ${req.body.firstname}`, // Subject line
        text: 'Hello world?', // plain text body
        html: '<b>Hello world?</b>' // html body
    };

    smtpTransport.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
    });

});



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











