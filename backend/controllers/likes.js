// Imports
var models = require("../models");
const jwt = require("jsonwebtoken");
const fs = require("fs-extra");


//** Compte les like du message **//
exports.countLike = (req, res, next) => {
    var messageId = parseInt(req.params.messageId);
    // Verifie existance message
    models.Like.findAndCountAll({ where: { isLike: 1, messageId: messageId } })
        .then(function(CountLike) {
            res.status(200).send(CountLike);
        })
        .catch(function(err) {
            return res.status(500).send({ error: err });
        });
};

//** Compte les Dislike du message **//
exports.countDislike = (req, res, next) => {
    var messageId = parseInt(req.params.messageId);
    // Verifie existance message
    models.Like.findAndCountAll({ where: { isLike: -1, messageId: messageId } })
        .then(function(CountDislike) {
            res.status(200).send(CountDislike);
        })
        .catch(function(err) {
            return res.status(500).send({ error: err });
        });
};

//** Affiche le dislike selon id messageId et userId **//
exports.viewLikeDislike = (req, res, next) => {
    var messageId = parseInt(req.params.messageId);
    var userId = parseInt(req.params.id);
    // Verifie existance message
    models.Like.findOne({where: {messageId: messageId, userId: userId}})
		.then(function (view) {
			res.status(200).send(view);
		})
		.catch(function (err) {
			return res.status(500).send({error: err});
		});
};

exports.likeMessage = (req, res, next) => {
    // Params
    const decodedToken = jwt.decode(req.headers.authorization.split(" ")[1], process.env.SECRET_KEY);
    var userId = parseInt(decodedToken.id);
    var messageId = parseInt(req.params.messageId);
    // Verifie existance message
    models.Message.findOne({ where: { id: messageId } })
        .then(function(OneMessage) {
            // Cherche le message dans la table likes
            models.Like.findOne({ where: { messageId: OneMessage.id, userId: userId } })
                .then(function(Vote) {
                    if (Vote != null) {
                        if (Vote.isLike >= 0) {
                            var LIKE = 1 - Vote.isLike;
                            models.Like.update({ isLike: LIKE }, { where: { messageId: messageId, userId: userId, } })
                                .then(function(Remark) { return res.status(201).json({ send: "Your like is change" }) })
                                .catch(function(err) { return res.status(400).send({ error: err }) });
                        } else { return res.status(400).json({ error: "pas possible" }) }
                    } else {
                        models.Like.create({ messageId: messageId, userId: userId, isLike: 1 })
                            .then(function(Remark) { return res.status(201).json({ send: "Your like is added" }) })
                            .catch(function(err) { return res.status(400).send({ error: err }) });
                    }
                })
                .catch(function(err) { return res.status(400).json({ error: err }); });
        })
        .catch(function(err) { return res.status(500).json({ error: err }) });
}

exports.dislikeMessage = (req, res, next) => {
    // Params
    const decodedToken = jwt.decode(req.headers.authorization.split(" ")[1], process.env.SECRET_KEY);
    var userId = parseInt(decodedToken.id);
    var messageId = parseInt(req.params.messageId);
    //verifie si message exite
    models.Message.findOne({ where: { id: messageId } })
        .then(function(OneMessage) {
            // Cherche le message dans la table likes
            models.Like.findOne({ where: { messageId: OneMessage.id, userId: userId } })
                .then(function(Vote) {
                    if (Vote != null) {
                        if (Vote.isLike <= 0) {
                            var DISLIKE = -1 - Vote.isLike;
                            models.Like.update({ isLike: DISLIKE }, { where: { messageId: messageId, userId: userId } })
                                .then(function(Remark) { return res.status(201).json({ send: "Your like is change" }) })
                                .catch(function(err) { return res.status(400).json({ error: err }) });
                        } else { return res.status(400).json({ error: "pas possible" }) }
                    } else {
                        models.Like.create({ messageId: messageId, userId: userId, isLike: -1 })
                            .then(function(Remark) { return res.status(201).json({ send: "Your like is added" }) })
                            .catch(function(err) { return res.status(400).json({ error: err }) });
                    }

                })
                .catch(function(err) { return res.status(400).json({ error: err }); });
        })
        .catch(function(err) { return res.status(500).json({ error: err }) });
}