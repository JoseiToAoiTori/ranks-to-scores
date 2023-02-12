const superagent = require('superagent');
const fs = require('fs');
const config = require('./config.json');

const query = `query ($name: String, $page: Int) {
  Page(page: $page, perPage: 50) {
    pageInfo {
      hasNextPage
    }
    mediaList(userName: $name, type: ANIME, sort: SCORE_DESC, status: COMPLETED) {
      media {
        id
        title {
          romaji
          english
          native
          userPreferred
        }
      }
      score
    }
  }
}
  `;
async function getList() {
    let hasNextPage = true;
    let page = 1;
    const animeArr = [];

    while (hasNextPage) {
        const response = await (await superagent.post('https://graphql.anilist.co').send({query, variables: {name: config.username, page}})).body.data;
        const mediaList = response.Page.mediaList;
        for (const media of mediaList) {
            if (media.score > 0) {
                animeArr.push(media.media.title.romaji);
            }
        }
        page++;
        hasNextPage = response.Page.pageInfo.hasNextPage
    }
    fs.writeFileSync('./rankings.txt', animeArr.join('\n'), 'utf-8');
}

getList();
