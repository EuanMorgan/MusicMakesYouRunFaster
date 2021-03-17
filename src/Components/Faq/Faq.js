import React from "react";

const Faq = () => {
  return (
    <div className="faq">
      <h1>F.A.Q</h1>
      <p>
        <div className={"q"}>Q. What is this app?</div>
        This app was created as part of my Final Year project for my Computer
        Science BSc degree at Cardiff University. It analyses your music
        streaming data and your fitness tracker data to see if the music has any
        affect on your exercise.
      </p>
      <p>
        <div className="q">Q. What services can I use?</div>
        The app currently supports FitBit and Spotify.
      </p>
      <p>
        <div className="q">Q. How do I create an account?</div>
        You simply connect your FitBit account! You don't need to give this app
        your username and password, you simply authenticate with fitbit and they
        send us a token which we can use to create you an account and access
        your FitBit data.
      </p>
      <p>
        <div className="q">Q. What data do you access?</div>
        For FitBit: We access your basic account information (username, profile
        picture, ID). We also access a list of your most recent activities, and
        finally, we access a map of your most recent run (containing heart
        rates, pace, steps and other FitBit data.)
        <br />
        <br />
        For Spotify: We access your last 50 listened to tracks.
      </p>
      <p>
        <div className="q">Q. How do I use the app?</div>
        You first connect your Spotify and FitBit accounts. Then, you go for a
        run whilst listening to any music of your choice. I reccommend that you
        manually begin a run activity with GPS enabled on your FitBit to ensure
        it captures the entire run. Once you're done, you sync your FitBit with
        the FitBit app (we can't see the data until it has been synced), and
        finally, you come back to us and click the 'Sync most recent run
        button'. From there, we will pull in your data and display it for you.
        After you have completed 5 runs, you will get access to the 'results'
        section, in which we will display some interesting results to you!
      </p>
    </div>
  );
};

export default Faq;
