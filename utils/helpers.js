const bcrypt = require('bcrypt');
const moment = require('moment');

const getAppUrl = () => {
    const port = process.env.PORT || 3000;
    const envAppUrl = process.env.APP_URL;
    const appUrl = `http://localhost:${port}`;

    if (envAppUrl) {
        return envAppUrl;
    }

    return appUrl;
};

const generateSalesId = () => {
    // Get the current date and time
    const currentDate = new Date();

    // Extract year, month, day, hours, minutes, and seconds
    const year = String(currentDate.getFullYear()).slice(-2);
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');

    // Generate 6 random characters
    const randomChars = generateRandomChars(6);

    // Construct the sales ID
    const salesId = `${year}${month}${day}-${hours}${minutes}${seconds}-${randomChars}`;

    return salesId.toUpperCase();
};

// Function to generate random characters
const generateRandomChars = (length) => {
    const characters =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomChars = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomChars += characters.charAt(randomIndex);
    }
    return randomChars;
};

// Example usage
// const salesId = generateSalesId();
// console.log(salesId);

// Hashing password
const hashPassword = async (password) => {
    const passwordSalt = process.env.PASSWORD_SALT || 10;
    return await bcrypt.hash(password, Number(passwordSalt));
};

const checkPassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};

const getCurrentDate = (format, add, addUnit) => {
    const currFormat = format || 'YYYY-MM-DD HH:mm:ss';
    const currAdd = add || 0;
    const currAddUnit = addUnit || 'days';
    return moment().add(currAdd, currAddUnit).format(currFormat);
};

const getFileUrl = (req, filename) => {
    const appUrl = req.protocol + '://' + req.get('host');
    return `${appUrl}/${filename}`;
};

module.exports = {
    getAppUrl,
    generateSalesId,
    hashPassword,
    getCurrentDate,
    checkPassword,
    getFileUrl,
};
