const fs = require('fs');

const array1 = fs.readFileSync('./rankings.txt', 'utf-8').split('\n');
const array2 = fs.readFileSync('./rankings2.txt', 'utf-8').split('\n');

const array3 = array1.filter(function(obj) { return array2.indexOf(obj) == -1; });

console.log(array3.join('\n'));
