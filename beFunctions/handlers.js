const m = require("./models.js")

module.exports = {

	calc: calc,

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


		// console.log("answerArray INSISE FOR LOOP", answerArray)



	}

	console.log("answerArray OUTSIDE FOR LOOP", answerArray)

	m.results.answerArray = answerArray

	// console.log("here is m", m)
	console.log("here is m.results", m.results)
	// console.log("here is m.answerArray", m.results.answerArray)

	return m;
}
