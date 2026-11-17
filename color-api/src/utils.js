const os = require('os');
const path = require('path');
const fs = require('fs');

const getColor = () => {

    let color = process.env.DEFAULT_COLOR;
    const filePath = process.env.COLOR_CONFIG_PATH;

    if(filePath){

        try {
            
            const colorFromFile = fs.readFileSync(path.resolve(filePath),'utf8');

            color = colorFromFile.trim();

        } catch (error) {
            
            console.error(`Failed to read contents of ${filePath}`);
            console.error(error);

        }

    }
    
    return color || 'blue';

};

const getHostname = () => os.hostname();

module.exports = {
    getColor,
    getHostname,
};