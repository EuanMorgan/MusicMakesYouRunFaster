import React from "react";

import { Bar, defaults } from "react-chartjs-2";

export const Frequency = (props) => {
  // defaults.global.maintainAspectRatio = false;
  //   defaults.global.responsive = true;
  //console.log(props);
  const data = {
    labels: Object.keys(props.data),

    datasets: [
      {
        label: props.title,
        data: Object.values(props.data),
        backgroundColor: "rgba(255,99,132,0.2)",
        borderColor: "rgba(255,99,132,1)",
        borderWidth: 1,
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
  };

  return (
    <div className="chart-container bar">
      <Bar data={data} options={options} />
    </div>
  );

  return <div></div>;
};
