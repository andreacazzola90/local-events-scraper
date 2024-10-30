
const visitSchioScript = require('./visitSchio'); // Importing the script.js file
const comuneSchioScript = require('./comuneSchio'); 
const comuneValdagnoScript = require('./comuneValdagno'); 
const fetch = require('node-fetch');
const facebookScript = require('./facebook');
(async () => {
    // Call a function from script.js if necessary
    await visitSchioScript();
    // await comuneSchioScript();
    // await comuneValdagnoScript();
    // await facebookScript();

})();




