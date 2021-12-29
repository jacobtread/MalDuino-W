const http = require('http')
const fs = require('fs')
const path = require('path')

const compiledFile = path.join('build', 'esp_duck.ino.bin')

if (!fs.existsSync(compiledFile)) {
    console.error('File does not exist? Did you run yarn compile first?');
    return
}

const request = http.request('http://192.168.4.1/update', {
    method: 'POST',
    headers: {
        'Content-Type': 'multipart/form-data; boundary=WebAppBoundary'
    },
}, res => {
    let data = ''
    res.setEncoding('utf8')
    res.on('data', chunk => data += chunk)
    res.on('end', () => {
        console.table({
            status: res.statusCode,
            response: data
        })
    })
})
request.on('error', console.error)

request.write('--WebAppBoundary', 'utf8')
const data = fs.readFileSync(compiledFile, 'binary')
request.write(data, 'binary')
request.write('--WebAppBoundary--', 'utf8')
request.end()