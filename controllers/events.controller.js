
const { User, Event, Registration } = require('../models/associations');
const emailService = require('../utils/EmailService')

async function createEvent (req , res) {
    try{
            
        const { description, date, time } = req.body;
        const userId = req.user.user_id;

        const event = await Event.create({
            event_description : description,
            event_date : date,
            event_time : time,
            created_by : userId
        });
        res.status(201).json(event);
    } catch (error) {

        console.error('Error updating event:', error);
        res.status(500).json({ error: 'Internal server error' });

    }

};

async function updateEvent (req, res) {

    try {
        const { event_id } = req.params;
        const { date, time, description } = req.body;
        
        console.log('event details ',date, time, description);

        const event = await Event.findByPk(event_id);

        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        if (date) {
            event.date = date;
            

        };

        if (time) {
            event.time = time;
            console.log(event.time)
        };

        if (description) {
            event.description = description;
        };

       await event.save();

        res.status(200).json({ message: 'Event updated successfully', event });

    } catch (error) {
        console.error('Error updating event:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


async function deleteEvent (req, res) {
    try {
        const { event_id } = req.params;

        const event = await Event.findByPk(event_id);

        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        await event.destroy();

        res.status(204).json({ message: 'Event deleted successfully' , event});
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({ error: 'Internal server error' ,error});
    }
};

async function registerEvent (req, res) {
    try {
        const { event_id } = req.params;
        const { user_id , email }= req.user; 

        console.log(event_id , user_id) ;


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

        const registrationEmail = `Thank you for registering for [Event Name]! We are excited to have you join us. Below are the details of the event:
            Event: ${event.description}
            Date: ${event.date}
            Time: ${event.time}
            Registration ID: ${registration.registration_id}`

        emailService.sendEmail( email , 'Event Registration!', registrationEmail)
        
        res.status(201).json({ message: 'Successfully registered for the event', registration });

    } catch (error) {
        console.error('Error registering for event:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};



async function getEvents(req, res) {
    try {

        const { user_id } = req.user;  

        console.log("user_id=",user_id);

        // fetching events_ids of the all the events registered by a user
        const registration = await Registration.findAll({
            where: {
                user_id: user_id,
            }
        });


        
        const events = []
        for (reg of registration ){
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
    
    



module.exports = {createEvent , updateEvent , registerEvent , deleteEvent , getEvents};