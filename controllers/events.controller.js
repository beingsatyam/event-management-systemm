
const Event = require('../models/events.model');
const Registration = require('../models/registrations.model');
const User = require('../models/users.model');
const emailService = require('../utils/EmailService')


async function createEvent(req, res) {
    try {

        const { name, description, date, time } = req.body;
        const userId = req.user.user_id;

        const event = await Event.create({
            event_name: name,
            event_description: description,
            event_date: date,
            event_time: time,
            created_by: userId
        });
        res.status(201).json(event);

    } catch (error) {

        console.error('Error updating event:', error);
        res.status(500).json({ error: 'Internal server error' });

    }

};

async function updateEvent(req, res) {

    // updates an event, a mail is sent to the attendees after successfull updation

    try {
        const { event_id } = req.params;
        const { date, time, description } = req.body;

        console.log('event details', date, time, description);

        const event = await Event.findByPk(event_id, {
            include: {
                model: User,
                as: 'Attendees',
                through: {
                    attributes: []
                }
            }
        });


        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        };


        const oldEvent = event.toJSON();

        if (date) event.event_date = date;
        if (time) event.event_time = time;
        if (description) event.event_description = description;

        await event.save();

        const changes = [];

        console.log(oldEvent.event_date, event.event_date, 'DATE');


        if (oldEvent.event_date !== event.event_date) changes.push('date');
        if (oldEvent.event_time !== event.event_time) changes.push('time');
        if (oldEvent.event_description !== event.event_description) changes.push('description');

        //send mails to event attendees
        if (changes.length > 0) {
            const users = event.Attendees;
            for (const user of users) {

                console.log(user.email);
                emailService.sendEmail(user.email, `Update on Event: ${event.event_name}`, `Dear ${user.name},\n\nThe event "${event.event_name}" has been updated.\n\nBest regards,\nEvent Management Team`)
            
            }

        }

        res.status(200).json({ message: 'Event updated successfully', event });
    } catch (error) {
        res.status(500).json({ error });
    }
};

async function deleteEvent(req, res) {

    // deletes an event, a mail is sent to the attendees after successfull deletion

    try {
        const { event_id } = req.params;

        // const event = await Event.findByPk(event_id);
        const event = await Event.findByPk(event_id, {
            include: {
                model: User,
                as: 'Attendees',
                through: {
                    attributes: []
                }
            }
        });

        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }


        await event.destroy();


        const users = event.Attendees;
        for (const user of users) {

            console.log(user.email);
            emailService.sendEmail(user.email, `Event Cancelled!: ${event.event_name}`, `Dear ${user.name},\n\nThe event "${event.event_name}" has been cancelled.\n\nBest regards,\nEvent Management Team`)
        }

        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({ error: 'Internal server error', error });
    }
};

async function registerEvent(req, res) {

    // adds a user to an event, a mail is sent to the user after successfull registration

    try {
        const { event_id } = req.params;
        const { user_id, email } = req.user;

        console.log(event_id, user_id);


        const event = await Event.findByPk(event_id);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        const existingRegistration = await Registration.findOne({
            where: {
                user_id: user_id,
                event_id: event_id
            }
        });

        if (existingRegistration) {
            return res.status(400).json({ error: 'User already registered for this event' });
        }

        const registration = await Registration.create({
            user_id: user_id,
            event_id: event_id
        });

        console.log('event', event)
        const registrationEmail = `Dear user,\n\nThank you for registering for ${event.event_name}! We are excited to have you join us. Below are the details of the event:

            Event: ${event.event_description}
            Date: ${event.event_date}
            Time: ${event.event_time}
            Registration ID: ${registration.registration_id}
            
        Best Regards,
        Event Management Team`


        emailService.sendEmail(email, 'Event Registration!', registrationEmail)

        res.status(201).json({ message: 'Successfully registered for the event', registration });

    } catch (error) {
        console.error('Error registering for event:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};



async function getEvents(req, res) {

    // returns the registered event of an user

    try {

        const { user_id } = req.user;

        console.log("user_id=", user_id);

        // fetching events_ids of the all the events registered by a user
        const registration = await Registration.findAll({
            where: {
                user_id: user_id,
            }
        });

        const events = []
        for (reg of registration) {
            console.log(reg.event_id);

            const event = await Event.findOne({
                where: {
                    event_id: reg.event_id,
                }
            });
            events.push(event);
        };

        if (!events || events.length === 0) {
            return res.status(404).json({ message: 'No events found for the user.' });
        }

        return res.status(200).json({ events });
    } catch (error) {

        return res.status(500).json({ error: error.message });
    }
};



module.exports = { createEvent, updateEvent, registerEvent, deleteEvent, getEvents };