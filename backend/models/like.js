'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {

    class Like extends Model {
        /**
         * Méthode d'assistance pour définir des associations.
         * Cette méthode ne fait pas partie du cycle de vie séquelle.
         * Le fichier `modèles / index` appellera cette méthode automatiquement.
         */

        static associate(models) {
            // Définir l'association ici
            models.Like.belongsTo(models.User, {
                foreignKey: "userId",
                as: "user",
            });

            models.Like.belongsTo(models.Message, {
                foreignKey: "messageId",
                as: "message",
            });
        }
    };
    Like.init({
        isLike: DataTypes.INTEGER,
        messageId: DataTypes.INTEGER,
        userId: DataTypes.INTEGER,
    }, {
        sequelize,
        modelName: "Like",
    });
    return Like;
};