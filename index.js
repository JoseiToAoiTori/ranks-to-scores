const fs = require('fs');
const config = require('./config.json');

const anime = fs.readFileSync('./rankings.txt', 'utf-8').split(/\r?\n/);

function groupByPercentage(anime, percentages) {
    // Get percentage for 1 user:
    let unit = 100 / anime.length;
    // Sort percentages by decreasing remainder (modulo unit) 
    //   and get number of units covered by each percentage
    let sorted = percentages.map((p, i) => [i, Math.floor(p / unit), p % unit])
                            .sort((a, b) => b[2] - a[2]);
    // Get how many units are not yet distributed:
    let remain = anime.length - sorted.reduce((sum, a) => sum += a[1], 0);
    // Distribute those, giving priority to groups where the remainders are greatest
    for (let i = 0; i < remain; i++) sorted[i][1]++;
    // Build and return the chunks by filling the groups in their 
    //    original order
    let i = 0;
    const groupedArr = sorted.sort((a, b) => a[0] - b[0]).map(a => anime.slice(i, i+=a[1]));

    let newPlainText = ``;
    const scores = [];
    for (let i = 0;i < groupedArr.length;i++) {
        for (const anAnime of groupedArr[i]) {
            newPlainText += `${anAnime} - ${10 - i}\n`;
            scores.push(10 - i);
        }
    }
    // console.log(scores.reduce((partialSum, a) => partialSum + a, 0) / scores.length);
    fs.writeFileSync('./scores-output.txt', newPlainText, 'utf-8');
}

module.exports.init = function () {
    groupByPercentage(anime, config.percentages);
}

groupByPercentage(anime, config.percentages);
