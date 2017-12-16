require("dotenv").config()

const m = require("./models.js"),
coinbase = require('coinbase'),
mycbkey = process.env.cbAPIK,
mycbsecret = process.env.cbAPIS,
cbclient = new coinbase.Client({'apiKey': mycbkey, 'apiSecret': mycbsecret}),
mypolkey = process.env.polAPIK,
mypolsecret = process.env.polAPIS
const Poloniex = require('poloniex-api-node');
let poloniex = new Poloniex(mypolkey, mypolsecret, { socketTimeout: 15000 });


module.exports = {
	calc: calc,
	getPO: getPO,
	getAllAccountValues: getAllAccountValues,
}

function calc(model){

	m.hfui = model
	var riAmountArray =[];
	var wallet = 0;
	var answerArray = []
	var investedAmount = m.hfui.investedAmount
	var cashInvested = m.hfui.cashInvested
	const initialInvestment = investedAmount

	for (var i = 0; i <= m.hfui.days; i++){

		var currentHash = m.hfui.currentHash

		var fee = (currentHash/10) * m.hfui.mainFee
		var earnings = (currentHash/10) * m.hfui.usdDay
		var profit = earnings - fee
		wallet += profit

		var addHash = Math.floor(wallet/m.hfui.hashCost)

		var riHashAmount = addHash * m.hfui.minHash;

		riAmountArray.push(riHashAmount)

		currentHash += riHashAmount

		wallet -= addHash * m.hfui.hashCost

		if(riAmountArray[i-365]) {
			currentHash -= riAmountArray[i-365]
		}

		// if(i !== 0 && i % m.hfui.reinvestmentSchedule === 0) {
		// 	// investedAmount += 500;
		// 	// cashInvested += 500;
		// 	// currentHash += 3650;
		// }
		var newObj = {
			"investedAmount": investedAmount,
			"cashInvested": cashInvested,
			"wallet": wallet,
			"currentHash": currentHash,
			"fee": fee,
			"profit": profit,
			"monthlyProfit": profit * 30,
			"earnings": earnings,
			"daysToRecoup": investedAmount / profit,
			"equivAnnualEarnings" : profit * 365,
			"riHashAmount": riHashAmount,
		}

		answerArray.push(newObj)
	}

	m.results.answerArray = answerArray

	return m;
}

function getPO(){
	let po = {
		coinname: '',
		coinamount: '',
		coinvalue:'',
		usdbalance: '',
		exchange: '',
	}

	var btcPrice;
	var arr = []

	poloniex.returnTicker()
	.then(balances => {
		btcPrice = balances.USDT_BTC.lowestAsk
	}).catch(err => console.log(err.message))

	poloniex.returnCompleteBalances().then((balances) => {
		Object.keys(balances).map(key => {
		  	if(balances[key].available > 0){
		  		po.coinname = key;
		  		po.coinamount = parseFloat(balances[key].available);
		  		po.coinvalue = balances[key].btcValue;
		  		po.exchange = "Poloniex";
		  		po.usdbalance = (parseFloat(balances[key].btcValue) * parseFloat(btcPrice)).toFixed(2);
		  		arr.push(po)
		  	}
		})
	}).catch((err) => console.log(err.message))
	.then(e => {
		return arr
	})
}

function getCB(){

	let cb = {
		coinname: '',
		coinamount: '',
		coinvalue:'',
		usdbalance: '',
		exchange: '',
	}

	// var bitPrice;
	var arr = [];

	var bitPrice = cbclient.getBuyPrice({'currencyPair': 'BTC-USD'}, function(err, obj) {
		return obj.data.amount;
		// console.log("bitPrice", bitPrice)
	});

	console.log("bitPrice", bitPrice)

	cbclient.getAccounts({}, (err, accounts) => {
		accounts.map(acct =>{
			cb.coinname = acct.currency;
			cb.coinamount = acct.balance.amount;
			cb.coinvalue = parseFloat(bitPrice) / parseFloat(acct.native_balance.amount);
			cb.usdbalance = acct.native_balance.amount;
			cb.exchange = "Coinbase"
			arr.push(cb)
		})
	})

	return arr

}


function getAllAccountValues(req, res){

	var cbarr = getCB()
	var polarr = getPO()

	// console.log(cbarr)
	// console.log(polarr)


	// let po = {
	// 	coinname: '',
	// 	coinamount: '',
	// 	coinvalue:'',
	// 	usdbalance: '',
	// 	exchange: '',
	// }

	// var btcPrice;
	// var arr = []

	// poloniex.returnTicker()
	// .then(balances => {
	// 	btcPrice = balances.USDT_BTC.lowestAsk
	// }).catch(err => console.log(err.message))

	// poloniex.returnCompleteBalances().then((balances) => {
	// 	Object.keys(balances).map(key => {
	// 	  	if(balances[key].available > 0){
	// 	  		po.coinname = key;
	// 	  		po.coinamount = parseFloat(balances[key].available);
	// 	  		po.coinvalue = balances[key].btcValue;
	// 	  		po.exchange = "Poloniex";
	// 	  		po.usdbalance = (parseFloat(balances[key].btcValue) * parseFloat(btcPrice)).toFixed(2);
	// 	  		arr.push(po)
	// 	  	}
	// 	})
	// 	console.log("arr being sent", arr)
	// }).catch((err) => console.log(err.message))
	// .then(e => res.send(arr))

}
