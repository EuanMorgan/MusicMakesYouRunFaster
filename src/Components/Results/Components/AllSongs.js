import React, { useEffect, useState } from "react";
import { msToHMS } from "../../../Common/CommonFunctions";
import { BarChart } from "../Graphs/Bar";
import Icon from "@mdi/react";
import { mdiChevronDown, mdiChevronUp } from "@mdi/js";
import { Collapser } from "../../ReusableComponents/Collapser";
const AllSongs = (props) => {
  const [uniqueGenres, setUniqueGenres] = useState([]);
  const [genreCount, setGenreCount] = useState([]);
  const [uniqueArtists, setUniqueArtists] = useState([]);
  const [showChart, setShowChart] = useState(false);
  const [artistCount, setArtistCount] = useState([]);
  const [allSongsList, setAllSongsList] = useState();
  const [isShowingSongs, setIsShowingSongs] = useState(false);
  console.log(props.songs);
  useEffect(() => {
    let genres = [];
    let artists = [];
    let allSongs = [];
    props.songs.forEach((song) => {
      genres.push(...song.artist_data.genres);
      artists.push(song.artist_data.name);
      allSongs.push({ artist: song.artist_data.name, name: song.name });
    });
    setUniqueGenres([...new Set(genres)]);
    setUniqueArtists([...new Set(artists)]);
    setAllSongsList(allSongs);
    let genreCount = {};
    genres.sort().forEach((genre) => {
      if (genreCount[genre]) {
        genreCount[genre]++;
      } else {
        genreCount[genre] = 1;
      }
    });
    setGenreCount(genreCount);

    let artistCount = {};
    artists.sort().forEach((artist) => {
      if (artistCount[artist]) artistCount[artist]++;
      else artistCount[artist] = 1;
    });
    setArtistCount(artistCount);
  }, []);

  return (
    <div>
      <h1>All Songs</h1>
      <div className="data-list-top-container all-songs">
        <div className="data-list-top">
          <p
            style={{ cursor: "pointer" }}
            onClick={() => setIsShowingSongs(!isShowingSongs)}
          >
            <span className="data-list-title">You listened to:</span>{" "}
            {props.songs.length} songs
            <Collapser>
              <div>
                {allSongsList &&
                  allSongsList.map((song) => (
                    <p style={{ fontSize: "0.9em" }}>
                      {song.artist}
                      {"  -  "}
                      {song.name}
                    </p>
                  ))}
              </div>
            </Collapser>
          </p>

          <p>
            <span className="data-list-title">You listened to:</span>{" "}
            {uniqueArtists.length} artists
          </p>
          <p className="end">
            <span className="data-list-title">Artists span:</span>{" "}
            {uniqueGenres.length} genres
          </p>
        </div>
      </div>
      <button
        onClick={() => {
          setShowChart(!showChart);
        }}
        style={{ marginTop: "1vh" }}
      >
        {showChart ? "Hide bar charts" : "Show bar charts"}
      </button>
      {showChart ? (
        <div className="chart-container">
          <BarChart
            show={showChart}
            labels={uniqueGenres.sort()}
            genreCount={genreCount}
            title={"Genres"}
          />
          <BarChart
            show={showChart}
            labels={uniqueArtists.sort()}
            genreCount={artistCount}
            title={"Artists"}
          />
        </div>
      ) : null}

      {/* {showChart ? (
        <div className="chart-container">
          <BarChart
            show={showChart}
            labels={uniqueGenres.sort()}
            genreCount={genreCount}
          />
        </div>
      ) : null} */}
    </div>
  );
};

export default AllSongs;
