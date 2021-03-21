import React from "react";

const MoreInfo = () => {
  //www.runnersworld.com/gear/a20799208/should-you-listen-to-music-while-running/
  https: return (
    <div className="faq">
      <h1>Song analysis information</h1>
      <p>
        <div className={"q"}>What is the 'Advanced Song Analysis'?</div>
        This feature uses Spotify's 'audio features' API to get detailed
        information about each song. Spotify gives each song a confidence score
        on numerous interesting metrics, for example 'acousticness', this is a
        score from 0 to 1, the higher the score the more likely the song is to
        be acoustic.
      </p>
      <p>
        <div className={"q"}>What data do we use?</div>
        <ul>
          <li>
            <p>
              <div className={"q"}>Acousticness</div>A confidence score from 0.0
              to 1.0 of whether the track is acoustic. Higher scores = more
              confidence that the track is acoustic.
              <br /> Why? This is interesting because many people listen to
              heavier music such as metal when running, so do less acoustic
              songs have an impact?
            </p>
          </li>
          <li>
            <p>
              <div className={"q"}>Danceability</div>Danceability describes how
              suitable a track is for dancing based on a combination of musical
              elements including tempo, rhythm stability, beat strength, and
              overall regularity. A value of 0.0 is least danceable and 1.0 is
              most danceable.
              <br /> Why? Studies have shown that songs with a more steady
              rhythm which coincide with common running rhythms can impact your
              run. Will songs with higher danceability scores improve your
              running?
            </p>
          </li>
          <li>
            <p>
              <div className={"q"}>Energy</div>Energy is a measure from 0.0 to
              1.0 and represents a perceptual measure of intensity and activity.
              Typically, energetic tracks feel fast, loud, and noisy. For
              example, death metal has high energy, while a Bach prelude scores
              low on the scale. Perceptual features contributing to this
              attribute include dynamic range, perceived loudness, timbre, onset
              rate, and general entropy.
              <br /> Why? More energetic songs could potentially make you want
              to move faster. Will songs with a higher energy score have an
              impact?
            </p>
          </li>
          <li>
            <p>
              <div className={"q"}>Valence</div>A measure from 0.0 to 1.0
              describing the musical positiveness conveyed by a track. Tracks
              with high valence sound more positive (e.g. happy, cheerful,
              euphoric), while tracks with low valence sound more negative (e.g.
              sad, depressed, angry).
              <br /> Why? It will be interesting to see whether a more somber,
              sad song has any different impact to a happy and upbeat tune.
            </p>
          </li>
          <li>
            <p>
              <div className={"q"}>Tempo</div>The overall estimated tempo of a
              track in beats per minute (BPM). In musical terminology, tempo is
              the speed or pace of a given piece and derives directly from the
              average beat duration.
              <br /> Why? Will faster songs make you run faster? If a song is
              too fast will that adversely affect your performance?
            </p>
          </li>
          <li>
            <p>
              <div className={"q"}>Time signature</div>An estimated overall time
              signature of a track. The time signature (meter) is a notational
              convention to specify how many beats are in each bar (or measure).
              <br /> Why? Will songs with more conventional time signatures that
              align nicely with running rhythms have an impact?
            </p>
          </li>
        </ul>
      </p>
    </div>
  );
};

export default MoreInfo;
