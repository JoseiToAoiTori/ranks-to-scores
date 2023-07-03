const fs = require('fs');

const array1 = fs.readFileSync('./scores-output.txt', 'utf-8').split(/\r?\n/);
const array2 = fs.readFileSync('./scores-existing.txt', 'utf-8').split(/\r?\n/);

const array3 = array1.filter(function(obj) { return array2.indexOf(obj) == -1; });

console.log(array3.filter(Boolean).join('\n'));

module.exports.returnComparison = function () {
    return array3.filter(Boolean);
}
