// Import
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const PassValidator = require("../middleware/password-validator");
const models = require("../models");
const fs = require("fs-extra");

//** Inscription **//
exports.register = (req, res, next) => {
	//if (!req.file) return res.send("Please upload a file");

	// Params
	const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	var email = req.body.email;
	var password = req.body.password;
	var isAdmin = req.body.isAdmin;
	console.log('*******',req.body);
	var avatar = req.body.image;

	// constraint
	if (!EMAIL_REGEX.test(email)) { return res.status(400).json({ error: "email is not valid" }) };
	if (!PassValidator.validate(password)) { return res.status(401).json({ error: "Mot de passe trop simple !" }) };

	models.User.findOne({ where: { email: email } })
		.then(function(userFound) {
			if (!userFound) {
				bcrypt.hash(password, 10, function(err, bryptedPassword) {
					models.User.create({
							email: email,
							avatar: avatar,
							password: bryptedPassword,
							isAdmin: isAdmin,
						})
						.then((newUser) => { return res.status(200).json({ userId: newUser.id }) })
						.catch(function(err) { return res.status(500).json({ error: "Impossible d'ajouter l'utilisateur" }) });
				});
			} else { return res.status(409).json({ send: "l'utilisateur existe déjà!" }) }
		})
		.catch((err) => { return res.status(500).json({ error: err }) });
};

//** Connexion **//
exports.login = (req, res, next) => {

	// Params
	var email = req.body.email;
	var password = req.body.password;

	// constraint

	if (!email || !password) { return res.status(400).json({error: "Paramètres manquants"}) }

	models.User.findOne({ where: { email: email } })
		.then(function(userFound) {
			if (userFound) {
				bcrypt.compare(password, userFound.password,
					function(errBycrypt, resBycrypt) {
						if (resBycrypt) {
							return res.status(200).send({
								id: userFound.id,
								isAdmin: userFound.isAdmin,
								token: jwt.sign({ id: userFound.id, isAdmin: userFound.isAdmin, }, process.env.SECRET_KEY, { expiresIn: "360s", }),
								avatar: userFound.avatar,
								pseudo:userFound.pseudo,
								email:userFound.email,
							});
						} else { return res.status(403).json({ error: "Mot de passe incorrect" }); }
					}
				);
			} else { return res.status(404).json({ send: "l'utilisateur n'existe pas dans dB" }); }
		})
		.catch(function(err) { return res.status(500).json({ error: "Impossible de vérifier l'utilisateur" }) });
};

//** Affiche tous les utilisateurs **//
exports.allProfiles = (req, res, next) => {

	models.User.findAll({ attributes: ["id", "pseudo", "email"] })
		.then(function(allUsers) { res.status(200).json(allUsers) })
		.catch(function(err) { return res.status(500).json({ error: "Impossible de vérifier l'utilisateur" }) });
};

//** Affiche le profile utilisateur selon son id **//
exports.userProfile = (req, res, next) => {

	models.User.findOne({
			attributes: ["id", "firstName", "lastName", "pseudo", "bio", "avatar", "email", "password"],
			// include: [{ model: models.Message, attributes: ["userId", "title", "content", "attachment"] }],
			order: [
				["createdAt", "DESC"]
			],
			where: { id: req.params.id },
		})
		.then(function(userFound) { return res.status(200).json(userFound) })
		.catch(function(err) { return res.status(500).json({ error: "Impossible de vérifier l'utilisateur" }) })
};

//** Supprime le profile utilisateur selon son id **//
exports.deleteProfile = (req, res, next) => {

	models.User.findOne({ where: { id: req.params.id } })
		.then((userFound) => {
			const filename = userFound.avatar.split("/images/")[1];
			if (userFound) {
				if(filename!=='avatar.png'){fs.unlink(`images/${filename}`, (err) => {console.log(err) })}
				models.Like.destroy({ where: { userId: req.params.id } })
				models.Remark.destroy({ where: { userId: req.params.id } });
				models.Message.findAll({
					attributes: ['id','attachment'],
					where: { userId: userFound.id }
				})
				.then(function(imagesMessages) {	
					imagesMessages.forEach(element => {
						const filename = element.attachment.split("/images/")[1];
						fs.unlink(`images/${filename}`, (err) => {console.log(err) });
						models.Like.destroy({where: {messageId: element.id}})
						models.Remark.destroy({ where: { messageId: element.id } });
						
					});	
				})
				.catch(() => { return res.status(500).send({ error: "pas possible message" }) });
				
				models.Message.destroy({  where: { userId: req.params.id } })
				.then(() => { return res.status(200).send("Message supprimé") })
				.catch(() => { return res.status(500).send({ error: "pas possible message" }) });
				userFound
					.destroy({ where: { id: req.params.id } })
					.then(() => { return res.status(200).json({ message: "utilisateur supprimé !" }) })
					.catch((error) => {return res.status(400).json({ error }) });
			   
			}
		})
		.catch((error) => { res.status(500).json({ message: "L'utilisateur n'existe pas !" }) })
};

