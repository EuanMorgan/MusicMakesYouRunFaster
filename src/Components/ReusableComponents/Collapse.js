import React, { useState, useCallback } from "react";
import { Collapse } from "react-collapse";
import Icon from "@mdi/react";
import { mdiChevronDown, mdiChevronUp } from "@mdi/js";
import { LineGraph } from "../Results/Graphs/Line";
import { RadarChart } from "../Results/Graphs/Radar";
import { useHistory } from "react-router-dom";
import { keys, mode } from "../../Common/Data";
import "./collapse.css";
import ReactMapboxGl, { Layer, Feature } from "react-mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl/dist/mapbox-gl";
// mapboxgl.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;
const M = ReactMapboxGl({
  //TODO: Hide api keys
  accessToken: process.env.REACT_APP_MAPBOX_KEY,
});
export function CollapseMenu(props) {
  const history = useHistory();
  const accessibilityIds = {
    checkbox: "accessible-marker-example1",
    button: "accessible-marker-example2",
  };

  const [isButtonCollapseOpen, setIsButtonCollapseOpen] = useState(false);

  const onClick = useCallback(
    () => setIsButtonCollapseOpen(!isButtonCollapseOpen),
    [isButtonCollapseOpen]
  );
  let x;

  let radarData = [];
  if (props.audioFeatures) {
    console.log(props.audioFeatures);
    x = props.audioFeatures.filter((song) => song.id === props.id)[0];
    console.log(x);
    radarData = [
      {
        title: [x.name],
        color: x.color,
        data: [
          x.acousticness,
          x.danceability,
          x.energy,
          x.valence,
          x.speechiness,
        ],
      },
    ];

    props.audioFeatures.forEach((song) => {
      if (song.id === props.id) return;
      radarData.push({
        title: [song.name],
        color: song.color,
        data: [
          song.acousticness,
          song.danceability,
          song.energy,
          song.valence,
          song.speechiness,
        ],
      });
    });

    console.log(radarData);
  }

  console.log(props.listeningMap);

  return (
    <div className="accessible" style={{ color: "white" }}>
      <div className="collapseMenu">
        <div className="config">
          <p
            aria-controls={accessibilityIds.button}
            aria-expanded={isButtonCollapseOpen}
            onClick={onClick}
            type="button"
            style={{ cursor: "pointer" }}
          >
            {props.name}{" "}
            <Icon
              path={isButtonCollapseOpen ? mdiChevronUp : mdiChevronDown}
              size={1.5}
            />
          </p>
        </div>
        <Collapse isOpened={isButtonCollapseOpen} className="collapseMenu">
          <ul className="songs-ul">
            {console.log(props.data)}

            {props.data.speed_sentences.map((d) => (
              <li>{d}</li>
            ))}

            <LineGraph
              listeningData={props.listeningData}
              labels={props.labels}
              notListeningData={props.notListeningData}
              show={isButtonCollapseOpen}
              isHeartrate={false}
            />
            {props.data.heart_sentences.map((d) => (
              <li>{d}</li>
            ))}
            <LineGraph
              listeningData={props.heartrateData}
              labels={props.labels}
              notListeningData={props.notListeningHeartrates}
              show={isButtonCollapseOpen}
              isHeartrate={true}
            />
            <p>Map whilst listening to song</p>
            <M
              style="mapbox://styles/mapbox/streets-v9"
              containerStyle={{
                height: "25rem",
                textAlign: "center",
                maxWidth: "50rem",
                display: "flex",
                margin: "auto",
              }}
              center={[
                props.listeningMap[
                  Math.ceil(props.listeningMap.length / 1.4)
                ][0],
                props.listeningMap[
                  Math.ceil(props.listeningMap.length / 1.4)
                ][1],
              ]}
              zoom={[18]}
            >
              <Layer
                circle="circle"
                type="circle"
                paint={{
                  "circle-color": "#ff5200",
                  "circle-stroke-width": 1,
                  "circle-stroke-color": "#fff",
                  "circle-stroke-opacity": 1,
                }}
              >
                {props.listeningMap.map((p) => (
                  <Feature
                    key={p.seq}
                    coordinates={[p[0], p[1]]}
                    style={{ cursor: "default" }}
                  />
                ))}
              </Layer>
            </M>

            <p>Advanced song analysis</p>

            <div className="data-list">
              <p>Duration: {(x.duration_ms / 1000).toFixed(0)} seconds</p>
              <p>Tempo: {x.tempo}</p>
              <p>Time signature: {x.time_signature} beats per bar</p>
              <p>Loudness: {x.loudness} DB</p>
              <p>
                Key: {keys[x.key]} {mode[x.mode]}
              </p>
            </div>
            <p className="subtitle">Audio features</p>
            <RadarChart
              songName={props.name}
              songData={x ? radarData : null}
              show={isButtonCollapseOpen}
            />
            <button
              style={{
                fontSize: "0.7rem",
                padding: "0.1rem",
                marginBottom: "0.2rem",
              }}
              onClick={() => history.push("/more-info")}
            >
              Find out more about audio features
            </button>
          </ul>
        </Collapse>
      </div>
    </div>
  );
}
