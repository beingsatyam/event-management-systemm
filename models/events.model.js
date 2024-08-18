const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('../models/users.model');

const Event = sequelize.define('Event', {
    event_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    event_description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    event_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    event_time: {
        type: DataTypes.TIME,
        allowNull: false
    },
    created_by: {
        type: DataTypes.INTEGER,
        // references: {
        //     model: User,
        //     key: 'user_id'
        // },
        allowNull: false
    }
}, {
    tableName: 'Events'
});




module.exports = Event;
