const moment = require('moment');
const bent = require('bent');
const getJSON = bent('json');
const getBuffer = bent('buffer');

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
  console.log(show.episodes);
  for (episode in show.episodes) {
    totalTime += episode.runtime * 60;
    seasons.add(episode.season);
    result.episodes[episode.id] = formatEpisode(episode);
  };
  var episodeCount = Object.getOwnPropertyNames(seasonCounts).length;
  result[averageEpisodesPerSeason] = episodeCount / seasons.size();
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

function getStranger() {
  let showData = await getJSON('https://api.tvmaze.com/singlesearch/shows?q=stranger-things&embed=episodes');
  return formatShow(showData);
}

module.exports = { getStranger, formatShow, formatEpisode };
