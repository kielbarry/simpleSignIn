let hashflareUserInput = {
	hashCost: '',
  	minHash: '',
	mainFee: '',
  	usdDay: '',
  	currentHash: '',
  	days: '',
  	reinvestmentSchedule: '',
  	cashInvested: '',
  	investedAmount: ''
}

let poloniexObjects = {
	coinname: '',
	coinamount: '',
	coinvalue:'',
	usdbalance: ''
}

module.exports = {
	hfui: hashflareUserInput,
	results: {
		answerArray: [],
	},
	po: poloniexObjects,
}
