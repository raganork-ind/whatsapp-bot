const {LANGUAGE} = require('../../config');
const {existsSync,readFileSync} = require('fs');
var json = fs.existsSync('./lang/' + LANGUAGE + '.json') ? JSON.parse(fs.readFileSync('./language/' + LANGUAGE + '.json')) : JSON.parse(fs.readFileSync('./language/english.json'));
function getString(file) { return json['STRINGS'][file]; }
module.exports = {language: json, getString: getString }
