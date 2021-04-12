import React from "react";

import { Bar, defaults } from "react-chartjs-2";

export const BarChart = (props) => {
  // defaults.global.maintainAspectRatio = false;
  //   defaults.global.responsive = true;
  console.log(props);
  const data = {
    labels: props.labels,

    datasets: [
      {
        label: props.title,
        data: Object.values(props.genreCount),
        backgroundColor: "rgba(255,99,132,0.2)",
        borderColor: "rgba(255,99,132,1)",
        borderWidth: 1,
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
  };
  if (props.show) {
    return (
      <div className="chart-container">
        <Bar data={data} options={options} />
      </div>
    );
  }

  return <div></div>;
};
