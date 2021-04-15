import React, { useEffect, useState } from "react";
import { ScatterChart } from "./Graphs/Scatter";
export default function SongSimilarity(props) {
  const [differences, setDifferences] = useState([]);

  //find similarities
  // Each song has a confidence score for cerain properties
  /*
    I am using 5 of these, finding the differences between them for any two songs,
    This gives me a final score of how similar the songs are
    0 = identical song, 5 = very different
    Similar songs should have lower scores because the score is essentially the total
    disagreement between them. I then make this slightly easier to understand by calculating
    a percentage. The max disagreement is 5, because if one song scored 0 for all confidences
    and the other scored 1, then the disagreement would be 5.
    Therefore, I calculate the percentage of 5 from the final score giving us a percentage of how similar the 
    songs are
    e.g. final score = 1
    1 / 5 = 0.2 * 100 = 20   --> 20 is the percentage difference
    100 - 20 = 80   --> the songs are 80% similar
*/
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
      //   console.log(feature);
      let difference = parseFloat(
        Math.abs(songAFeatures[feature] - songBFeatures[feature]).toFixed(5)
      );
      //   console.log(
      //     `${songAFeatures[feature]} - ${songBFeatures[feature]} = ${difference}`
      //   );
      overall += difference;
    });

    let similarity_percent =
      (overall / Object.keys(songAFeatures).length) * 100;
    // console.log(similarity_percent);
    similarity_percent = 100 - similarity_percent;

    console.log(
      `Overall difference is ${overall}. Meaning they are ${similarity_percent}% similar`
    );

    return overall;
  };

  useEffect(() => {
    console.log(props.fastest_songs);
    let all_differences = [];

    //for each song, make an object containing its id, name, artist name
    //and the differences compared to every other song

    props.fastest_songs.forEach((baseSong) => {
      let temp_differences = [];

      props.fastest_songs.forEach((compareSong) => {
        if (baseSong.id === compareSong.id) {
          //base case
          return;
        }

        let disagreement = compareTwoSongs(baseSong, compareSong);

        temp_differences.push({
          base_song_id: baseSong.id,
          compare_song_id: compareSong.id,
          compare_song_name: compareSong.name,
          compare_song_artist: compareSong.artists[0].name,
          difference: disagreement,
          compare_song_color: compareSong.color,
        });
        // console.log(temp_differences);
      });

      all_differences.push({
        id: baseSong.id,
        name: baseSong.name,
        artist_name: baseSong.artists[0].name,
        scores: temp_differences,
        color: baseSong.color,
      });
    });

    console.log(all_differences);
    setDifferences(all_differences);
  }, []);

  return (
    <div>
      <h1>How similar are your songs?</h1>
      <p>
        Below is a scatter chart of your songs showing how different they are.{" "}
      </p>
      {/* {differences.map((song) => ( */}
      <ScatterChart differences={differences} />
      {/* ))} */}
    </div>
  );
}
