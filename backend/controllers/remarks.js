// Imports
var models = require("../models");
const jwt = require("jsonwebtoken");
const fs = require("fs-extra");


//** crée un commmentaire **//
exports.createRemark = (req, res, next) => {

    // decode le token
    const decodedToken = jwt.decode(
        req.headers.authorization.split(" ")[1],
        process.env.SECRET_KEY
    );
    // Params
    var userId = parseInt(decodedToken.id);
    var messageId = parseInt(req.params.messageId);
    var remark = req.body.remark;
    console.log(userId, messageId, remark);

    models.Message.findOne({

            where: { id: messageId },
        })
        .then(function(OneMessage) {
            models.Remark.create({
                    messageId: OneMessage.id,
                    userId: userId,
                    remark: remark,
                })
                .then(function(Remark) {
                    return res.status(201).json({ send: "Your remark is added" });
                })
                .catch(function(err) {
                    return res.status(400).json({ error: err });
                });
        })
        .catch(function(err) {
            return res.status(500).json({ error: err });
        });
};
//** Affiche toutes les commentaires du message **//
exports.getAllRemarkes = (req, res, next) => {
    // Params
    var MessageId = parseInt(req.params.messageId);
    console.log(MessageId);
    models.Remark.findAll({
		attributes: ['messageId', 'userId', 'remark'],
		where: {messageId: MessageId},
		include: {all: true},
	})
		.then(function (IdallRemarks) {
			console.log(IdallRemarks);
			res.status(200).json({send:IdallRemarks});
		})

		.catch(function (err) {
			return res.status(500).send({
				error: err,
			});
		});

};
//** Affiche toutes les commentaires d'un id utilisateur selon l'id message **//
exports.getRemarkesUserId = (req, res, next) => {
    // Params
    var messageId = parseInt(req.params.messageId);
    var userId = parseInt(req.params.userId);

    console.log(messageId, userId);
    models.Remark.findAll({
		attributes: ['id', 'remark', 'userId'],
		where: {messageId: messageId},
		include: {all: true},
		order: [["createdAt", "DESC"]],
	})
		.then(function (allRemarks) {
			res.status(200).send(allRemarks);
		})

		.catch(function (err) {
			return res.status(500).send({
				error: err,
			});
		});

};

exports.modifyRemarkId = (req, res, next) => {
    // Params
    var remarkId = parseInt(req.params.remarkId);
    var userId = parseInt(req.params.id);
    var remark = req.body.remark;
    console.log(remarkId, remark, userId);
    models.Remark.findOne({
            attributes: ["id", "messageId", "userId", "remark"],
            where: { id: remarkId, userId: userId },
        })
        .then(function(oldRemark) {
            console.log("old:", oldRemark.id);
            models.Remark.update({
                    remark: remark,
                }, {
                    where: { id: oldRemark.id },
                })
                .then(function(newRemark) {
                    res.status(200).send(newRemark);
                })

            .catch(function(err) {
                return res.status(500).send({
                    error: "error Update",
                });
            })
        })
        .catch(function(err) {
            return res.status(500).send({
                error: err,
            });
        });


};

exports.deleteRemarkId = (req, res, next) => {
    // Params
    var remarkId = parseInt(req.params.remarkId);
    var userId = parseInt(req.params.id);


    models.Remark.findOne({
            attributes: ["id", "messageId", "userId", "remark"],
            where: { id: remarkId, userId: userId },
        })
        .then(function(oldRemark) {

            models.Remark.destroy({
                    where: { id: oldRemark.id },
                })
                .then(function(newRemark) {
                    res.status(200).send("remark detroy");
                })

            .catch(function(err) {
                return res.status(500).send({
                    error: "error delete",
                });
            })
        })
        .catch(function(err) {
            return res.status(500).send({
                error: "remark no found",
            });
        });


};