

function CoinInfo(weightInGrams, sizeInInches, weightMarginOfError, sizeMarginOfError) {
    this.weightInGrams = weightInGrams;
    this.sizeInInches = sizeInInches;
    this.weightMarginOfError = weightMarginOfError;
    this.sizeMarginOfError = sizeMarginOfError;

    this.isValid = function (weight, size) {
        var weightLowerBound = weightInGrams - weightMarginOfError;
        var weightUpperBound = weightInGrams + weightMarginOfError;

        var sizeLowerBound = sizeInInches - sizeMarginOfError;
        var sizeUpperBound = sizeInInches + sizeMarginOfError;

        var isWeightValid = weightLowerBound <= weight && weight <= weightUpperBound;
        var isSizeValid = sizeLowerBound <= size && size <= sizeUpperBound;

        return isWeightValid && isSizeValid;
    }
}

var weightMarginOfError = 0.3;
var sizeMarginOfError = 0.05;

// https://www.usmint.gov/about_the_mint/?action=coin_specifications
var nickel = new CoinInfo(5, 0.835, weightMarginOfError, sizeMarginOfError);
var dime = new CoinInfo(2.268, 0.705, weightMarginOfError, sizeMarginOfError);
var quarter = new CoinInfo(5.67, 0.955, weightMarginOfError, sizeMarginOfError);

function determineCoin(weightInGrams, sizeInInches) {
    if (nickel.isValid(weightInGrams, sizeInInches))
        return "nickel";
    else if (dime.isValid(weightInGrams, sizeInInches))
        return "dime";
    else if (quarter.isValid(weightInGrams, sizeInInches))
        return "quarter";
    else
        return "other";
}
