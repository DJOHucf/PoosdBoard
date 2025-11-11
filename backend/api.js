require('express');
require('mongodb');

exports.setApp = function( app, client ) {
	app.post('/api/login', async (req, res, next) => {
		var error = '';
		const { login, password } = req.body;
		// check hash ?
		const checkHash = crypto.createHash('sha256').update(password).digest('hex');
		const results = await
			db.collection('users').find({
				$or: [{name: login}, {email: login}],
				passwordHash: checkHash
			}).toArray();

		var id = -1;
		var n = '';

		if(results.length > 0) {
			id = results[0]._id;
			n = results[0].name;
		}
		else error = 'Invalid user/pass';

		// testing
		const token = jwt.sign({id}, JWT_SECRET, {expiresIn: '1h'});
		res.status(200).json({"auth": token, "name": n, "error": ''});
	});

	app.post('/api/signup', async (req, res, next) => {
		const { email, password, name } = req.body;
		// changed password -> hashedPassword
		const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

		const newUser = {email: email, passwordHash: hashedPassword, name: name, createdAt: new Date(), emailVerified: true};
		var error = '';
		try {
			const result = await db.collection('users').insertOne(newUser);
			error = 'Signed up';
		}

		catch(e) {
			error = e.toString();
		}
		var ret = {error: error};
		res.status(200).json(ret);
	});
}
