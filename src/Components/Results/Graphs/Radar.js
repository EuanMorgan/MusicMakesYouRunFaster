import React from "react";

import { Radar } from "react-chartjs-2";

export const RadarChart = (props) => {
  const lbls = [
    "acousticness",
    "danceability",
    "energy",
    "valence",
    "speechiness",
  ];
  // show audio features
  //developer.spotify.com/documentation/web-api/reference/#object-audiofeaturesobject
  let datasets = props.songData.map((d, index) => ({
    label: d.title,
    data: d.data,
    backgroundColor: d.color + "50",

    borderColor: "black",
    hidden: index === 0 ? false : true,
  }));
  ////console.log(datasets);
  const data = {
    labels: lbls,
    datasets: datasets,
  };

  const options = {
    maintainAspectRatio: false,

    tooltips: {
      enabled: true,
      callbacks: {
        // Format label i.e. accousitcness 0.9w325238235 instead of just the number
        label: function (tooltipItems, data) {
          return (
            data.datasets[tooltipItems.datasetIndex].data[tooltipItems.index] +
            " " +
            lbls[tooltipItems.index]
          );
        },

        title: function (tooltipItems, data) {
          return data.datasets[tooltipItems[0].datasetIndex].label;
        },
      },
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
        fontSize: 12,
      },
    },
    legend: {
      display: true,
    },
  };
  if (props.show) {
    return (
      <div className="chart-container radar">
        <Radar data={data} options={options} />
      </div>
    );
  }

  return <div></div>;
};
