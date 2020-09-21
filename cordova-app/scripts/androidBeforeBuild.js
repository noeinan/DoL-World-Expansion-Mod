const fs = require('fs')
const MAIN = 'Degrees of Lewdity.html'
fs.copyFileSync(`../${MAIN}`, `www/${MAIN}`)