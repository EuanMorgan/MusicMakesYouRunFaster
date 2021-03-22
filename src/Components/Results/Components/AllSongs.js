import React, { useEffect, useState } from "react";
import { msToHMS } from "../../../Common/CommonFunctions";
import { BarChart } from "../Graphs/Bar";
const AllSongs = (props) => {
  const [uniqueGenres, setUniqueGenres] = useState([]);
  const [genreCount, setGenreCount] = useState([]);
  console.log(props.run.songs);
  useEffect(() => {
    let genres = [];
    props.run.songs.forEach((song) => genres.push(...song.artist_data.genres));
    setUniqueGenres([...new Set(genres)]);
    let genreCount = {};
    genres.sort().forEach((genre) => {
      if (genreCount[genre]) {
        genreCount[genre]++;
      } else {
        genreCount[genre] = 1;
      }
    });
    setGenreCount(genreCount);
  }, []);

  return (
    <div>
      <h1>All Songs</h1>
      <div className="data-list-top-container">
        <div className="data-list-top">
          <p>
            <span className="data-list-title">You listened to:</span>{" "}
            {props.run.songs.length} songs
          </p>
          <p className="end">
            <span className="data-list-title">Artists span:</span>{" "}
            {uniqueGenres.length} genres
          </p>
        </div>
      </div>

      <div className="chart-container">
        {" "}
        <BarChart
          show={true}
          labels={uniqueGenres.sort()}
          genreCount={genreCount}
        />
      </div>
    </div>
  );
};

export default AllSongs;
