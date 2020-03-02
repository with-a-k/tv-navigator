const moment = require('moment');
const bent = require('bent');
const getJSON = bent('json');

function formatShow(show) {
  var seasons = new Set();
  var totalTime = 0;
  var result = {
    showId: show.id,
    totalDurationSec: 0,
    averageEpisodesPerSeason: 0,
    episodes: {

    }
  };
  var epid = 0;
  for (episode in show.episodes) {
    innerEpisode = Object.values(episode)[0];
    totalTime += innerEpisode.runtime * 60;
    seasons.add(innerEpisode.season);
    result.episodes[innerEpisode.id] = formatEpisode(innerEpisode);
  };
  var episodeCount = Object.getOwnPropertyNames(show.episodes).length;
  result["averageEpisodesPerSeason"] = Math.round(episodeCount*10.0 / seasons.size)/10;
  return result;
}

function formatEpisode(episode) {
  // Matches a colon, followed by a space, followed by whatever comes after it as a group.
  const chapterMatcher = new RegExp(/: (.*)$/,"i");
  // Matches an HTML "<p>" tag at the beginning of a string, followed by whatever is after it as a group up to the first period, then any whitespace.
  const summaryMatcher = new RegExp(/^<p>(.*\.)\s/,"i");
  var sequenceNumber = `s${episode.season}e${episode.number}`;
  //RegExp.exec returns any groups in the match at index 1.
  var shortTitle = chapterMatcher.exec(episode.name)[1];
  var unixstamp = moment(episode.airstamp).unix();
  var summary = summaryMatcher.exec(episode.summary)[1];
  return {
    sequenceNumber: sequenceNumber,
    shortTitle: shortTitle,
    airTimestamp: unixstamp,
    shortSummary: summary
  };
}

async function getStranger() {
  let showData = await getJSON('https://api.tvmaze.com/singlesearch/shows?q=stranger-things&embed=episodes');
  return formatShow(showData);
}

module.exports = { getStranger, formatShow, formatEpisode };
