export const getCodeFromURL = () => {
  let search = window.location.search;
  let params = new URLSearchParams(search);
  let code = params.get("code");
  console.log(code);
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
