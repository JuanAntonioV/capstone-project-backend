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

module.exports = {
    getAppUrl,
    generateSalesId,
};
