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

Event.belongsToMany(User, {
    through: {
        model: Registration,
        unique: false
    },
    as: 'Attendees', 
    foreignKey: 'event_id'
});

User.belongsToMany(Event, {
    through: {
        model: Registration,
        unique: false
    },
    as: 'Events', 
    foreignKey: 'user_id'
});



module.exports = Registration;