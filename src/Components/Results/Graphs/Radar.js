import React from "react";

import { Radar } from "react-chartjs-2";

export const RadarChart = (props) => {
  // show audio features
  //developer.spotify.com/documentation/web-api/reference/#object-audiofeaturesobject
  https: console.log(props);
  const data = {
    labels: [
      "acousticness",
      "danceability",
      "energy",
      "valence",
      "speechiness",
    ],
    datasets: [
      {
        data: props.songData,
        backgroundColor: "rgba(75,192,192,0.5)",
        borderColor: "black",
      },
    ],
  };

  const options = {
    tooltips: {
      enabled: true,
    },
    animation: {
      duration: 1500,
    },

    scale: {
      gridLines: {
        color: "rgba(200,200,200,0.18)",
      },
      ticks: {
        beginAtZero: true,
        max: 1,
        textColor: "white",
        showLabelBackdrop: false,
        fontColor: "grey",
      },
      pointLabels: {
        fontSize: 18,
      },
    },
    legend: {
      display: false,
    },
  };
  if (props.show) {
    return (
      <div className="App">
        <Radar data={data} options={options} />
      </div>
    );
  }

  return <div></div>;
};
