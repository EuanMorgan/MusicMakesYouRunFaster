import { isProduction, average } from "../Common/CommonFunctions";
import app, { db } from "../firebase/firebase";
// import { useAuth } from "../Contexts/Auth";

export const pullRuns = async (refreshToken) => {
  // send request to backend which makes fitbit api request and finds the most recent run with a map
  let uri = isProduction()
    ? "https://europe-west2-musicmakesyourunfaster.cloudfunctions.net/app/api/fitbit/map"
    : "http://localhost:5000/musicmakesyourunfaster/europe-west2/app/api/fitbit/map";
  let response = await fetch(uri, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });
  let r;
  try {
    r = await response.json();
  } catch {
    r = "oops";
  }

  console.log("MAPPYBOY", r);
  //TODO: -1 return
  return r.run_map;
};

export const pullSongs = async (refreshToken) => {
  //console.log("Using refresh token ", refreshToken);
  // sends request to backend which makes spotify api requests and returns an array of last 50 songs, each with audio feature info
  let uri = isProduction()
    ? "https://europe-west2-musicmakesyourunfaster.cloudfunctions.net/app/api/spotify/grab-songs"
    : "http://localhost:5000/musicmakesyourunfaster/europe-west2/app/api/spotify/grab-songs";
  const spotifyResponse = await fetch(uri, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  let spotifySongs = await spotifyResponse.json();
  //TODO: TOASTIFY
  if (spotifySongs == "error") {
    alert("There has been an error fetching the map of your most recent run.");
  }
  console.log("SONGIES", spotifySongs);
  return spotifySongs;
};

const calculateSongPlayedTimes = (spotifySongs) => {
  /*
    Spotify API returns a played_at time for each song, however this is actually the time
    that the song started. Intuitively you might use this to calculate the speed by doing
    rough_started_at = end time - duration of song 
    however, this doesn't account for the user skipping the song for example.
    Therefore I came up with the following algorithm

    For each song:
        If it's the first song: just keep its rough_started_at time
        else:
            Change its rough_started_at time to the played_at (finsished) time of the song before it
            i.e. shift them all backwards, because the time that song A finsihed is also the time that song B started
            in continous playback.
  */
  return spotifySongs.map((song, index) => {
    if (index == spotifySongs.length - 1) {
      delete song.played_at;
      return { ...song };
    }
    return {
      ...song,
      played_at: spotifySongs[index + 1].played_at,
      rough_started_at: new Date(spotifySongs[index + 1].played_at).getTime(),
    };
  });
};

const findStartingSong = (spotifySongs, tempRoute) => {
  // Find starting song
  let currentDiff = 1000000;
  let currentSong;
  spotifySongs.forEach((s, index) => {
    let xyz = Math.abs(s["rough_started_at"] - tempRoute[0].epoch_ms);
    if (xyz < currentDiff) {
      currentDiff = xyz;
      currentSong = s;
    }
  });
  return currentSong;
};

const matchSongsToPoints = (spotifySongs, tempRoute) => {
  //for these songs... find the closest datapoint to the start... should be able to find exact second
  //do so for each track then bish bash bosh????? :D
  console.log("hello there");
  let someSongs = false;
  for (let song of spotifySongs) {
    let closestPoint;
    let closestDiff;
    for (let point of tempRoute) {
      let current = Math.abs(song["rough_started_at"] - point.epoch_ms);
      if (closestDiff == undefined) {
        closestDiff = current;
        closestPoint = point;
      }
      if (current < closestDiff) {
        closestDiff = current;
        closestPoint = point;
      }
    }
    console.log(
      `Closest for ${song["name"]} is ${closestPoint.time} at ${closestDiff}`
    );
    console.log(closestDiff);
    if (closestDiff < 60000) {
      //discard any songs played over a minute ago
      //i.e. any other songs played on the day not while running

      tempRoute = tempRoute.map((p) => {
        if (p.epoch_ms == closestPoint.epoch_ms) {
          someSongs = true;
          return { ...p, song_playing: song };
        } else {
          return { ...p };
        }
      });
    } else {
      spotifySongs = spotifySongs.filter(
        (s) => s.rough_started_at != song["rough_started_at"]
      );
    }
  }
  if (!someSongs) {
    return -500;
  }
  console.log("returning babyyyyyyyyy");
  return [tempRoute, spotifySongs];
};

const removeDuplicatePoints = (tempRoute) => {
  /*
    Remove duplicate points, for some reason my fitbit occasionaly
    has duplicate points i.e. the same epoch ms
  */

  const all_ms = {};
  return (tempRoute = tempRoute.filter((item) => {
    let value = item["epoch_ms"];
    let exists = all_ms[value];
    all_ms[value] = true;
    return !exists;
  }));
};

const calcSpeedAndPopulateCurrentlyPlaying = (tempRoute) => {
  //add curr song to every point and calculate speed
  let currSong;
  //get fastest points
  let last_5_distances = [];
  let last_5_times = []; //calculate the time difference between last two points
  //we can't assume it's 1 sec because the user may pause the run etc...

  return (tempRoute = tempRoute.map((p) => {
    //keep only last 5 distances

    if (last_5_distances.length >= 5) {
      //remove oldest distance from list
      last_5_distances.splice(0, 1);
    }
    if (last_5_times.length >= 5) {
      last_5_times.splice(0, 1);
    }
    last_5_distances.push(p.distance_meters);
    last_5_times.push(p.epoch_ms / 1000);

    // console.log(`Calculating m/s:`);
    let distance_last_sec =
      last_5_distances[last_5_distances.length - 1] - last_5_distances[0];
    // console.log(`Distance in last time interval = ${distance_last_sec}`);
    let time_difference =
      last_5_times[last_5_times.length - 1] - last_5_times[0];
    // console.log(`Time difference between interval ${time_difference}`);
    let pace = Math.abs((distance_last_sec / time_difference).toFixed(2));
    // console.log(`Speed = ${distance_last_sec} / ${time_difference}`);
    if (last_5_distances.length == 1) {
      // return 0 for first pace otherwise it will be NaN
      pace = 0;
    }

    //if the point already has a song, this will be a new song
    if (p.song_playing) {
      currSong = p.song_playing;
      return {
        ...p,
        pace: pace,
      };
    }
    //if there exists a currently playing song, and it is still playing add it to the point
    if (
      currSong &&
      p.epoch_ms - currSong.rough_started_at < currSong.duration
    ) {
      return {
        ...p,
        song_playing: currSong.id,
        pace: pace,
      };
    }

    return { ...p, pace: pace };
  }));
};

const changeIdFormat = (id) => {
  return id.slice(8, 10) + id.slice(4, 7) + "-" + id.slice(0, 4) + id.slice(10);
};

const calcDistance = (lat1, lon1, lat2, lon2) => {
  var p = 0.017453292519943295; // Math.PI / 180
  var c = Math.cos;
  var a =
    0.5 -
    c((lat2 - lat1) * p) / 2 +
    (c(lat1 * p) * c(lat2 * p) * (1 - c((lon2 - lon1) * p))) / 2;

  let ans = 12742 * Math.asin(Math.sqrt(a));
  return Math.abs(ans * 1000).toFixed(2); // 2 * R; R = 6371 km
};

const split = (tempRoute) => {
  let chunk_size = 3000;

  // split into groups of 3000 (after testing this value seemed to be good to avoid overflowing firestore max storage)
  //example: if our chunk size was 5 and we had an array of 12 elements this function would return
  //[[1,2,3,4,5],[6,7,8,9,10],[11,12]]
  let groups = tempRoute
    .map((e, i) =>
      i % chunk_size === 0 ? tempRoute.slice(i, i + chunk_size) : null
    )
    .filter((e) => e);

  return groups;
};

export const parseSongsAndRun = async (songs, run, uid, isTest) => {
  let spotifySongs = songs.data.tracks;
  // let x = calculateSongPlayedTimes([...spotifySongs]);
  //filter out unneccasry things, too much data to store otherwise
  // and get dates run occured
  //dates plural because some nutcase might go for a run at like 5 to midnight?

  let dates = [];
  let total_distance = 0;
  let tempRoute = run.trackpoints.map((point, index) => {
    if (!dates.includes(point["time"].split("T")[0])) {
      dates.push(point["time"].split("T")[0]);
    }
    return {
      heart_rate_bpm: point.heart_rate_bpm,
      seq: point.seq,
      elapsed_sec: point.elapsed_sec,
      elapsed_hhmmss: point.elapsed_hhmmss,
      epoch_ms: point.epoch_ms,

      // OCCASSIONALY POINTS IN THE TCX FILE ARE MISSING THE DISTANCE,
      //THEREFORE I CALCULATE THE DISTANCE MYSELF USING HAVERSINE FORMULA

      distance_meters: (total_distance += parseFloat(
        calcDistance(
          run.trackpoints[index === 0 ? 0 : index - 1].latitude,
          run.trackpoints[index === 0 ? 0 : index - 1].longitude,
          point.latitude,
          point.longitude
        )
      )),
      time: point.time,
      latitude: point.latitude,
      longitude: point.longitude,
    };
  });

  //REMOVE FIRST AND LAST 3 POINTS
  //REASON IS BECAUSE SOMETIMES FITBIT GPS SEEMS TO ACT UP DURING THIS TIMES
  //I.E. NOT RECORDING THE CORRECT POINTS WHICH MESSES UP SPEED AND DISTANCE CALCULATIONS

  tempRoute.splice(0, 3);
  tempRoute.splice(tempRoute.length - 3, 3);

  console.log(`This run occured on the following date(s) ${dates.toString()}`);
  //discard all songs not played on the same date as the exercise
  spotifySongs = spotifySongs.filter((s) =>
    dates.includes(s["played_at"].split("T")[0])
  );

  //find starting song (first played during run)
  //remove any songs that come before it.
  let starting_song = findStartingSong(spotifySongs, tempRoute);
  spotifySongs = spotifySongs.splice(
    0,
    spotifySongs.indexOf(starting_song) + 1
  );

  //calculate 'rough' start times for each song.
  //using my shift algorithm
  console.log("trying this shit");
  spotifySongs = calculateSongPlayedTimes(spotifySongs);
  console.log("done it");

  let ret = matchSongsToPoints(spotifySongs, tempRoute);
  console.log("ditch other songs");

  if (ret == -500) {
    // NO SONGS
    return -500;
  }

  [tempRoute, spotifySongs] = ret;

  console.log(tempRoute, spotifySongs);

  tempRoute = removeDuplicatePoints(tempRoute);

  tempRoute = calcSpeedAndPopulateCurrentlyPlaying(tempRoute);

  console.log(tempRoute);

  //we have now combined the songs with the points :D
  //https://tenor.com/qVqP.gif

  //changed ID from YYYY-MM-DD (horrific) to DD-MM-YYYY (lovely and correct)
  // totally unnecessary but I find it more readable
  let fixed_id = changeIdFormat(run.activityId);

  if (tempRoute.length > 3000) {
    //split up into subparts to avoid exceeding firestore limit
    let groups = split(tempRoute);
    try {
      groups.forEach(async (g, index) => {
        if (isTest) return; //don't write to db when testing
        let ref = db
          .collection("users")
          .doc(uid)
          .collection("runs")
          .doc(fixed_id + " part " + index);
        let check_ref = await ref.get();
        if (check_ref.exists) {
          console.log("IT EXISTS");
          return -255;
        }
        ref.set({ run_map: g });
      });
    } catch (error) {
      // -5 means error with storing data, could be internet issues or firebase is down temporarily etc
      return -5;
    }
  } else {
    try {
      if (!isTest) {
        let ref = await db
          .collection("users")
          .doc(uid)
          .collection("runs")
          .doc(fixed_id);

        let check_ref = await ref.get();

        if (check_ref.exists) {
          console.log("it exists!");
          return -255;
        }
        ref.set({ run_map: tempRoute });
      }
    } catch (error) {
      //console.log(error);
    }
  }

  //if split into parts, use only the first ID
  let final_id = tempRoute.length > 3000 ? fixed_id + " part 0" : fixed_id;

  //TODO: this takes the top 10% of all points - instead loop through and only add points if they are more than x amount above the average for the run.

  //Get array of all speeds and heart rates.
  let all_speeds = [];
  let all_heart_rates = [];
  tempRoute.forEach((p) => {
    all_heart_rates.push(p.heart_rate_bpm);
    all_speeds.push(parseFloat(p.pace));
  });

  const avg_pace = average(all_speeds);
  const avg_bpm = average(all_heart_rates);

  // Get fastest and highest bpm points
  // Top 10% of points get returned.
  let fastest = tempRoute.filter((p) => p.pace > avg_pace);
  let highest = tempRoute.filter((p) => p.heart_rate_bpm > avg_bpm);
  let fastest_points = await findFastestPoints(fastest, uid, final_id, isTest);
  let highest_points = await findHighestBPMPoints(
    highest,
    uid,
    final_id,
    isTest
  );

  try {
    if (!isTest) {
      await db
        .collection("users")
        .doc(uid)
        .collection("runs")
        .doc(final_id)
        .set(
          { songs: spotifySongs, avg_pace: avg_pace, avg_bpm: avg_bpm },
          { merge: true }
        );
    }
  } catch (error) {
    //console.log(error);
  }

  //console.log("returning this to be fair....");
  // console.log([
  //   tempRoute,
  //   spotifySongs,
  //   avg_pace,
  //   avg_bpm,
  //   fastest_points,
  //   highest_points,
  // ]);
  return [
    tempRoute,
    spotifySongs,
    avg_pace,
    avg_bpm,
    fastest_points,
    highest_points,
  ];
};

const findFastestPoints = async (points, uid, id, isTest) => {
  //sort points by pace
  let pace_order = points.sort(sort("pace"));
  let len = Math.ceil(pace_order.length / 10);
  //console.log(pace_order);
  pace_order = pace_order.slice(0, len);
  //console.log(pace_order);
  try {
    if (!isTest) {
      await db
        .collection("users")
        .doc(uid)
        .collection("runs")
        .doc(id)
        .set({ fastest_points: pace_order }, { merge: true });
    }
    return pace_order;
  } catch (error) {
    //console.log(error);
  }
};

const findHighestBPMPoints = async (points, uid, id, isTest) => {
  //sort points by pace
  let bpm_order = points.sort(sort("heart_rate_bpm"));
  let len = Math.ceil(bpm_order.length / 10);
  //console.log(bpm_order);
  bpm_order = bpm_order.slice(0, len);
  //console.log(bpm_order);
  try {
    if (!isTest) {
      await db
        .collection("users")
        .doc(uid)
        .collection("runs")
        .doc(id)
        .set({ highest_heart_points: bpm_order }, { merge: true });
    }
    return bpm_order;
  } catch (error) {
    //console.log(error);
  }
};

export const sort = (property) => {
  var sortOrder = -1;
  if (property[0] === "-") {
    sortOrder = -1;
    property = property.substr(1);
  }
  return function (a, b) {
    /* next line works with strings and numbers,
     * and you may want to customize it to your needs
     */
    var result =
      a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
    return result * sortOrder;
  };
};

export const DeleteAccount = async (uid, toast, refresh_token, noSpotify) => {
  try {
    let ref = db.collection("users").doc(uid);
    deleteCollection(uid);
    if ((await ref.get()).exists) {
      ref.delete().then(async () => {
        let uri = isProduction()
          ? "https://europe-west2-musicmakesyourunfaster.cloudfunctions.net/app/api/fitbit/revoke"
          : "http://localhost:5000/musicmakesyourunfaster/europe-west2/app/api/fitbit/revoke";
        console.log(refresh_token);
        fetch(uri, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refresh_token: refresh_token }),
        });
        toast.success("Account deleted successfully, bon voyage! 👋");
        if (!noSpotify) {
          toast(
            "You will be redirected to Spotify in 5 seconds. Please revoke access for Music Makes You Run Faster there"
          );
        }

        await app.auth().signOut();
        if (!noSpotify) {
          setTimeout(
            () =>
              window.open("https://www.spotify.com/account/apps/", "_blank"),
            5000
          );
        }
      });
    }
  } catch (error) {
    console.log(error);
    toast.error("Error deleting account!");
  }
};

const deleteCollection = (uid) => {
  try {
    db.collection("users")
      .doc(uid)
      .collection("runs")
      .get()
      .then((res) => {
        res.docs.map((val) => {
          val.ref.delete();
        });
      });
  } catch (error) {
    console.log(error);
  }
};

export const deleteRun = async (id, uid, toast) => {
  if (id.includes("part")) {
    let part = 0;
    while (true) {
      try {
        let ref = await db
          .collection("users")
          .doc(uid)
          .collection("runs")
          .doc(id.split(" ")[0] + " part " + part);
        if ((await ref.get()).exists) {
          //console.log(id.split(" ")[0] + " part " + part);
          ref.delete();
        } else {
          break;
        }
      } catch (error) {
        toast.error("Error deleting!");
        //console.log(error);
        return false;
      }
      part++;
    }
  } else {
    try {
      await db.collection("users").doc(uid).collection("runs").doc(id).delete();
    } catch (error) {
      toast.error("Error deleting!");
      return false;
    }
  }

  toast.success("Successfully deleted run!");
};
