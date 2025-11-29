// Generate a random integer between 1 and 10 (inclusive)
global.getRandomInteger = function(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

// generate a random str 
global.generateGameString = function() {
	// Generate a 6-digit numeric game ID
	return String(Math.floor(100000 + Math.random() * 900000));
}

