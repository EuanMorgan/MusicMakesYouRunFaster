import { isProduction } from "../Common/CommonFunctions";
import { db } from "../firebase/firebase";
import { useAuth } from "../Contexts/Auth";

export const pullRuns = async (refreshToken) => {
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

export const parseSongsAndRun = async (songs, run, uid, isTest) => {
  console.log(songs);
  let spotifySongs = songs.data.tracks;

  //console.log(run.trackpoints);
  //filter out unneccasry things, too much data to store otherwise

  let tempRoute = run.trackpoints.map((point) => {
    return {
      heart_rate_bpm: point.heart_rate_bpm,
      seq: point.seq,
      elapsed_sec: point.elapsed_sec,
      elapsed_hhmmss: point.elapsed_hhmmss,
      epoch_ms: point.epoch_ms,
      distance_meters: point.distance_meters,
      time: point.time,
      latitude: point.latitude,
      longitude: point.longitude,
    };
  });

  //get dates run occured
  let dates = [];

  for (let i of tempRoute) {
    if (!dates.includes(i["time"].split("T")[0]))
      dates.push(i["time"].split("T")[0]);
  }
  //dates plural because some nutcase might go for a run at like 5 to midnight?
  //console.log(`This run occured on the following date(s) ${dates.toString()}`);

  //discard all songs not played on the same date as the exercise

  //console.log(spotifySongs);
  spotifySongs = spotifySongs.filter((s) =>
    dates.includes(s["played_at"].split("T")[0])
  );
  let starting_song;

  let currentDiff = 1000000;
  let currentSong;
  spotifySongs.forEach((s, index) => {
    let xyz = Math.abs(s["rough_started_at"] - tempRoute[0].epoch_ms);
    if (xyz < currentDiff) {
      currentDiff = xyz;
      currentSong = s;
    }
  });

  starting_song = currentSong;
  //console.log("Starting song:", starting_song);
  spotifySongs = spotifySongs.splice(
    0,
    spotifySongs.indexOf(starting_song) + 1
  );

  //console.log("The songs played on that date");
  //console.log(spotifySongs);

  spotifySongs = spotifySongs.map((song, index) => {
    //console.log(index);
    if (index == spotifySongs.length - 1) {
      delete song.played_at;
      //console.log(song);
      return { ...song };
    }
    return {
      ...song,
      played_at: spotifySongs[index + 1].played_at,
      rough_started_at: new Date(spotifySongs[index + 1].played_at).getTime(),
    };
  });
  //console.log(spotifySongs);
  //for these songs... find the closest datapoint to the start... should be able to find exact second
  //do so for each track then bish bash bosh????? :D
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

    //console.log(
    //   `Closest for ${song["name"]} is ${closestPoint.time} at ${closestDiff}`
    // );
    //console.log(closestDiff);
    if (closestDiff < 60000) {
      //discard any songs played over a minute ago
      //i.e. any other songs played on the day not while running

      tempRoute = tempRoute.map((p) => {
        if (p.epoch_ms == closestPoint.epoch_ms) {
          //console.log(p);
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
  // if (!someSongs) {
  //   return -500;
  // }
  //console.log(tempRoute);
  //add curr song to every point and calculate speed
  let currSong;
  //get fastest points
  let last_5_distances = [];

  tempRoute = tempRoute.map((p) => {
    //keep only last 5 distances
    if (last_5_distances.length >= 5) {
      //remove oldest distance from list
      last_5_distances.splice(0, 1);
    }
    last_5_distances.push(p.distance_meters);

    let pace = (
      (last_5_distances[last_5_distances.length - 1] - last_5_distances[0]) /
      last_5_distances.length
    ).toFixed(2);
    if (parseInt(pace) < 0) {
      pace = "0";
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
  });

  //console.log(tempRoute);

  //we have now combined the songs with the points :D
  //https://tenor.com/qVqP.gif
  //console.log("UPDATED ROUTE");
  //console.log(tempRoute);
  //changed ID from YYYY-MM-DD (horrific) to DD-MM-YYYY (lovely and correct)
  let fixed_id =
    run.activityId.slice(8, 10) +
    run.activityId.slice(4, 7) +
    "-" +
    run.activityId.slice(0, 4) +
    run.activityId.slice(10);
  //console.log(fixed_id);

  if (tempRoute.length > 3000) {
    //split up into subparts to avoid exceeding firestore limit
    let chunk_size = 3000;
    let groups = tempRoute
      .map((e, i) =>
        i % chunk_size === 0 ? tempRoute.slice(i, i + chunk_size) : null
      )
      .filter((e) => e);
    //console.log(groups);

    try {
      groups.forEach(async (g, index) => {
        if (isTest) return;
        let ref = await db
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
      //console.log(error);
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
  let final_id = tempRoute.length > 3000 ? fixed_id + " part 0" : fixed_id;

  //TODO: this takes the top 10% of all points - instead loop through and only add points if they are more than x amount above the average for the run.

  let all_speeds = [];
  let all_heart_rates = [];
  tempRoute.forEach((p) => {
    all_heart_rates.push(p.heart_rate_bpm);
    all_speeds.push(parseFloat(p.pace));
  });

  const average = (arr) => arr.reduce((p, c) => p + c, 0) / arr.length;

  const avg_pace = average(all_speeds);
  const avg_bpm = average(all_heart_rates);

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

  //   setRoute(tempRoute);

  //   toggleShowMap(!showMap);
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
  const { signOut } = useAuth();

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

        await signOut();
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
