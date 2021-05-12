import React, { useState } from "react";
import ScrollTrigger from "react-scroll-trigger";
import { Polar } from "react-chartjs-2";
import { useWindowSize } from "../../../Hooks/useWindowSize";
export const PolarArea = (props) => {
  const size = useWindowSize();
  const [visible, setVisible] = useState(false);
  let decibels = [];
  let labels = [];
  let colors = [];
  console.log(props.data);

  props.data.forEach((song) => {
    decibels.push(parseInt(song.audio_features[0].loudness.toFixed(0)));
    colors.push(song.color);
    labels.push(song.name);
  });

  //Chart js for some reason doesn't show the lowest value in the polar chart?
  //Crude hack to fix, simply add to the data a value lower than the lowest value
  let lowest = Math.min(...decibels) - 5;

  console.log(decibels, labels, colors);

  const data = {
    // labels: Object.keys(props.data),
    labels: labels,
    datasets: [
      {
        label: "Songs",
        // backgroundColor: "rgba(255,99,132,0.2)",
        // borderColor: "rgba(255,99,132,1)",
        data: decibels,
        borderWidth: 1,
        labels: labels,
        hidden: false,
        backgroundColor: colors,
      },
    ],
  };
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
      text: "Song decibels",
      display: true,
      fontSize: 15,
    },
    scale: {
      gridLines: {
        color: "rgba(200,200,200,0.18)",
      },
      ticks: {
        showLabelBackdrop: false,
        fontColor: "grey",
        min: lowest,
      },
    },
    tooltips: {
      callbacks: {
        label: function (tooltipItem, data) {
          let dataset = data.datasets[tooltipItem.datasetIndex];
          let index = tooltipItem.index;

          console.log(tooltipItem);
          console.log(data);
          return (
            data.labels[index] + " | Loudness: " + tooltipItem.value + " DB"
          ); //+ ": " + dataset.data[index];
        },
        //     title: function (tooltipItem, data) {
        //       //   //console.log(tooltipItem);
        //       return tooltipItem[0].label;
        //     },
      },
    },
  };
  return (
    <ScrollTrigger
      onEnter={() => {
        setVisible(true);
      }}
    >
      <div className="chart-container radar polar">
        {visible ? <Polar data={data} options={options} /> : null}
      </div>
    </ScrollTrigger>
  );
};
