import React from "react";

import { Line } from "react-chartjs-2";

export const LineGraph = (props) => {
  console.log(props);
  const data = {
    labels:
      props.labels == undefined
        ? ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
        : props.labels,
    datasets:
      props.listeningData == undefined || props.listeningData == undefined
        ? [
            {
              label: "First dataset",
              data: [33, 53, 85, 41, 44, 65],
              fill: true,
              backgroundColor: "rgba(75,192,192,0.2)",
              borderColor: "rgba(75,192,192,1)",
            },
            {
              label: "Second dataset",
              data: [33, 25, 35, 51, 54, 76],
              fill: false,
              borderColor: "#742774",
            },
          ]
        : [
            {
              label: "Speed (listening)",
              data: props.listeningData,
              fill: true,
              borderColor: "#742774",
              backgroundColor: "rgba(75,192,192,0.2)",
            },
            {
              label: "Speed (not listening)",
              data: props.notListeningData,
              fill: true,
              backgroundColor: "rgba(75,192,192,0.2)",
              borderColor: "rgba(75,192,192,1)",
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
    scales: {
      yAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: "Speed (metre per second)",
            fontColor: "grey",
          },
        },
      ],
      xAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: "Elapsed (HH:MM:SS)",
            fontColor: "grey",
          },
        },
      ],
    },
  };
  if (props.show) {
    return (
      <div className="App">
        <Line data={data} options={options} />
      </div>
    );
  }

  return <div></div>;
};
