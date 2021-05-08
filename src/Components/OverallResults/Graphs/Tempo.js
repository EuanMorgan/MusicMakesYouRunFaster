import React from "react";

import { HorizontalBar, Bar, defaults } from "react-chartjs-2";
import { useWindowSize } from "../../../Hooks/useWindowSize";
export const Tempo = (props) => {
  const size = useWindowSize();

  let tempos = [];
  let labels = [];

  console.log(props.data);
  props.data.forEach((song) => {
    tempos.push(song.audio_features[0].tempo.toFixed(0));
    labels.push(song.name);
  });

  console.log(tempos, labels);

  const data = {
    // labels: Object.keys(props.data),
    labels: labels,
    datasets: [
      {
        label: "Songs",
        data: tempos,
        backgroundColor: "rgba(255,99,132,0.2)",
        borderColor: "rgba(255,99,132,1)",
        borderWidth: 1,
        labels: labels,
        hidden: false,
      },
    ],
  };
  const options = {
    maintainAspectRatio: false,
    tooltips: {
      enabled: true,
    },
    animation: {
      duration: 1500,
    },
    legend: {
      display: false,
    },
    title: {
      text: "Song Tempos",
      display: true,
      fontSize: 15,
    },
    scales: {
      xAxes: [
        {
          //   ticks: {
          //     beginAtZero: true,
          //   },
          barThickness: 8,
          padding: 10,
        },
      ],
    },
    tooltips: {
      callbacks: {
        label: function (tooltipItem, data) {
          let dataset = data.datasets[tooltipItem.datasetIndex];
          let index = tooltipItem.index;

          console.log(tooltipItem);
          console.log(data);
          return "Tempo: " + tooltipItem.value + " BPM"; //+ ": " + dataset.data[index];
        },
        //     title: function (tooltipItem, data) {
        //       //   //console.log(tooltipItem);
        //       return tooltipItem[0].label;
        //     },
      },
    },
  };
  if (size.width < 1250) {
    return (
      <div className="chart-container bar-horizontal">
        <HorizontalBar data={data} options={options} />
      </div>
    );
  }
  return (
    <div className="chart-container bar">
      <Bar data={data} options={options} />
    </div>
  );
};
