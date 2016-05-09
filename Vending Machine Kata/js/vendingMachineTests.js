var testObjects = {
	penny:   { weight: 2.500, size: 19.05 },
	nickel:   { weight: 5.000, size: 21.21 },
	dime:    { weight: 2.268, size: 17.91 },
	quarter: { weight: 5.670, size: 24.26 },
	
	chips:   { name: "chips", cost: 0.50 }
};

function defaultVendingMachineInit() {
	VendingMachine.init(5, 5, 5, 5, 5, 5);
}

module("Screen Display")

QUnit.test("Displays correct message at initializion.", function(assert) {
	defaultVendingMachineInit();
	
	assert.equal(VendingMachine.getScreen(), "INSERT COINS");
});

QUnit.test("Display shows THANK YOU after purchase", function(assert) {
	defaultVendingMachineInit();
	
	VendingMachine.insertCoin(testObjects.quarter);
	VendingMachine.insertCoin(testObjects.quarter);
	VendingMachine.selectProduct(testObjects.chips.name);
	
	assert.equal(VendingMachine.getScreen(), "THANK YOU");	
});

QUnit.test("Display shows INSERT COINS after THANK YOU", function(assert) {
	defaultVendingMachineInit();
	
	VendingMachine.insertCoin(testObjects.quarter);
	VendingMachine.insertCoin(testObjects.quarter);
	VendingMachine.selectProduct(testObjects.chips.name);
	VendingMachine.getScreen(); // Displays THANK YOU
	
	assert.equal(VendingMachine.getScreen(), "INSERT COINS");	
});

QUnit.test("Displays PRICE and cost upon unsuccesful selection", function(assert) {
	defaultVendingMachineInit();
	
	VendingMachine.insertCoin(testObjects.quarter);
	VendingMachine.selectProduct(testObjects.chips.name);
	
	assert.equal(VendingMachine.getScreen(), "PRICE $" + testObjects.chips.cost.toFixed(2));
	
});

QUnit.test("Next check of display after unsuccesful selection show INSERT COINS if no money has been entered.", function(assert) {
	defaultVendingMachineInit();
	
	VendingMachine.selectProduct(testObjects.chips.name);
	VendingMachine.getScreen();
	
	assert.equal(VendingMachine.getScreen(), "INSERT COINS");
});

QUnit.test("Displays amount entered", function(assert) {
	defaultVendingMachineInit();
	
	VendingMachine.insertCoin(testObjects.nickel);
	
	assert.equal(VendingMachine.getScreen(), "$0.05");
});

QUnit.test("Displays INSERT COINS after returning coins.", function(assert) {
	defaultVendingMachineInit();
	
	VendingMachine.insertCoin(testObjects.quarter);
	VendingMachine.insertCoin(testObjects.quarter);
	VendingMachine.returnCoins();
	
	assert.equal(VendingMachine.getScreen(), "INSERT COINS");
});

QUnit.test("Displays SOLD OUT if selection is sold out.", function(assert) {
	VendingMachine.init(5, 5, 5, 5, 0, 5); // No chips
	
	VendingMachine.insertCoin(testObjects.quarter);
	VendingMachine.insertCoin(testObjects.quarter);
	VendingMachine.selectProduct(testObjects.chips.name);
	
	assert.equal(VendingMachine.getScreen(), "SOLD OUT");	
});

QUnit.test("Display shows amount inserted after SOLD OUT", function(assert) {
	VendingMachine.init(5, 5, 5, 5, 0, 5); // No chips
	
	VendingMachine.insertCoin(testObjects.quarter);
	VendingMachine.insertCoin(testObjects.quarter);
	VendingMachine.selectProduct(testObjects.chips.name);
	VendingMachine.getScreen(); // Displays SOLD OUT
	
	assert.equal(VendingMachine.getScreen(), "$0.50");	
});

