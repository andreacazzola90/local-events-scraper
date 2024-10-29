const fs = require('fs');
const path = require('path');
// Function to save JSON object to a file
const saveJsonToFile = (obj, filename) => {
    // Convert the JSON object to a string
    const jsonString = JSON.stringify(obj, null, 2); // Pretty print with 2 spaces
    // Write the JSON string to a file
    const directory = path.join(__dirname, 'json'); // Change 'subfolder' 

    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true }); // Use recursive: true to create nested folders if needed
    }

    const filePath = path.join(directory, `${filename}.json`); // Change 
    fs.writeFileSync(filePath, jsonString);
};

module.exports = saveJsonToFile;