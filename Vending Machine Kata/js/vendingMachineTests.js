function getTestCoinData()
{
	return [
	{
		"name": "nickel",
		"weight": "5",
		"size": "21.21",
		"value": "0.05",
		"weightMarginOfError": "0.3",
		"sizeMarginOfError": "1"
	},	
	{
		"name": "dime",
		"weight": "2.268",
		"size": "17.91",
		"value": "0.10", 
		"weightMarginOfError": "0.3",
		"sizeMarginOfError": "1"
	}];	
}

module("coinData Validation");

QUnit.test("Throws TypeError when undefined", function(assert){
	assert.throws(
		function() { VendingMachine.init() },
		TypeError
	);
})

QUnit.test("Throws TypeError when not an array", function(assert){
	assert.throws(
		function() { VendingMachine.init() },
		TypeError
	);
})


module("Overlapping Weight");

QUnit.test("Throws Error when weight ranges overlap", function(assert){
	 var invalidCoinData = getTestCoinData();
	 invalidCoinData[0].weightMarginOfError = 0;
	 invalidCoinData[1].weightMarginOfError = 0;
	
	assert.throws(
		function() { VendingMachine.init(invalidCoinData) },
		Error
		);
})

module("Overlapping Size");

QUnit.test("Throws Error when weight ranges overlap", function(assert){
	 var invalidCoinData = getTestCoinData();
	 invalidCoinData[0].sizeMarginOfError = 0;
	 invalidCoinData[1].sizeMarginOfError = 0;
	
	assert.throws(
		function() { VendingMachine.init(invalidCoinData) },
		Error
		);
})