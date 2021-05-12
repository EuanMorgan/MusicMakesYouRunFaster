import React, { useState } from "react";
import { Bar, defaults } from "react-chartjs-2";
import ScrollTrigger from "react-scroll-trigger";
export const Frequency = (props) => {
  // defaults.global.maintainAspectRatio = false;
  //   defaults.global.responsive = true;
  ////console.log(props);
  const [visible, setVisible] = useState(false);
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
  //console.log(props.fastest, props.nonFastest);
  //console.log(labelArray);
  const data = {
    // labels: Object.keys(props.data),
    labels: labelArray,
    datasets: [
      {
        label: "Running Fastest",
        data: Object.values(props.fastest),
        backgroundColor: "rgba(255,99,132,.8)",
        borderColor: "rgba(255,99,132,1)",
        borderWidth: 1,
        labels: Object.keys(props.fastest),
        hidden: Object.keys(props.fastest).length < 1,
      },
      {
        label: "Not running fastest",
        data: [
          ...Object.keys(props.fastest).map((i) => null),
          ...Object.values(props.nonFastest),
        ],
        backgroundColor: "rgba(89,255,255,0.8)",
        borderColor: "rgba(116, 163, 232,1)",
        borderWidth: 1,
        labels: Object.keys(props.nonFastest),
        hidden: Object.keys(props.nonFastest).length < 1,
      },
    ],
  };
  //console.log(data);
  const options = {
    maintainAspectRatio: false,
    tooltips: {
      enabled: true,
    },
    animation: {
      duration: 2000,
    },
    legend: {
      display: true,
    },
    title: {
      text: "Song frequency",
      display: true,
      fontSize: 15,
    },
    scales: {
      xAxes: [
        {
          maxBarThickness: 60,
          // barThickness: 60,
        },
      ],
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
            stepSize: 1,
          },
          scaleLabel: {
            display: true,
            labelString: "Frequency",
          },
        },
      ],
    },
    tooltips: {
      callbacks: {
        label: function (tooltipItem, data) {
          var dataset = data.datasets[tooltipItem.datasetIndex];
          var index = tooltipItem.index;

          return labelArray[index] + "  |  Occurences: " + dataset.data[index]; //+ ": " + dataset.data[index];
        },
        title: function (tooltipItem, data) {
          var dataset = data.datasets[tooltipItem[0].datasetIndex];

          return dataset.label;
        },
      },
    },
  };

  return (
    <ScrollTrigger
      onEnter={() => {
        setVisible(true);
      }}
    >
      <div className="chart-container bar">
        {visible ? <Bar data={data} options={options} show={visible} /> : null}
      </div>
    </ScrollTrigger>
  );
};
