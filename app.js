const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const appRouter = require('./routers');
const TIMEZONE = require('./entities/timezoneEntities');
const { errorHandler } = require('./middlewares/handlerMiddleware');
const moment = require('moment');
const multer = require('multer');
const path = require('path');
dotenv.config();

const app = express();

moment.tz.setDefault(TIMEZONE.JAKARTA);
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/storages', express.static(path.join(__dirname, 'storages')));
app.use(cors());

app.use('/', appRouter());

app.use(errorHandler);

const port = process.env.APP_PORT || 3000;

app.listen(port, () => {
    console.log(`server is running on http://localhost:${port}`);
});
