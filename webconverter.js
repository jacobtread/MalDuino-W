const zlip = require('zlib')
const fs = require('fs/promises')
const path = require('path')

const MIME_TYPES = {
    'js': 'application/javascript',
    'css': 'text/css',
    'html': 'text/html',
}
const DEFAULT_MIME = 'text/plain'

function fileNameToVar(name) {
    return name.replace(/[/.-]/g, '_')
}

function createServerCallback(file, varName, mimeType) {
    return `\\
server.on("${ file }", HTTP_GET, [](AsyncWebServerRequest* request) {\\
    reply(request, 200, "${ mimeType }", ${ varName }, sizeof(${ varName }));\\
});`
}

const callbacks = [];
const hexData = [];

async function createCallbacks(dir, prefix = '/') {
    const files = await fs.readdir(dir)
    for (let file of files) {
        const filePath = path.join(dir, file)
        const stats = await fs.stat(filePath)
        if (stats.isDirectory()) {
            await createCallbacks(filePath, prefix + file + '/')
        } else {
            const varName = fileNameToVar(prefix + file)
            let memString = `const uint8_t ${ varName }[] PROGMEM = {`
            const buffer = zlip.gzipSync(await fs.readFile(filePath))
            const contents = buffer.toString('hex')
            for (let i = 0; i < contents.length; i += 2) {
                memString += ('0x' + contents[i] + '' + contents[i + 1]) + ','
            }
            memString = memString.substring(0, memString.length - 1)
            memString += '};\n'

            let mimeType = DEFAULT_MIME
            for (let key in MIME_TYPES) {
                if (filePath.endsWith('.' + key)) {
                    mimeType = MIME_TYPES[key];
                    break
                }
            }
            hexData.push(memString)
            if (file.endsWith('.html')) {
                let newPrefix = prefix.substring(0, prefix.length - 1)
                if (newPrefix.length === 0) newPrefix = '/'
                callbacks.push(createServerCallback(newPrefix, varName, mimeType))
            } else {
                callbacks.push(createServerCallback(prefix + file, varName, mimeType))
            }
        }
    }
}

createCallbacks('websvelte/build').then(() => {
    let output = '#pragma once\n\n'
    output += '#define WEBSERVER_CALLBACK '
    for (let callback of callbacks) {
        output += callback
    }
    output += '\n'
    for (let hexDatum of hexData) {
        output += hexDatum
    }
    return fs.writeFile(path.join('esp_duck', 'webfiles.h'), output, 'utf8')
}).then(() =>
    console.log('Compiled new web files')).catch()