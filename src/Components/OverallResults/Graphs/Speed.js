import React, { useState } from "react";

import { HorizontalBar, Bar, defaults } from "react-chartjs-2";
import { useWindowSize } from "../../../Hooks/useWindowSize";

import ScrollTrigger from "react-scroll-trigger";

export const Speed = (props) => {
  const [visible, setVisible] = useState(false);

  const size = useWindowSize();

  //console.log(props.data);

  let q1 = [];
  let q2 = [];
  let q3 = [];
  let q4 = [];
  let labels = [];
  let dates = [];
  props.data.forEach((song) => {
    q1.push(song.data[0]);
    q2.push(song.data[1]);
    q3.push(song.data[2]);
    q4.push(song.data[3]);
    labels.push(song.title);
    //console.log(song);
    dates.push(song.date.split(" ")[0]);
  });

  const data = {
    // labels: Object.keys(props.data),
    labels: labels,
    datasets: [
      {
        label: "Q1",
        data: q1,
        backgroundColor: "rgba(255,99,132,0.8)",
        borderColor: "white",
        borderWidth: 1,
        labels: labels,
        hidden: false,
      },
      {
        label: "Q2",
        data: q2,
        backgroundColor: "rgba(99,255,132,0.8)",
        borderColor: "black",
        borderWidth: 1,
        labels: labels,
        hidden: true,
      },
      {
        label: "Q3",
        data: q3,
        backgroundColor: "rgba(132,99,255,0.8)",
        borderColor: "white",
        borderWidth: 1,
        labels: labels,
        hidden: true,
      },
      {
        label: "Q4",
        data: q4,
        backgroundColor: "rgba(200,150,99,0.8)",
        borderColor: "black",
        borderWidth: 1,
        labels: labels,
        hidden: true,
      },
    ],
  };
  const options = {
    maintainAspectRatio: false,
    tooltips: {
      enabled: true,
    },
    animation: {
      duration: 2500,
    },
    legend: {
      display: true,
    },
    title: {
      text: "Average speed per song quarter",
      display: true,
      fontSize: 15,
    },
    scales: {
      xAxes: [
        {
          // dynamically change bar length based on number of plotted tracks
          barThickness: q1.length < 10 ? 15 : 8,
        },
      ],
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
          scaleLabel: {
            display: true,
            labelString: "Speed (m/s)",
            fontColor: "grey",
          },
        },
      ],
    },
    tooltips: {
      callbacks: {
        label: function (tooltipItem, data) {
          let dataset = data.datasets[tooltipItem.datasetIndex];
          let index = tooltipItem.index;
          return (
            dataset.label + "  |  " + dataset.data[index].toFixed(2) + "m/s"
          ); //+ ": " + dataset.data[index];
        },
        title: function (tooltipItem, data) {
          //   //console.log(tooltipItem);
          return tooltipItem[0].label;
        },
        beforeLabel: function (tooltipItem, data) {
          return dates[tooltipItem.index];
        },
      },
    },
  };
  if (size.width < 1250) {
    return (
      <ScrollTrigger
        onEnter={() => {
          setVisible(true);
          // setAnimationDuration(2000);
        }}
      >
        <div className="chart-container bar-horizontal">
          {visible ? <HorizontalBar data={data} options={options} /> : null}
        </div>
      </ScrollTrigger>
    );
  }
  return (
    <ScrollTrigger
      onEnter={() => {
        // setAnimationDuration(2000);

        setVisible(true);
      }}
    >
      <div className="chart-container bar">
        {visible ? <Bar data={data} options={options} /> : null}
      </div>
    </ScrollTrigger>
  );
};
