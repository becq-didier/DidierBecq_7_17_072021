'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {

    class Remark extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            models.Remark.belongsTo(models.User, {
                foreignKey: "userId",
                as: "user",
            });
            models.Remark.belongsTo(models.Message, {
                foreignKey: "messageId",
                as: "message",
            });
        }

    };
    Remark.init({
        remark: DataTypes.STRING,
        messageId: DataTypes.INTEGER,
        userId: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'Remark',
    });
    return Remark;
};