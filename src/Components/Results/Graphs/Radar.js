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
    backgroundColor: () => {
      let colour = d.color.toString();
      console.log(colour);
      if (colour.startsWith("#")) return d.color + "65"; //return transparent hex codes
      // console.log(colour);
      let new_col = colour.replace(/rgb/i, "rgba");
      // console.log(new_col);
      new_col = new_col.replace(/\)/i, ",0.65)");

      return new_col;
    },

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
    title: {
      text: "Audio Features",
      display: true,
    },
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
