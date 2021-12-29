const fs = require('fs')
const path = require('path')

const compiledFile = path.join('build', 'esp_duck.ino.bin')

if (!fs.existsSync(compiledFile)) {
    console.error('File does not exist? Did you run yarn compile first?');
    return
}

console.log('Uploading new binary')

const request = require('request');
const options = {
    'method': 'POST',
    'url': 'http://192.168.4.1/update',
    'headers': {},
    formData: {
        'update': {
            'value': fs.createReadStream(compiledFile),
            'options': {
                'filename': 'esp_duck.ino.bin',
                'contentType': null
            }
        }
    }
};
request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log('Upload complete: ' + response.body);
});