var VendingMachine = function() {
	
	var totalAmountInserted;	
	var currentState;
	var coinReturn;
	var productOutput;
	
	// PUBLIC FUNCTIONS
			
	function init(nickelCount, dimeCount, quarterCount, colaCount, chipCount, candyCount){		
		coinInventory.init(nickelCount, dimeCount, quarterCount);
		productInventory.init(colaCount, chipCount, candyCount);
		
		totalAmountInserted = 0;
		coinReturn = [];
		productOutput = [];
		currentState = insertCoinsState;	
	}
	
	function getScreen() {
		return currentState.display();
	}
	
	function insertCoin(coin){
		var insertedCoin = coinInventory.addCoin(coin.weight, coin.size);
		
		if (insertedCoin === null){
			coinReturn.push(coin);
		}
		else{
			currentState = coinsInsertedState;
		}
	}
	
	function selectProduct(selection) {
		var product = productInventory.getProductInfo(selection);
		
		if (product !== undefined){
			lastSelectedProduct = product;
			
			if (product.stored === 0){
				currentState = getSoldOutState();
			}
			else if (product.price > totalAmountInserted){
				currentState = getProductSelectionFailState(product);
			}
			else if (product.stored === 0){
				currentState = getProductSelectionFailState(product);
			}
			else {
				totalAmountInserted -= product.price;
				currentState = getProductSelectionSuccessState();
				
				var outProduct = productInventory.removeProduct(selection);
				productOutput.push(outProduct);
				
				if (totalAmountInserted > 0)
					coinInventory.makeChange();
			}	
		}
	}
	
	function returnCoins(){
		coinInventory.makeChange();
		currentState = insertCoinsState;
	}
	
	function takeProduct() {
		var copy = copyArray(productOutput);
		productOutput = [];
		return copy;
	}
	
	function takeChange() {
		var copy = copyArray(coinReturn);
		coinReturn = [];
		return copy;
	}
	
	
	// States
	
	function State(display, param){
		this.display = display;
		this.param = param;
	}	
	
	var insertCoinsState = new State(
		function() {
			if (coinInventory.canMakeChange())
				return 'INSERT COINS';
			else
				return 'EXACT CHANGE ONLY';
		}
	);
	
	var coinsInsertedState = new State(
		function() {
			return formatMoney(totalAmountInserted);
		}
	);
	
	function getProductSelectionSuccessState(){
		return new State(
			function() {
				if (this.param){
					this.param = false;
					return 'THANK YOU';
				}
				else{
					currentState = insertCoinsState;
					return currentState.display();
				}
			},
			true
		)
	}
	
	function getProductSelectionFailState(product) {
		return new State(
			function() {
				if (totalAmountInserted > 0)
					currentState = coinsInsertedState;
				else
					currentState = insertCoinsState;
				
				return 'PRICE ' + formatMoney(product.price);
			});
	}
	
	function getSoldOutState(){
		return new State(
			function() {
				if (this.param){
					this.param = false;
					return 'SOLD OUT';
				}
				else{
					if (totalAmountInserted > 0)
						currentState = coinsInsertedState;
					else
						currentState = insertCoinsState;
					
					return currentState.display();
				}
			},
			true
		)
	}
	
	
	// Inventory
	
	/**
	 *	Coin object.
	 * @param {number} weight - Weight of the coin in grams.
	 * @param {number} size - Size of the coin in millimeters.
	 * @param {number} value - Value of coin in USD.
	 */
	function CoinInfo(weight, size, value, stored) {
		this.weight = weight;
		this.size = size;
		this.value = value;
		this.stored = stored;

		this.isValid = function (weight, size) {
			var isWeightValid = this.weight === weight;
			var isSizeValid = this.size === size;

			return isWeightValid && isSizeValid;
		}
	}
	
	// Coin specifications: https://www.usmint.gov/about_the_mint/?action=coin_specifications
	var coinInventory = {
		nickel: new CoinInfo(5.000, 21.21, 0.05, 0),
	    dime: new CoinInfo(2.268, 17.91, 0.10, 0),
	    quarter: new CoinInfo(5.670, 24.26, 0.25, 0),
		
		init: function(nickels, dimes, quarters) {
			this.nickel.stored = nickels;
			this.dime.stored = dimes;
			this.quarter.stored = quarters;
		},
		
		addCoin: function(weight, size) {
			if (this.nickel.isValid(weight, size)) {
				this.nickel.stored++;
				totalAmountInserted += this.nickel.value;
				return this.nickel;
			}
			else if (this.dime.isValid(weight, size)) {
				this.dime.stored++;
				totalAmountInserted += this.dime.value;
				return this.dime;
			}
			else if (this.quarter.isValid(weight, size)) {
				this.quarter.stored++;
				totalAmountInserted += this.quarter.value;
				return this.quarter;
			}
				
			return null;
		},
		
		removeCoin: function(coin){
			if (coin.stored !== 0){
				coin.stored--;
				return true;
			}
			else
				return false;
		},
		
		makeChange: function(){
			if (totalAmountInserted >= 0.25 && this.quarter.stored > 0) {
				this.removeCoin(this.quarter);
				coinReturn.push(this.quarter);
				totalAmountInserted -= 0.25;
			}
			else if(totalAmountInserted >= 0.10 && this.dime.stored > 0) {
				this.removeCoin(this.dime);
				coinReturn.push(this.dime);
				totalAmountInserted -= 0.10;
			}
			else if (totalAmountInserted === 0.05 && this.nickel.stored > 0) {
				this.removeCoin(this.nickel);
				coinReturn.push(this.nickel);
				totalAmountInserted -= 0.05;
			}
			
			if (totalAmountInserted > 0)
				this.makeChange();
		},
		
		canMakeChange: function(){
			if (this.nickel.stored >= 4)
				return true;
			else if (this.nickel.stored >= 2 && this.dime.stored >= 1)
				return true;
			else
				return false;
		}			
	}
	
	function Product(name, price, stored) {
		this.name = name;
		this.price = price;
		this.stored = stored;
	}
	
	var productInventory = {
		cola : new Product('cola', 1.00, 0),
		chips : new Product('chips', 0.50, 0),
		candy : new Product('candy', 0.65, 0),
		
		init: function(colas, chips, candies){
			this.cola.stored = colas;
			this.chips.stored = chips;
			this.candy.stored = candies;
		},
		
		getProductInfo: function(product){
			if (product === 'cola'){
				return this.cola;
			}
			else if (product === 'chips'){
				return this.chips;
			}
			else if (product === 'candy'){
				return this.candy;
			}
			else {
				return null;
			}
		},
		
		removeProduct : function(product){
			if (product === 'cola'){
				if (this.cola.stored != 0){
					this.cola.stored--;
					return 'cola';
				}
			}
			else if (product === 'chips'){
				if (this.chips.stored != 0){
					this.chips.stored--;
					return 'chips';
				}
			}
			else if (product === 'candy'){
				if (this.candy.stored != 0){
					this.candy.stored--;
					return 'candy';
				}
			}
			else{
				return null;
			}				
		}
	};
	
	// Helper Functions

	function formatMoney(amount){
		return '$' + amount.toFixed(2);
	}
	
	function copyArray(array){
		var copy = new Array(array.length);
		for (var i = 0; i < copy.length; i++)
			copy[i] = array[i];
		return copy;
	}

	return {
		init: init, 
		insertCoin: insertCoin, 
		getScreen: getScreen,
		selectProduct: selectProduct,
		returnCoins: returnCoins,
		takeProduct: takeProduct,
		takeChange: takeChange,
		};
}();