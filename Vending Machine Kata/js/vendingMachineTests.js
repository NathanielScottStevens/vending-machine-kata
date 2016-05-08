penny = { "weight": 2.500, "size": 19.05 };
nickel = { "weight": 5.000, "size": 21.21 };
dime = { "weight": 2.268, "size": 17.91 };
quarter = { "weight": 5.670, "size": 24.26 };

module("Screen Display")

QUnit.test("Displays correct message at initializion.", function(assert) {
	VendingMachine.init();
	
	assert.equal(VendingMachine.getScreenDisplay(), "INSERT COINS 0.00");
});


module("Insert Coin")
	
QUnit.test("Accepts nickel.", function(assert) {
	VendingMachine.init();
	
	VendingMachine.insertCoin(nickel);
	
	assert.equal(VendingMachine.getTotalAmountInserted(), 0.05);
});

QUnit.test("Accepts dime.", function(assert) {
	VendingMachine.init();
	
	VendingMachine.insertCoin(dime);
	
	assert.equal(VendingMachine.getTotalAmountInserted(), 0.10);
});

QUnit.test("Accepts quarter.", function(assert) {
	VendingMachine.init();
	
	VendingMachine.insertCoin(quarter);
	
	assert.equal(VendingMachine.getTotalAmountInserted(), 0.25);
});

QUnit.test("Rejects penny.", function(assert) {
	VendingMachine.init();
	
	VendingMachine.insertCoin(penny);
	
	assert.equal(VendingMachine.getTotalAmountInserted(), 0);
});

QUnit.test("Rejects multiple coins and adds values to total.", function(assert) {
	VendingMachine.init();
	
	VendingMachine.insertCoin(nickel);
	VendingMachine.insertCoin(dime)
	
	assert.equal(VendingMachine.getTotalAmountInserted(), 0.15);
});