QUnit.test("Display EXACT CHANGE ONLY when there is no change.", function(assert) {
	VendingMachine.init(0, 0, 0, 5, 5, 5);

	assert.equal(VendingMachine.getScreen(), "EXACT CHANGE ONLY");	
});

QUnit.test("Display EXACT CHANGE ONLY when there less than 4 nickels and no dimes.", function(assert) {
	VendingMachine.init(3, 0, 5, 5, 5, 5);

	assert.equal(VendingMachine.getScreen(), "EXACT CHANGE ONLY");	
});

QUnit.test("Display EXACT CHANGE ONLY when there are 2 nickels and 1 dime.", function(assert) {
	VendingMachine.init(3, 0, 5, 5, 5, 5);

	assert.equal(VendingMachine.getScreen(), "EXACT CHANGE ONLY");	
});


module("Insert Coin")
	
QUnit.test("Accepts nickel.", function(assert) {
	defaultVendingMachineInit();
	
	VendingMachine.insertCoin(testObjects.nickel);
	
	assert.equal(VendingMachine.getScreen(), "$0.05");
});

QUnit.test("Accepts dime.", function(assert) {
	defaultVendingMachineInit();
	
	VendingMachine.insertCoin(testObjects.dime);
	
	assert.equal(VendingMachine.getScreen(), "$0.10");
});

QUnit.test("Accepts quarter.", function(assert) {
	defaultVendingMachineInit();
	
	VendingMachine.insertCoin(testObjects.quarter);
	
	assert.equal(VendingMachine.getScreen(), "$0.25");
});

QUnit.test("Rejects penny.", function(assert) {
	defaultVendingMachineInit();
	
	VendingMachine.insertCoin(testObjects.penny);
	
	assert.equal(VendingMachine.getScreen(), "INSERT COINS");
});

QUnit.test("Deposits penny in coin return", function(assert) {
	defaultVendingMachineInit();
	
	VendingMachine.insertCoin(testObjects.penny);
	
	assert.equal(VendingMachine.takeChange()[0], testObjects.penny);
});


QUnit.test("Accepts multiple coins and sums values.", function(assert) {
	defaultVendingMachineInit();
	
	VendingMachine.insertCoin(testObjects.nickel);
	VendingMachine.insertCoin(testObjects.dime)
	
	assert.equal(VendingMachine.getScreen(), "$0.15");
});


module("Select Product");

QUnit.test("Returns correct product.", function(assert) {
	defaultVendingMachineInit();
	
	VendingMachine.insertCoin(testObjects.quarter);
	VendingMachine.insertCoin(testObjects.quarter);
	VendingMachine.selectProduct(testObjects.chips.name);
	
	assert.equal(VendingMachine.takeProduct()[0], testObjects.chips.name);
});

QUnit.test("Returns nothing if inserted payment is below cost.", function(assert) {
	defaultVendingMachineInit();
	
	VendingMachine.insertCoin(testObjects.quarter);
	
	assert.equal(VendingMachine.selectProduct(testObjects.chips.name), null);
});

// This fails because of rounding point errors. 
// Money needs to be stored as integers counting in cents.
QUnit.test("Returns change after purchase.", function(assert) {
	defaultVendingMachineInit();
	
	VendingMachine.insertCoin(testObjects.quarter);
	VendingMachine.insertCoin(testObjects.quarter);
	VendingMachine.insertCoin(testObjects.dime);
	VendingMachine.selectProduct(testObjects.chips.name);
	
	assert.equal(VendingMachine.takeChange()[0], testObjects.dime);	
});


module("Coin Return");

QUnit.test("Returns coins when requested.", function(assert) {
	defaultVendingMachineInit();
	
	VendingMachine.insertCoin(testObjects.quarter);
	VendingMachine.insertCoin(testObjects.quarter);
	VendingMachine.returnCoins();
	
	var change = VendingMachine.takeChange();
	assert.equal(change[0].size, testObjects.quarter.size);
	assert.equal(change[1].size, testObjects.quarter.size);
});
