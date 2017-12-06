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
f = require("./beFunctions/handlers.js")

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
