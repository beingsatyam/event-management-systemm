const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./users.model');
const Event = require('./events.model');

const Registration = sequelize.define('Registration', {
    registration_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'user_id'
        },
        allowNull: false
    },
    event_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Event,
            key: 'event_id'
        },
        allowNull: false
    }
}, {
    tableName: 'Registrations'
});


Registration.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Registration.belongsTo(Event, { foreignKey: 'event_id', as: 'event' });

module.exports = Registration;
