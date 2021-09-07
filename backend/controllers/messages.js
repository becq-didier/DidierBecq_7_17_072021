// Import
const models = require("../models");
const jwt = require("jsonwebtoken");
const fs = require("fs-extra");

//** Creation message **//
exports.createMessage = (req, res, next) => {
    // decode le token
    const decodedToken = jwt.decode(
        req.headers.authorization.split(" ")[1],
        process.env.SECRET_KEY
    );

    // Params
    var userId = decodedToken.id;
    var title = req.body.title;
    var content = req.body.content;
    var attachment = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;
    // var attachment = req.body.attachment;
    var likes = 0;

    // constraint
    if (!title || !content || !attachment) { return res.status(400).json({ error: "Paramètres manquants" }) }
    if (title.length >= 21 || title.length <= 3) { return res.status(400).json({ error: "Titre incorrect (longueur entre 4 - 20) " }) }
    if (content.length >= 256 || content.length <= 3) { return res.status(400).json({ error: "mauvais contenu(longueur entre 4 - 255)" }) }

    models.Message.create({
            UserId: userId,
            title: title,
            content: content,
            attachment: attachment,
            likes: likes,
        })
        .then(function(newMessage) { return res.status(201).json({
			message: newMessage,
			send: 'Votre message est ajouté',
		}); })
        .catch(function(err) { return res.status(400).json({ error: err }) });
};


exports.getAllMessages = (req, res, next) => {
    models.Message.findAll({
            attributes: ["id", "userId", "title", "content", "attachment"],
            include: [
                { model: models.User },
                { model: models.Remark, attributes: ["remark"] },
                { model: models.Like, attributes: ["isLike"] }
            ],
            order: [
                ["createdAt", "DESC"]
            ],
        })
        .then(function(allMessages) { res.status(200).send(allMessages) })
        .catch(function(err) { return res.status(500).send({ error: "erreur impossible obtenir message" }) });
};


exports.getAllMessageUserId = (req, res, next) => {
    var messageId = parseInt(req.params.messageId);
    console.log(messageId);
    models.Message.findOne({
            attributes: ["id", "userId", "title", "content", "attachment"],
            include: [{ model: models.User }, { model: models.Remark }],
            // order: [
            //     ["createdAt", "DESC"]
            // ],
            where: { id: messageId },
        })
        .then(function(IdallMessages) {
            res.status(200).send(IdallMessages);
        })
        .catch(function(err) {
            return res.status(500).send({ error: "erreur impossible obtenir message" });
        });
};

exports.modifyMessage = (req, res, next) => {
    console.log("lol",req.params);
    console.log(req.body);
//ajouté if(req.file){} quand pas d'image
    // Params
    var title = req.body.title;
    var content = req.body.content;
    var messageId = parseInt(req.params.idMessage);
    var userId = parseInt(req.params.id);
    
    if(req.file){
        var attachment = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;
    console.log(attachment);
    const filename = attachment.split("/images/")[1];
    console.log(filename);
    console.log(title, content, attachment, messageId, userId);
        models.Message.findOne({ where: { id: messageId, userId: userId } })
            .then(function(oldMessage) {
                if (oldMessage) {
                    const filename = oldMessage.attachment.split("/images/")[1];
                    fs.unlink(`images/${filename}`, () => {
                        models.Message.update({
                                title: title,
                                content: content,
                                attachment: attachment,
                            }, { where: { id: oldMessage.id } })
                            .then((userFound) => { res.status(200).send("Mise à jour réussie") })
                            .catch((err) => { res.status(400).send({ error: "problèmes" }) });
                    });
                } else { fs.unlink(`images/${filename}`, () => { return res.status(400).json({ error: "Impossible de vérifier l'utilisateur" }) }); }
            })
            .catch((err) => { return res.status(500).json({ error: err }) });

    } else {
        models.Message.findOne({ where: { id: messageId, userId: userId } })
            .then(function(oldMessage) {
                if (oldMessage) {
                    // const filename = oldMessage.attachment.split("/images/")[1];
                    // fs.unlink(`images/${filename}`, () => {
                        models.Message.update({
                                title: title,
                                content: content,
                                // attachment: attachment,
                            }, { where: { id: oldMessage.id } })
                            .then((userFound) => { res.status(200).send("Mise à jour réussie") })
                            .catch((err) => { res.status(400).send({ error: "problèmes" }) });
                    // });
                } else { fs.unlink(`images/${filename}`, () => { return res.status(400).json({ error: "Impossible de vérifier l'utilisateur" }) }); }
            })
            .catch((err) => { return res.status(500).json({ error: err }) });
    }
}

exports.deleteMessage = (req, res, next) => {

    // Params
    var messageId = parseInt(req.params.idMessage);
    var userId = parseInt(req.params.id);

    models.Message.findOne({ where: { id: messageId }, })
        .then(function(oneMessage) {
            if (oneMessage) {
                models.Like.destroy({ where: { messageId: messageId } });
                models.Remark.destroy({ where: { messageId: messageId } });
            }
            const filename = oneMessage.attachment.split('/images/')[1];
            fs.unlink(`images/${filename}`, (err) => {console.log(err) });
            console.log("idMessage:", messageId, "userId:", userId);
            models.Message.destroy({ where: { id: oneMessage.id } })
                .then((userFound) => { return res.status(200).send("Message supprimé") })
                .catch((err) => { return res.status(500).send({ error: "pas possible message" }) });
        })
        .catch(function(err) { return res.status(500).send({ error: "pas possible de trouvermessage" }) })
};