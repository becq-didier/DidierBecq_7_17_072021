const dotenv = require("dotenv").config();
const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
	const decodedToken = jwt.decode(
		req.headers.authorization.split(' ')[1],
		process.env.SECRET_KEY
	);

	const userId = parseInt(decodedToken.id);
	const userAdmin = decodedToken.isAdmin;
	const paramsId = parseInt(req.params.id);
	try {
		// decode le token
		console.log(
			!(decodedToken.exp >= Date.now() / 1000),
			decodedToken.exp,
			Date.now() / 1000
		);
		if (!(decodedToken.exp >= Math.round(Date.now() / 1000))) {
			console.log('session expiré');
			throw 'session expired';
		}
		if (!((paramsId && paramsId == userId) || userAdmin)) {
			throw 'user ID non valable !';
		} else {
			if (userAdmin) {
				console.log('Admin');
			}
			next();
		}
	} catch {
		res.status(401).json({
			error: 'Requête non authentifiée !',
		});
	}
};