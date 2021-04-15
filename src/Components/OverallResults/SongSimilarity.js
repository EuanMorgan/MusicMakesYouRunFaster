import React from "react";
import { Feature } from "react-mapbox-gl";

export default function SongSimilarity(props) {
  //find similarities

  const extractFeatures = (song) => {
    let temp = song.audio_features[0];
    let audioFeatures = {
      acousticness: temp.acousticness,
      danceability: temp.danceability,
      energy: temp.energy,
      valence: temp.valence,
      speechiness: temp.speechiness,
    };

    return audioFeatures;
  };

  const compareTwoSongs = (songA, songB) => {
    console.log(`Similarity of ${songA.name} ||and|| ${songB.name}`);
    let overall = 0;

    const songAFeatures = extractFeatures(songA);
    const songBFeatures = extractFeatures(songB);

    Object.keys(songAFeatures).forEach((feature) => {
      console.log(feature);
      let difference = parseFloat(
        Math.abs(songAFeatures[feature] - songBFeatures[feature]).toFixed(5)
      );
      console.log(
        `${songAFeatures[feature]} - ${songBFeatures[feature]} = ${difference}`
      );
      overall += difference;
    });

    let similarity_percent =
      (overall / Object.keys(songAFeatures).length) * 100;
    console.log(similarity_percent);
    similarity_percent = 100 - similarity_percent;

    console.log(
      `Overall difference is ${overall}. Meaning they are ${similarity_percent}% similar`
    );
  };

  return (
    <div>
      <h1>How similar are your songs?</h1>
    </div>
  );
}
