const m = require("./models.js")

module.exports = {

	calc: calc,

}


function calc(model){
	m.hfui = model


	console.log("model", model)
	console.log("m.hfui", m.hfui)

	var riAmountArray =[];
	var wallet = 0;


	var investedAmount = 500
	var cashInvested = 500

	const initialInvestment = investedAmount

	for (var i = 0; i < m.hfui.days; i++){

		var currentHash = m.hfui.currentHash



		var fee = (currentHash/10) * m.hfui.mainFee
		var earnings = (currentHash/10) * m.hfui.usdDay

		var profit = earnings - fee

		wallet += profit

		var addHash = Math.floor(wallet/m.hfui.hashCost)

		var riHashAmount = m.hfui.addHash

		riAmountArray.push(riHashAmount)

		currentHash += riHashAmount

		wallet -= m.hfui.addHash * m.hfui.hashCost

		if(riAmountArray[i-365]) {
			currentHash -= riAmountArray[i-365]
		}

		// if (i !== 0 && i % reinvestmentSchedule === 0) {

		// }

		console.log("currentHash", currentHash)
		console.log("wallet", wallet)
		console.log("riHashAmount", riHashAmount)

		console.log("fee", fee)
		console.log("earnings", earnings)
		console.log("profit", profit)
		console.log("currentHash", currentHash)



	}

	console.log("here is ", m.hfui)
}
