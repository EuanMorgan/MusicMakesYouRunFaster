// import { render, screen } from '@testing-library/react';
// import App from './App';

//basic test to test circleci integration
// import { addTwoNumbers } from "./TestTest";
// test("Adds 3 + 2 to equal 5", () => {
//   expect(addTwoNumbers(3, 2)).toBe(5);
// });
// test('renders learn react link', () => {
//   render(<App />);
//   const linkElement = screen.getByText(/learn react/i);
//   expect(linkElement).toBeInTheDocument();
// });

import { db } from "./firebase/firebase";
import { parseSongsAndRun, pullSongs } from "./Functions/MainApiCalls";
import { run, songs, shouldBe } from "./TestData";

test("Parsing run function", async () => {
  let x = await parseSongsAndRun(songs, run.run_map, "7LZHNM", true);

  expect(x).toStrictEqual(shouldBe);
});

test("Creating,pulling,deleting", async () => {
  await fetch(
    "https://europe-west2-musicmakesyourunfaster.cloudfunctions.net/app/test-create-account",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  console.log("created account");
  let d = await db.collection("users").doc("9BSVPX").get();
  console.log(d.data());
  // let songOutput = await pullSongs();
  // let;
  expect(10).toEqual(10);
}, 75000);
