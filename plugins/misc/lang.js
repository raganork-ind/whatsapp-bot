const {LANGUAGE} = require('../../config');
const {existsSync,readFileSync} = require('fs');
var json = existsSync('/skl/Raganork/plugins/misc/lang/' + LANGUAGE + '.json') ? JSON.parse(readFileSync('/skl/Raganork/plugins/misc/lang/' + LANGUAGE + '.json')) : JSON.parse(readFileSync('/skl/Raganork/plugins/misc/lang/english.json'));
function getString(file) { return json['STRINGS'][file]; }
module.exports = {language: json, getString: getString }
