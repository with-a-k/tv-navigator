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
  show._embedded.episodes.forEach(episode => {
    totalTime += episode.runtime * 60;
    seasons.add(episode.season);
    result.episodes[episode.id] = formatEpisode(episode);
  });
  var episodeCount = show._embedded.episodes.length;
  result["averageEpisodesPerSeason"] = Math.round(episodeCount*10.0 / seasons.size)/10;
  result["totalDurationSec"] = totalTime;
  return result;
}

function formatEpisode(episode) {
  // Matches a colon, followed by a space, followed by whatever comes after it as a group.
  const chapterMatcher = new RegExp(/: (.*)$/,"i");
  // Matches an HTML "<p>" tag at the beginning of a string, followed by whatever is after it as a group up to the first period, then any whitespace.
  const summaryMatcher = new RegExp(/^<p>(.*?\.)[\s<]/,"i");
  var sequenceNumber = `s${episode.season}e${episode.number}`;
  //RegExp.exec returns any groups in the match at index 1.
  var shortTitle = chapterMatcher.exec(episode.name)[1];
  var unixstamp = moment(episode.airstamp).unix();
  //Hellfire Club has no description.
  var summaryMatch = summaryMatcher.exec(episode.summary)
  var summary = (Array.isArray(summaryMatch)) ? summaryMatch[1] : "Unreleased Episode";
  return {
    sequenceNumber: sequenceNumber,
    shortTitle: shortTitle,
    airTimestamp: unixstamp,
    shortSummary: summary
  };
}

async function getStranger() {
  var showData = {};
  try {
    showData = await getJSON('https://api.tvmaze.com/singlesearch/shows?q=stranger-things&embed=episodes');
  } catch(err) {
    showData = {message: "An error occurred getting the data."}
  }
  var formatData = formatShow(showData);
  return formatData;
}

module.exports = { getStranger, formatShow, formatEpisode };
