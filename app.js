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
db = require("./config/db"),
f = require("./beFunctions/handlers.js"),
coinbase = require('coinbase'),
mycbkey = process.env.cbAPIK,
mycbsecret = process.env.cbAPIS,
coinbase = new coinbase.Client({'apiKey': mycbkey, 'apiSecret': mycbsecret}),
mypolkey = process.env.polAPIK,
mypolsecret = process.env.polAPIS



const Poloniex = require('poloniex-api-node');
let poloniex = new Poloniex(mypolkey, mypolsecret, { socketTimeout: 15000 });

poloniex.returnAvailableAccountBalances().then((balances) => {
  console.log(balances);
}).catch((err) => console.log(err.message));



coinbase.getAccounts({}, function(err, accounts) {
	console.log("acc", accounts)
 	 accounts.forEach(function(acct) {
		console.log('my bal: ' + acct.balance.amount + ' for ' + acct.name);
		console.log('my bal: ' + acct.native_balance.amount + ' for ' + acct.native_balance.currency);
  });
});

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
