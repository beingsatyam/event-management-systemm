const express = require('express');
const sequelize = require('./config/database');
require('dotenv').config();

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const userRoute = require('./routes/users.routes');
const eventRoute = require('./routes/events.routes');
// const newsRoute = require('./routes/news.routes');

app.use('/users' ,userRoute );
app.use('/events' ,eventRoute );



sequelize.sync().then(() => {
    console.log('Database & tables created!');
});



app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
});

module.exports = app;