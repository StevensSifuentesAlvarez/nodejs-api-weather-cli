const fs = require('fs')

const filename = './db/database.json'

const saveFile = (data) => {
    fs.writeFileSync(filename, JSON.stringify(data))
}

const readFile = () => {
    if(!fs.existsSync(filename)) return null
    const data = fs.readFileSync(filename, {encoding: 'utf-8'})
    return JSON.parse(data)
}

module.exports = {
    saveFile,
    readFile
}