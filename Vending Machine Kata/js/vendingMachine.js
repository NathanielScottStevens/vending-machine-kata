var VendingMachine = function() {
	
	var coins;
	
	function init(coinData){
		validateCoinData(coinData);
		coins = parseCoinData(coinData);
		isThereCoinWeightOverlap();
		isThereCoinSizeOverlap();
	}

	function CoinInfo(coinDatum) {
		this.name = coinDatum.name;
		this.weight = coinDatum.weight;
		this.size = coinDatum.size;
		this.value = coinDatum.value;
		this.weightMarginOfError = coinDatum.weightMarginOfError;
		this.sizeMarginOfError = coinDatum.sizeMarginOfError;
		
		var weightLowerBound = weight - weightMarginOfError;
		var weightUpperBound = weight + weightMarginOfError;
		var sizeLowerBound = size - sizeMarginOfError;
		var sizeUpperBound = size + sizeMarginOfError;

		this.isValid = function (weight, size) {
			var isWeightValid = weightLowerBound <= weight && weight <= weightUpperBound;
			var isSizeValid = sizeLowerBound <= size && size <= sizeUpperBound;

			return isWeightValid && isSizeValid;
		}
	}
	
	function validateCoinData(coinData){
		if (!coinData.isArray)
			throw new TypeError("coinData must be an array.")
		
		// We should probably validate here that each object in the array conforms
		// to the CoinInfo requirements. However, that ultimately depends on client
		// access to the json object.
	}
	
	function parseCoinData(coinData){
		var coins = new Array(coinData.length);
		coins.length = coinData.length;
		
		for (var i = 0; i < coins.length; i++){
			coins[i] = new CoinInfo(coinData[i]);
		}
		
		return coins;
	}	

	function isThereCoinWeightOverlap(){
		for (var i = 0; i < coins.length; i++){
			for (var j = i + 1; j < coins.length; j++){
				if (coins[i].weightUpperBound >= coins[j].weightLowerBound 
				|| coins[i].weightLowerBound <= coins[j].weightUpperBound)
					throw new Error(coins[i].name + " and " + coins[j].name + " have weight ranges that overlap. Please adjust their margin's of error.");
			}
		}
	}
	
	function isThereCoinSizeOverlap(){
		for (var i = 0; i < coins.length; i++){
			for (var j = i + 1; j < coins.length; j++){
				if (coins[i].sizeUpperBound >= coins[j].sizeLowerBound)
					return false;
				if (coins[i].sizeLowerBound <= coins[j].sizeUpperBound)
					return false;
			}
		}
	}

	function determineCoin(weight, size) {
		if (nickel.isValid(weight, size))
			return "nickel";
		else if (dime.isValid(weight, size))
			return "dime";
		else if (quarter.isValid(weight, size))
			return "quarter";
		else
			return "other";
	}

	return {init:init}
}();

