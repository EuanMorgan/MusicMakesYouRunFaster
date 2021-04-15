export const getCodeFromURL = () => {
  let search = window.location.search;
  let params = new URLSearchParams(search);
  let code = params.get("code");
  //console.log(code);
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

export const generateColor = () => {
  return "#" + Math.random().toString(16).substr(-6);
};
