// console.log("arguments from terminal",process.argv[2]);

const fs = require('fs');

const fileName = `${process.argv[2]}Controller`;
const content = `const { okResponse } = require('../utils/response');
/*
    This is a sample controller, you can continue to build your own controller
    by following the sample below.
*/

const index = async (req, res) => {
    okResponse(res, {
        message: 'Hello World',
    });
};

module.exports = {
    index,
};
`;
const generatedLoc = `${__dirname + `/../controllers/${fileName}.js`}`;

try {
    fs.writeFileSync(generatedLoc, content);

    console.log('Controller generated successfully');
    console.log('generated in :', generatedLoc);
} catch (error) {
    console.log(error);
}
