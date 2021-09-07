'use strict';
module.exports = {
    up: async(queryInterface, Sequelize) => {
        await queryInterface.createTable("Users", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            firstName: {
                allowNull: true,
                type: Sequelize.STRING,
            },
            lastName: {
                allowNull: true,
                type: Sequelize.STRING,
            },
            pseudo: {
                allowNull: true,
                type: Sequelize.STRING,
            },
            email: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            bio: {
                allowNull: true,
                type: Sequelize.STRING,
            },
            avatar: {
                allowNull: true,
                type: Sequelize.STRING,
            },
            password: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            isAdmin: {
                allowNull: false,
                type: Sequelize.BOOLEAN,
                default: 0,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },
    down: async(queryInterface, Sequelize) => {
        await queryInterface.dropTable('Users');
    }
};