//** modify le profile utilisateur selon son id **//
exports.modifyProfile = (req, res, next) => {

	//Params
	var firstName = req.body.firstName;
	var lastName = req.body.lastName;
	var pseudo = req.body.pseudo;
	var bio = req.body.bio;
	// Constants
	const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	// constraint
	if (!firstName || !lastName || !pseudo || !bio) { return res.status(400).json({ error: "missing parameters" }) }
	if (firstName.length >= 13 || firstName.length <= 1) { return res.status(400).json({ error: "wrong firstname (must be length 5 - 12)" }) }
	if (lastName.length >= 13 || lastName.length <= 1) { return res.status(400).json({ error: "wrong lastname (must be length 5 - 12)" }) }
	if (pseudo.length >= 13 || pseudo.length <= 1) { return res.status(400).json({ error: "wrong pseudo (must be length 2 - 12)" }) }

	models.User.findOne({ where: { id: req.params.id } })
		.then(function(userFound) {
			console.log('profile trouvé',req.file);
			if (req.file) {
				
				var avatar = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
				console.log('avatar '+ avatar);
				//file exists
				if (userFound) {
					const filename = userFound.avatar.split('/images/')[1];
					if (filename !== 'avatar.png') {
						fs.unlink(`images/${filename}`, (err) => {
							console.log(err);
						});
					}
					   
					models.User.update({
							firstName: firstName,
							lastName: lastName,
							pseudo: pseudo,
							bio: bio,
							avatar:avatar,
						}, { where: { id: req.params.id } })
						.then((userFound) => { res.status(200).send("Mise à jour réussie"); })
						.catch(function(err) { return res.status(500).send({ error: "Problème de mise a jour" }); });
				} else {
					
					const filename = avatar.split("/images/")[1];
					fs.unlink(`images/${filename}`, () => { return res.status(400).json({ error: "Impossible de vérifier l'utilisateur" }); });
					
				}
			} else {
				if (userFound) {
					models.User.update({
							firstName: firstName,
							lastName: lastName,
							pseudo: pseudo,
							bio: bio,
						}, { where: { id: req.params.id } })
						.then((userFound) => { res.status(200).send("Mise à jour réussie"); })
						.catch(function(err) { return res.status(500).send({ error: "Problème de mise à jour" }); });
				}
			}
		})
		.catch(function(err) {
			return res.status(500).json({ error: "Impossible de vérifier la recherche" })
		});
};
//** modify l'email utilisateur selon son id **//
exports.modifyEmail = (req, res, next) => {

	//Params
	var email = req.body.email; 
	var password = req.body.password;   
	var newEmail = req.body.newEmail;

	// Constants
	const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

	// Contraint
	if (!email || !password || !newEmail) { return res.status(400).json({ error: "Paramètres manquants" }); }
	if (!EMAIL_REGEX.test(newEmail)) { return res.status(400).json({ error: "L'email n'est pas valide" }) };

	models.User.findOne({ where: { email: email } })
		.then(function(userFound) {
			if (userFound) {
				bcrypt.compare(
					password,
					userFound.password,
					function(errBycrypt, resBycrypt) {
						if (resBycrypt) {

							models.User.findOne({ where: { id: req.params.id } })
								.then(function(userFound) {
									if (userFound) {
										models.User.update({
												email: newEmail,
											}, { where: { id: req.params.id } })
											.then((userFound) => {
												res
													.status(200)
													.send("Mise à jour réussie");
											})
											.catch(function(err) {
												return res
													.status(500)
													.send({ error: "Problème de mise jours" });
											});
									}
								})
								.catch(function(err) {
									return res.status(500).json({ error: "Impossible de vérifier la recherche" })
								});

						} else {
							return res.status(403).json({ error: "Mot de passe incorrect" });
						}
					}
				);
			} else {
				return res.status(404).json({ send: "l'utilisateur n'existe pas dans dB" });
			}
		})
		.catch(function(err) {
			return res.status(500).json({ error: "Impossible de vérifier l'utilisateur" });
		});

};

//** modify le passWord utilisateur selon son id **//
exports.modifyPassword = (req, res, next) => {

	//Params
	var email = req.body.email;
	var password = req.body.password;
	var newPassword = req.body.newPassword;

	// constraint
	if (!email || !password || !newPassword) { return res.status(400).json({ error: "Paramètres manquants" }); }
	if (!PassValidator.validate(newPassword)) { return res.status(401).json({ error: "Mot de passe trop simple !" }) }

	models.User.findOne({ where: { email: email } })
		.then(function(userFound) {
			if (userFound) {
				bcrypt.compare(
					password,
					userFound.password,
					function(errBycrypt, resBycrypt) {
						if (resBycrypt) {
							models.User.findOne({ where: { id: req.params.id } })
								.then(function(userFound) {
									if (userFound) {
										bcrypt.hash(
											newPassword,
											10,
											function(err, bryptedPassword) {
												models.User.update({
														password: bryptedPassword,
													}, { where: { id: req.params.id } })
													.then((userFound) => {
														res.status(200).send("Mise à jour réussie");
													})
													.catch(function(err) {
														return res
															.status(500)
															.send({ error: "Problème de mise à jours" });
													});
											}
										);
									}
								})
								.catch(function(err) {
									return res
										.status(500)
										.json({ error: "Impossible de vérifier la recherche" });
								});
						} else {
							return res.status(403).json({ error: "Mot de passe incorrect" });
						}
					}
				);
			} else {
				return res.status(404).json({ send: "l'utilisateur n'existe pas dans dB" });
			}
		})
		.catch(function(err) {
			return res.status(500).json({ error: "Impossible de vérifier l'utilisateur" });
		});


};