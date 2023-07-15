const superagent = require('superagent');
const config = require('./config.json');
const index = require('./index');
const fs = require('fs');

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
        notes
      }
    }
  }
  `;

const mutation = `mutation ($id: Int, $score: Float, $notes: String) {
    SaveMediaListEntry(id: $id, score: $score, notes: $notes) {
      id
      score
      notes
    }
  }
`;

async function getList() {
    let hasNextPage = true;
    let page = 1;
    const animeArr = [];

    while (hasNextPage) {
        console.log(page);
        const response = await (await superagent.post('https://graphql.anilist.co').send({query: dump_query, variables: {name: config.username, page}})).body.data;
        const mediaList = response.Page.mediaList;
        for (const media of mediaList) {
          animeArr.push({id: media.id, name: media.media.title.romaji, score: media.score, notes: media.notes});
        }
        page++;
        hasNextPage = response.Page.pageInfo.hasNextPage
    }

    return [...new Set(animeArr)];
}

async function makeMutationRequest(id, score, notes) {
    const response = await superagent.post('https://graphql.anilist.co')
        .send({query: mutation, variables: {id, score, notes}})
        .set('Authorization', `Bearer ${process.env.ACCESS_TOKEN}`);
    return response.body;
}

async function updateList() {
    const list = await getList();
    index.init();

    const outputArr = fs.readFileSync('./scores-output.txt', 'utf-8').split(/\r?\n/);
    const outputObj = outputArr.map((item, index) => ({name: item.split(' - ')[0], score: item.split(' - ')[1], notes: `${Math.ceil(((outputArr.length - (index + 1)) / outputArr.length) * 100)}${Math.ceil(((outputArr.length - (index + 1)) / outputArr.length) * 100) === 1 ? 'st' : (Math.ceil(((outputArr.length - (index + 1)) / outputArr.length) * 100) === 2 ? 'nd' : 'th')} percentile`}));

    for (const show of outputObj) {
        const foundItem = list.find(item => item.name === show.name);
        if (parseInt(show.score) === foundItem.score && show.notes === foundItem.notes) {
          continue;
        }
        console.log(`${show.name} - ${show.score} - ${show.notes}`);
        await makeMutationRequest(foundItem.id, show.score, show.notes);
        await new Promise(r => setTimeout(r, 1000));
    }
}

updateList();
