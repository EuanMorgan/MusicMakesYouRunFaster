import React from "react";

import { Radar } from "react-chartjs-2";

export const RadarChart = (props) => {
  // show audio features
  //developer.spotify.com/documentation/web-api/reference/#object-audiofeaturesobject
  let datasets = props.songData.map((d, index) => ({
    label: d.title,
    data: d.data,
    backgroundColor: d.color + "50",

    borderColor: "black",
    hidden: index === 0 ? false : true,
  }));
  //console.log(datasets);
  const data = {
    labels: [
      "acousticness",
      "danceability",
      "energy",
      "valence",
      "speechiness",
    ],
    datasets: datasets,
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
      display: true,
    },
  };
  if (props.show) {
    return (
      <div className="chart-container">
        <Radar data={data} options={options} />
      </div>
    );
  }

  return <div></div>;
};
