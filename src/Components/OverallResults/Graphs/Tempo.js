import React, { useState } from "react";
import ScrollTrigger from "react-scroll-trigger";
import { HorizontalBar, Bar, defaults } from "react-chartjs-2";
import { useWindowSize } from "../../../Hooks/useWindowSize";
export const Tempo = (props) => {
  const size = useWindowSize();
  const [visible, setVisible] = useState(false);
  let tempos = [];
  let labels = [];
  let colors = [];
  console.log(props.data);
  props.data.forEach((song) => {
    if (props.loudness) {
      tempos.push(song.audio_features[0].loudness.toFixed(0));
    } else {
      tempos.push(song.audio_features[0].tempo.toFixed(0));
    }
    colors.push(song.color);
    labels.push(song.name);
  });

  // console.log(tempos, labels);

  const data = {
    // labels: Object.keys(props.data),
    labels: labels,
    datasets: [
      {
        label: "Songs",
        data: tempos,
        backgroundColor: colors,
        borderColor: "white",
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
      duration: 2000,
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
          ticks: {
            beginAtZero: true,
          },
          barThickness: tempos.length < 15 ? 25 : 15,
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
      <ScrollTrigger
        onEnter={() => {
          setVisible(true);
        }}
        onExit={() => {
          setVisible(false);
        }}
      >
        <div className="chart-container bar-horizontal">
          <HorizontalBar data={data} options={options} />
        </div>
      </ScrollTrigger>
    );
  }
  return (
    <ScrollTrigger
      onEnter={() => {
        setVisible(true);
      }}
      // onExit={() => {
      //   setVisible(false);
      // }}
    >
      <div className="chart-container bar">
        {visible ? <Bar data={data} options={options} /> : null}
      </div>
    </ScrollTrigger>
  );
};
