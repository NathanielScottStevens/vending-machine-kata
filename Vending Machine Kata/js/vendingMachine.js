var VendingMachine = function() {
	
	var screenDisplay;
	var totalAmountInserted;

	// The feature request requires both an "INSERT COINS" and "INSERT COIN" message.
	// I believe this is a typo.
	var insertCoinMessage = "INSERT COINS";
	var thankyouMessage = "THANK YOU";
	var soldOutMessage = "SOLD OUT";
	var exactChangeMessage = "EXACT CHANGE ONLY";	
	
	
	function getScreenDisplay() {
		return screenDisplay + " " + totalAmountInserted.toFixed(2);
	}
	
	function getTotalAmountInserted() {
		return totalAmountInserted.toFixed(2);
	}
	
	/**
	 *	Coin object.
	 * @param {number} weight - Weight of the coin in grams.
	 * @param {number} size - Size of the coin in millimeters.
	 * @param {number} value - Value of coin in USD.
	 */
	function CoinInfo(weight, size, value) {
		this.weight = weight;
		this.size = size;
		this.value = value;

		this.isValid = function (weight, size) {
			var isWeightValid = this.weight === weight;
			var isSizeValid = this.size === size;

			return isWeightValid && isSizeValid;
		}
	}
	
	// https://www.usmint.gov/about_the_mint/?action=coin_specifications
	var nickel = new CoinInfo(5.000, 21.21, 0.05);
	var dime = new CoinInfo(2.268, 17.91, 0.10);
	var quarter = new CoinInfo(5.670, 24.26, 0.25);
	
	function insertCoin(coin){
		var insertedCoin = determineCoin(coin.weight, coin.size);
		
		if (insertedCoin !== null)
			totalAmountInserted += insertedCoin.value;
	}

	function determineCoin(weight, size) {
		if (nickel.isValid(weight, size))
			return nickel;
		else if (dime.isValid(weight, size))
			return dime;
		else if (quarter.isValid(weight, size))
			return quarter;
		else
			return null;
	}
	
	function init(){
		screenDisplay = insertCoinMessage;
		totalAmountInserted = 0;
	}

	return {init:init, insertCoin:insertCoin, getScreenDisplay:getScreenDisplay, 
				getTotalAmountInserted:getTotalAmountInserted}
}();

