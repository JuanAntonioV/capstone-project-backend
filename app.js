const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const appRouter = require('./routers');
dotenv.config();

const app = express();

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.use('/', appRouter());

const port = process.env.APP_PORT || 3000;

app.listen(port, () => {
    console.log(`server is running on http://localhost:${port}`);
});
