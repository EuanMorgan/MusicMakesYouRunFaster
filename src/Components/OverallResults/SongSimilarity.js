import React, { useEffect, useState } from "react";
import { ScatterChart } from "./Graphs/Scatter";
import styled from "styled-components";
import { Collapser } from "../ReusableComponents/Collapser";
import { Radar } from "react-chartjs-2";
import { RadarChart } from "../Results/Graphs/Radar";
import { average } from "../../Common/CommonFunctions";
import {
  Paragraph,
  ParagraphContainer,
  ParagraphLarger,
} from "../../Constants/Styled";
export default function SongSimilarity(props) {
  const [differences, setDifferences] = useState([]);
  const [radarData, setRadarData] = useState([]);
  const [avgFastestDiff, setAvgFastestDiff] = useState();
  const [avgNonFastestDiff, setAvgNonFastestDiff] = useState();
  const [avgScoresFastest, setAverageScoresFastest] = useState({});
  const [avgScoresNotFastest, setAverageScoresNotFastest] = useState({});

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

  const findAverageFeatures = (songs) => {
    //Used to temporarily store the scores for the final radar chart
    let fastest_all_scores = {
      acousticness: 0,
      danceability: 0,
      energy: 0,
      valence: 0,
      speechiness: 0,
    };
    // Sum all scores of fastest songs audio features and get average.
    songs.forEach((song) => {
      Object.keys(song.audio_features[0]).forEach((feature) => {
        if (fastest_all_scores[feature] === undefined) {
          return;
        }

        fastest_all_scores[feature] += song.audio_features[0][feature];
      });
    });

    Object.keys(fastest_all_scores).forEach((feature) => {
      fastest_all_scores[feature] = fastest_all_scores[feature] / songs.length;
    });

    console.log(fastest_all_scores);

    return [
      fastest_all_scores.acousticness,
      fastest_all_scores.danceability,
      fastest_all_scores.energy,
      fastest_all_scores.valence,
      fastest_all_scores.speechiness,
    ];
  };

  const compareTwoSongs = (songA, songB) => {
    // console.log(`Similarity of ${songA.name} ||and|| ${songB.name}`);
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

    // console.log(
    //   `Overall difference is ${overall}. Meaning they are ${similarity_percent}% similar`
    // );

    return [overall, similarity_percent];
  };

  useEffect(() => {
    // console.log(props.fastest_songs);
    let all_differences = [];

    //for each song, make an object containing its id, name, artist name
    //and the differences compared to every other song
    let fastest_percentages = [];
    let non_fastest_percentages = [];

    let temp_differences = [];
    props.fastest_songs.forEach((baseSong) => {
      props.fastest_songs.forEach((compareSong) => {
        if (baseSong.id === compareSong.id) {
          //base case
          return;
        }

        let [disagreement, percentageSimilar] = compareTwoSongs(
          baseSong,
          compareSong
        );

        fastest_percentages.push(percentageSimilar);

        temp_differences.push({
          base_song_id: baseSong.id,
          compare_song_id: compareSong.id,
          compare_song_name: compareSong.name,
          compare_song_artist: compareSong.artists[0].name,
          difference: disagreement,
          compare_song_color: compareSong.color,
          percentage_similar: percentageSimilar,
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

    // console.log(all_differences);

    props.non_fastest_songs.forEach((baseSong) => {
      props.non_fastest_songs.forEach((compareSong) => {
        if (baseSong.id === compareSong.id) {
          return;
        }

        let [disagreement, percentageSimilar] = compareTwoSongs(
          baseSong,
          compareSong
        );

        non_fastest_percentages.push(percentageSimilar);
      });
      // console.log(non_fastest_percentages);
    });

    let averageFastestSimilarity = average(fastest_percentages);
    setAvgFastestDiff(averageFastestSimilarity);
    let averageNonFastestSimilarity = average(non_fastest_percentages);
    setAvgNonFastestDiff(averageNonFastestSimilarity);

    setDifferences(all_differences);

    let tempRadarData = [];

    props.fastest_songs.forEach((song) => {
      //Format audio features data for radar chart.
      //Done in separate forEach for readability

      tempRadarData.push({
        title: song.name,
        color: song.color,
        data: [
          song.audio_features[0].acousticness,
          song.audio_features[0].danceability,
          song.audio_features[0].energy,
          song.audio_features[0].valence,
          song.audio_features[0].speechiness,
        ],
      });
    });
    // console.log(tempRadarData);
    setRadarData(tempRadarData);
  }, []);

  const PageContainer = styled.div`
    max-width: 80vw;
    margin: auto;

    @media (max-width: 858px) {
      max-width: 95vw;
    }
  `;

  return (
    <PageContainer>
      <h1>Fastest Songs</h1>
      <div className="data-list-top-container">
        <div className="data-list-top" style={{ borderBottom: 0 }}>
          <p className="end">
            Out of these songs,{" "}
            <span className="red-text">{props.fastest_songs.length}</span>{" "}
            appeared as you were running pretty quick
            <Collapser>
              {props.fastest_songs.map((song) => (
                <p style={{ fontSize: "0.9em" }}>
                  {song.artists[0].name} -{" "}
                  <span className="red-text">{song.name}</span>
                </p>
              ))}
            </Collapser>
          </p>
        </div>
      </div>

      <h1>How similar are your songs?</h1>
      <ParagraphContainer>
        <Paragraph>
          Below is a scatter chart of your songs showing how different they are.
          Each column is an individual song which is shown at the bottom, and
          all other points in the column are how similar it is to each other
          song. The further away any point in the column is from the bottom
          point, the more different the song is.
        </Paragraph>
      </ParagraphContainer>

      <ScatterChart differences={differences} />

      <h1>How do we know this?</h1>
      <Collapser>
        <ParagraphContainer>
          <Paragraph>
            Spotify gives each song confidence scores which say how likely it is
            that a particular song has a certain property. For example: a Bob
            Dylan song might have 0.8 for acousticness, meaning there is a high
            probability the song is acoustic. Whereas a song by System of the
            Down may have 0.01 for acousticness meaning it is very unlikely the
            song sounds acoustic.{" "}
            <span className="red-text">
              You can therefore think of these scores as a fingerprint of the
              song.
            </span>
          </Paragraph>
          <Paragraph>
            We can use the scores to find how similar any two songs are. We find
            the difference of every score for the two songs and sum them at the
            end. This gives us one final value, 0 being identical songs and 5
            being extremely different. See for yourself below, the closer the
            songs are in the scatter chart the more similar their radar charts
            will look
          </Paragraph>
        </ParagraphContainer>
      </Collapser>
      <RadarChart songData={radarData} show={true} />
      <ParagraphContainer>
        <ParagraphLarger>
          Songs that made you run faster are{" "}
          <span className="red-text">
            {avgFastestDiff && avgFastestDiff.toFixed(2)}%
          </span>{" "}
          similar on average.
        </ParagraphLarger>
        <ParagraphLarger>
          All other songs are{" "}
          <span className="red-text">
            {avgNonFastestDiff && avgNonFastestDiff.toFixed(2)}%
          </span>{" "}
          similar on average
        </ParagraphLarger>
      </ParagraphContainer>
      <RadarChart
        songData={[
          {
            title: "Fastest",
            color: "#FF0000",
            data: findAverageFeatures(props.fastest_songs),
          },
          {
            title: "Not fastest",
            color: "#0000FF",
            data: findAverageFeatures(props.non_fastest_songs),
          },
        ]}
        show={true}
      />
    </PageContainer>
  );
}
