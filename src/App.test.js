import {
  parseSongsAndRun,
  pullRuns,
  pullSongs,
} from "./Functions/MainApiCalls";
import { run, songs, shouldBe, mainTestShouldBe } from "./TestData";

test("Parsing run function", async () => {
  let x = await parseSongsAndRun(songs, run.run_map, "7LZHNM", true);

  expect(x).toStrictEqual(shouldBe);
});

test("Creating,pulling,deleting", async () => {
  // https://europe-west2-musicmakesyourunfaster.cloudfunctions.net/app/test-create-account
  let code = await fetch(
    "https://europe-west2-musicmakesyourunfaster.cloudfunctions.net/app/test-create-account",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  let data = await code.json();

  console.log("created account");
  console.log(data.data.spotify);
  let songOutput = await pullSongs(data.data.spotify.refresh_token);
  let mapOutput = await pullRuns(data.data.fitbit.refresh_token);
  let final = await parseSongsAndRun(songOutput, mapOutput, "99GN7F", true);

  expect(final).toStrictEqual(mainTestShouldBe);
}, 75000);
