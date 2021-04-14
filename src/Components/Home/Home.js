import React, { useContext, useEffect, useState } from "react";

import Icon from "@mdi/react";
import { mdiChevronDown } from "@mdi/js";
import { scroller } from "react-scroll";

import "./Home.css";
import "../../Styles/default-text.css";
import { useHistory } from "react-router-dom";
import { getCodeFromURL, isProduction } from "../../Common/CommonFunctions";
import { useAuth } from "../../Contexts/Auth";
import { CODE_EXCHANGE } from "../../Constants/URLs";

const Home = (props) => {
  const history = useHistory();
  const { currentUser, signIn } = useAuth();
  if (currentUser) {
    //console.log(currentUser);
    //console.log("redirect from home");
    history.push("/dashboard");
  }
  const scrollToSection = (duration) => {
    scroller.scrollTo("Buttons", {
      duration: duration ? duration : 800,
      delay: 0,
      smooth: "easeInOutQuart",
    });
  };
  const openInNewTab = (url) => {
    const newWindow = window.open(url, "_current");
    if (newWindow) newWindow.opener = null;
  };
  const getAccessToken = async () => {
    //Exchanges fitbit code for access token AND creates custom token for firebase auth
    props.setLoading(true);

    let code = getCodeFromURL();
    let uri = isProduction() ? CODE_EXCHANGE.PRODUCTION : CODE_EXCHANGE.DEBUG;
    const response = await fetch(uri, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code: code }),
    });
    //console.log(response);
    let customToken = await response.text();
    //console.log(customToken);
    try {
      await signIn(customToken);

      //signed in
      //console.log("Sign in successful, redirecting");
      history.push("/continue-setup");
      props.setLoading(false);
      props.toast("🌈 sign in successful! 🌈");
    } catch (error) {
      props.toast.error("There has been an error signing in");
      history.push("/");
      //console.log(error);
    }
  };

  useEffect(() => {
    if (props.fitbitAuth) {
      scrollToSection(0);
      getAccessToken();
    }
  }, []);
  if (props.fitbitAuth) {
    return <div></div>;
  }
  return (
    <div className="App">
      <div className="Content">
        <span className="slam">
          MUSIC{" "}
          <span style={{ color: "white" }}>
            MAKES <br />
            YOU
          </span>{" "}
          RUN <br />
          FASTER
        </span>
        <Icon
          path={mdiChevronDown}
          size={3}
          horizontal
          color="red"
          className="bounce"
          onClick={scrollToSection}
        />
      </div>
      <div className="Buttons" id="content">
        <h1>Thank you for using my app!</h1>
        <p>
          Music makes you run faster is my final year project. It is an
          application which analyses your FitBit activity data along with your
          music streaming data to see if the music has any impact on your
          performance.
        </p>
        <div>
          <h1>Step 1: Sign up / Sign in with FitBit</h1>
          <button
            id="fitbit-button"
            onClick={() => {
              //console.log(`Are we in production env?`);
              //console.log(isProduction());
              let uri = isProduction()
                ? "https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=22C8M7&redirect_uri=https://musicmakesyourunfaster.firebaseapp.com/fitbit&scope=activity%20heartrate%20location%20profile"
                : "https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=22C8M7&redirect_uri=http://localhost:3000/fitbit&scope=activity%20heartrate%20location%20profile";

              //console.log(uri);
              openInNewTab(uri);
            }}
          >
            Link FitBit Account
          </button>
        </div>

        <h1>Step 2: Connect your spotify account</h1>

        <h1>Step 3: Run whilst listening to music!</h1>
      </div>
    </div>
  );
};

export default Home;
