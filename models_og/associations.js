const User = require('./users.model');
const Event = require('./events.model');
const Registration = require('./registrations.model');

// Define associations with unique aliases
User.hasMany(Event, { foreignKey: 'created_by', as: 'createdEvents' });
Event.belongsTo(User, { foreignKey: 'created_by', as: 'eventCreator' });

User.hasMany(Registration, { foreignKey: 'user_id', as: 'registrations' });
Registration.belongsTo(User, { foreignKey: 'user_id', as: 'registeredUser' });

Event.hasMany(Registration, { foreignKey: 'event_id', as: 'eventRegistrations' });
Registration.belongsTo(Event, { foreignKey: 'event_id', as: 'registeredEvent' });

module.exports = { User, Event, Registration };
