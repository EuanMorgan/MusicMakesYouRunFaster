export const CODE_EXCHANGE = {
  DEBUG:
    "http://localhost:5000/musicmakesyourunfaster/europe-west2/app/api/fitbit/user-auth",
  PRODUCTION:
    "https://europe-west2-musicmakesyourunfaster.cloudfunctions.net/app/api/fitbit/user-auth",
};

export const API_AUTH = {
  DEBUG:
    "https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=22C8M7&redirect_uri=http://localhost:3000/fitbit&scope=activity%20heartrate%20location%20profile",
  PRODUCTION:
    "https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=22C8M7&redirect_uri=https://musicmakesyourunfaster.firebaseapp.com/fitbit&scope=activity%20heartrate%20location%20profile",
};

export const SIMILAR = {
  DEBUG:
    "http://localhost:5000/musicmakesyourunfaster/europe-west2/app/api/spotify/similar",
  PRODUCTION:
    "https://europe-west2-musicmakesyourunfaster.cloudfunctions.net/app/api/spotify/similar",
};
