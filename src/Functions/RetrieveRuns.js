import { isProduction } from "../Common/CommonFunctions";
import { db } from "../firebase/firebase";

export const retrieveRuns = async (props, userData, setStates, history) => {
  props.setLoading(true);

  let spotifyToken;
  //console.log(userData.spotifyRefreshToken);
  let uri = isProduction()
    ? "https://europe-west2-musicmakesyourunfaster.cloudfunctions.net/app/api/spotify/refresh"
    : "http://localhost:5000/musicmakesyourunfaster/europe-west2/app/api/spotify/refresh";
  spotifyToken = await fetch(uri, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      refresh_token: userData.spotifyRefreshToken,
    }),
  });
  spotifyToken = await spotifyToken.text();
  //console.log(spotifyToken);

  let runRef = await db
    .collection("users")
    .doc(userData.fitbitId)
    .collection("runs")
    .get();
  //console.log(runRef.docs);
  if (runRef.empty) {
    props.toast.error("❗ No runs found, please pull a recent run first. ❗");
    props.setLoading(false);
    history.push("/dashboard");
    return;
  }

  let idList = [];
  for (let i = 0; i < runRef.docs.length; i++) {
    //console.log(runRef.docs[i].id);
    if (runRef.docs[i].id.includes("part")) {
      if (!runRef.docs[i].id.includes("part 0")) {
        //only use one part
        continue;
      }
    }
    idList.push(runRef.docs[i].id);
  }

  let allRuns = [];

  //Add runs to list, if split into subparts, combine them.
  let fix_index = 0; //move this back one when we encounter any id with 'part' in it
  runRef.docs.forEach((r, index) => {
    //console.log(r.id);
    if (r.id.includes("part")) {
      //console.log("0 index ", fix_index);
      if (!r.id.includes("part 0")) {
        //console.log(fix_index - 1);
        allRuns[fix_index - 1].run_map = [
          ...allRuns[fix_index - 1].run_map,
          ...r.data().run_map,
        ];
        return;
      }
    }
    allRuns.push(r.data());
    fix_index++;
  });

  setStates([idList, allRuns, spotifyToken]);

  props.setLoading(false);
  return [idList, allRuns, spotifyToken];
};
