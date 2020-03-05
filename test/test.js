const assert = require('assert');

const { getStranger, formatShow, formatEpisode } = require('../index.js');

/*
correct format:

<showId>: {
  totalDurationSec: (sum of all episode lengths, in seconds)
  averageEpisodesPerSeason: (rounded to tenths)
  episodes: {
    <episodeId>: {
      sequenceNumber: s<X>e<Y>
      shortTitle: (omit Chapter XXX prefix)
      airTimestamp: in epoch time
      shortSummary: first sentence of ep summary, no HTML
    },
  }
}
*/

describe('Format show', () => {
  it('should return JSON with a certain structure', () => {
    const source = {
      id: 2993,
      _embedded: {
        episodes: {

        }
      }
    }
    const expected = {
      showId: 2993,
      totalDurationSec: 0,
      averageEpisodesPerSeason: NaN,
      episodes: {

      }
    }
    assert.deepStrictEqual(Object.getOwnPropertyNames(formatShow(source)), Object.getOwnPropertyNames(expected));
  });
});

describe('Format episode', () => {
  it('should return JSON with a certain structure', () => {
    const source = {
      id: 553946,
      url: "tvmaze/episodes/strangerthings1x01",
      name: "Chapter One: The Vanishing of Will Byers",
      season: 1,
      number: 1,
      airdate: "2016-07-15",
      airtime: "",
      airstamp: "2016-07-15T12:00:00+00:00",
      runtime: 60,
      summary: "<p>A young boy mysteriously disappears, and his panicked mother demands that the police find him. Meanwhile, the boy's friends conduct their own search, and meet a mysterious girl in the forest.</p>"
    };
    const expected = {
      sequenceNumber: "s1e1",
      shortTitle: "The Vanishing of Will Byers",
      airTimestamp: 1468584000,
      shortSummary: "A young boy mysteriously disappears, and his panicked mother demands that the police find him."
    };
    assert.deepStrictEqual(formatEpisode(source), expected);
  });
});

describe('getStranger', () => {
  it('should return the correct values', () => {
    const strangerThings = getStranger();
    //This is an estimate based on 26 episodes of 60 minutes each.
    assert.equal(strangerThings.totalDurationSec, 93600);
    //This is lower than the expected 8.something because the API results include the currently-unreleased S4E1.
    assert.equal(strangerThings.averageEpisodesPerSeason, 6.5);
  });
});

console.log('Test is running.');
