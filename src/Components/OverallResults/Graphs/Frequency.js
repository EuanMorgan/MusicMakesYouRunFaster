import React from "react";

import { Bar, defaults } from "react-chartjs-2";

export const Frequency = (props) => {
  // defaults.global.maintainAspectRatio = false;
  //   defaults.global.responsive = true;
  //console.log(props);

  let labelArray = [];
  let dataArray = [];
  if (props.fastest != null) {
    labelArray = [...labelArray, ...Object.keys(props.fastest)];
    dataArray = [...dataArray, ...Object.values(props.fastest)];
  }
  if (props.nonFastest != null) {
    labelArray = [...labelArray, ...Object.keys(props.nonFastest)];
    dataArray = [...dataArray, ...Object.values(props.nonFastest)];
  }
  console.log(props.fastest, props.nonFastest);
  console.log(labelArray);
  const data = {
    // labels: Object.keys(props.data),
    labels: labelArray,
    datasets: [
      {
        label: "Running Fastest",
        data: Object.values(props.fastest),
        backgroundColor: "rgba(255,99,132,0.2)",
        borderColor: "rgba(255,99,132,1)",
        borderWidth: 1,
        labels: Object.keys(props.fastest),
      },
      {
        label: "Not running fastest",
        data: [
          ...Object.keys(props.fastest).map((i) => null),
          ...Object.values(props.nonFastest),
        ],
        backgroundColor: "rgba(89,255,255,0.2)",
        borderColor: "rgba(5,55,132,1)",
        borderWidth: 1,
        labels: Object.keys(props.nonFastest),
      },
    ],
  };
  console.log(data);
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
      text: "Song frequency",
      display: true,
      fontSize: 15,
    },
    scales: {
      xAxes: [
        {
          maxBarThickness: 20,
          barThickness: 10,
        },
      ],
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
    tooltips: {
      callbacks: {
        label: function (tooltipItem, data) {
          var dataset = data.datasets[tooltipItem.datasetIndex];
          var index = tooltipItem.index;

          return labelArray[index] + "  |  " + dataset.data[index]; //+ ": " + dataset.data[index];
        },
        title: function (tooltipItem, data) {
          var dataset = data.datasets[tooltipItem[0].datasetIndex];

          return dataset.label;
        },
      },
    },
  };

  return (
    <div className="chart-container bar">
      <Bar data={data} options={options} />
    </div>
  );
};
