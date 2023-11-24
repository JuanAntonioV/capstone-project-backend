const getAppUrl = () => {
    const port = process.env.PORT || 3000;
    const envAppUrl = process.env.APP_URL;
    const appUrl = `http://localhost:${port}`;

    if (envAppUrl) {
        return envAppUrl;
    }

    return appUrl;
};

module.exports = {
    getAppUrl,
};
