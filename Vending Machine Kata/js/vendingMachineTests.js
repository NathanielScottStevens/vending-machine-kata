module("determineCoin");

QUnit.test("returns nickel", function(assert) {
    assert.equal(determineCoin(nickel.weightInGrams, nickel.sizeInInches), "nickel");
})

QUnit.test("returns dime", function(assert) {
    assert.equal(determineCoin(dime.weightInGrams, dime.sizeInInches), "dime");
})

QUnit.test("returns quarter", function(assert) {
    assert.equal(determineCoin(quarter.weightInGrams, quarter.sizeInInches), "quarter");
})

QUnit.test("no overlap between dime and nickel", function (assert) {
    assert.equal(determineCoin(dime.weightInGrams + weightMarginOfError, dime.sizeInInches + sizeMarginOfError), "dime");
    assert.equal(determineCoin(nickel.weightInGrams - weightMarginOfError, nickel.sizeInInches + sizeMarginOfError), "nickel");
})

QUnit.test("no overlap between nickel and quarter", function (assert) {
    assert.equal(determineCoin(nickel.weightInGrams + weightMarginOfError, nickel.sizeInInches + sizeMarginOfError), "nickel");
    assert.equal(determineCoin(quarter.weightInGrams - weightMarginOfError, quarter.sizeInInches + sizeMarginOfError), "quarter");
})