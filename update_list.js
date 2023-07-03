const superagent = require('superagent');
const fs = require('fs');
const config = require('./config.json');

const dump_shows_with_scores = require('./dump_shows_with_scores');
const index = require('./index');
const compare_scores = require('./compare_scores');

require('dotenv').config();

const dump_query = `query ($name: String, $page: Int) {
    Page(page: $page, perPage: 50) {
      pageInfo {
        hasNextPage
      }
      mediaList(userName: $name, type: ANIME, sort: [SCORE_DESC, MEDIA_ID], status: COMPLETED) {
        id
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

const mutation = `mutation ($id: Int, $score: Float) {
    SaveMediaListEntry(id: $id, score: $score) {
      id
      score
    }
  }
`;

function readRankings() {
    return fs.readFileSync('./scores-output.txt', 'utf-8').split(/\r?\n/).filter(Boolean);
}

async function getList() {
    let hasNextPage = true;
    let page = 1;
    const animeArr = [];

    while (hasNextPage) {
        console.log(page);
        const response = await (await superagent.post('https://graphql.anilist.co').send({query: dump_query, variables: {name: config.username, page}})).body.data;
        const mediaList = response.Page.mediaList;
        for (const media of mediaList) {
            if (media.score > 0) {
                animeArr.push({id: media.id, name: media.media.title.romaji});
            }
        }
        page++;
        hasNextPage = response.Page.pageInfo.hasNextPage
    }

    return [...new Set(animeArr)];
}

async function makeMutationRequest(id, score) {
    const response = await superagent.post('https://graphql.anilist.co')
        .send({query: mutation, variables: {id, score}})
        .set('Authorization', `Bearer ${process.env.ACCESS_TOKEN}`);
    return response.body;
}

async function updateList() {
    const list = await getList();
    index.init();
    await dump_shows_with_scores.init();

    const comparison = compare_scores.returnComparison();

    for (const change of comparison) {
        const [show, score] = change.split(' - ');
        const foundItem = list.find(item => item.name === show);
        await makeMutationRequest(foundItem.id, score);
        await new Promise(r => setTimeout(r, 1000));
    }
}

updateList();
