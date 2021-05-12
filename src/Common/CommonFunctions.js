export const getCodeFromURL = () => {
  let search = window.location.search;
  let params = new URLSearchParams(search);
  let code = params.get("code");
  ////console.log(code);
  if (!code) {
    return null;
    // alert("Error authenticating with API, please try again.");
  }
  return code;
};

export const isProduction = () => {
  if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
    // dev code
    return false;
  } else {
    // production code
    return true;
  }
};

export const calcPercentIncDec = (start, end) => {
  return start > end
    ? ((start - end) / start) * 100 //if decrease
    : ((end - start) / start) * 100;
};

export const msToHMS = (ms, isSeconds) => {
  // 1- Convert to seconds:
  let seconds = ms / 1000;
  if (isSeconds) seconds = ms;

  // 2- Extract hours:
  var hours = parseInt(seconds / 3600); // 3,600 seconds in 1 hour
  seconds = seconds % 3600; // seconds remaining after extracting hours
  // 3- Extract minutes:
  var minutes = parseInt(seconds / 60); // 60 seconds in 1 minute
  // 4- Keep only seconds not extracted to minutes:
  seconds = seconds % 60;

  seconds = seconds.toString();
  seconds = seconds.length > 1 ? seconds : "0" + seconds;

  hours = hours.toString();
  hours = hours.length > 1 ? hours : "0" + hours;

  minutes = minutes.toString();
  minutes = minutes.length > 1 ? minutes : "0" + minutes;

  return hours + ":" + minutes + ":" + seconds;
};

export const average = (arr) => arr.reduce((p, c) => p + c, 0) / arr.length;

export const sortDescending = (a, b) => b - a;

const hsv_to_rgb = (h, s, v) => {
  // Adapted from https://martin.ankerl.com/2009/12/09/how-to-create-random-colors-programmatically/
  let golden_ratio_conjugate = 0.618033988749895;
  h += golden_ratio_conjugate;
  h %= 1;
  let h_i = parseInt(h * 6);
  let f = h * 6 - h_i;
  let p = v * (1 - s);
  let q = v * (1 - f * s);
  let t = v * (1 - (1 - f) * s);
  let [r, g, b] = [0, 0, 0];
  if (h_i === 0) [r, g, b] = [v, t, p];
  if (h_i === 1) [r, g, b] = [q, v, p];
  if (h_i === 2) [r, g, b] = [p, v, t];
  if (h_i === 3) [r, g, b] = [p, q, v];
  if (h_i === 4) [r, g, b] = [t, p, v];
  if (h_i === 5) [r, g, b] = [v, p, q];

  return `rgb(${parseInt(r * 256)}, ${parseInt(g * 256)}, ${parseInt(
    b * 256
  )})`;
};

export const generateColor = () => {
  return hsv_to_rgb(Math.random(), 0.5, 0.95);
};

export const retrieveDataForSong = (songid, run_data, onlyFast) => {
  let all_data = [];

  //console.log(run_data);
  run_data.forEach((run) => {
    let data = [];
    let labels = [];
    //console.log(run);
    //remove duplicates that are not fastest
    if (
      !run.fastest_points.map((point) => point.song_playing).includes(songid) &&
      onlyFast
    ) {
      return;
    }

    run.run_map.forEach((p) => {
      if (!p.song_playing) {
        // NOT LISTENING
        return;
      }
      if (
        (typeof p.song_playing == "string" && p.song_playing == songid) ||
        p.song_playing.id == songid
      ) {
        // listening
        labels.push(p.elapsed_hhmmss);
        data.push(p.pace);
      }
    });

    //add the data for the run to the array
    if (data.length > 0) {
      let title =
        run.run_map[0].time.split("T")[0] +
        " " +
        run.run_map[0].time.split("T")[1].split(".")[0];
      all_data.push({
        data: data,
        title: title,
        labels: labels,
      });
    }
  });

  return all_data;
  // [
  //   data,
  //   not_listening_data,
  //   heartrates,
  //   not_listening_heartrates,
  //   listening_map,
  //   labels,
  // ];
};
