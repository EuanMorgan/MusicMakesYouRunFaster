import { useAuth } from "../../Contexts/Auth";
import { isProduction } from "../../Common/CommonFunctions";
import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useLocation, useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import { API_AUTH } from "../../Constants/URLs";
const Nav = (props) => {
  const { currentUser, signOut } = useAuth();
  const { pathname } = useLocation();
  const [width, setWidth] = useState(window.innerWidth);
  const history = useHistory();
  useEffect(() => {
    window.addEventListener("resize", () => {
      setWidth(window.innerWidth);
    });
  }, []);
  return (
    <StyledNav>
      <h1 className="nav">
        <Link id="logo" to="/">
          {width > 1250 ? "Music Makes You Run Faster" : "MMYRF"}
        </Link>
      </h1>
      <ul>
        <li>
          <Link to="/">Home</Link>
          <Line
            transition={{ duration: 0.75 }}
            initial={{ width: "0%" }}
            animate={{
              width:
                pathname === "/" ||
                pathname === "/dashboard" ||
                pathname === "/continue-setup"
                  ? "50%"
                  : "0%",
            }}
          />
        </li>
        <li>
          <Link to="/faq">FAQ</Link>
          <Line
            transition={{ duration: 0.75 }}
            initial={{ width: "0%" }}
            animate={{ width: pathname === "/faq" ? "50%" : "0%" }}
          />
        </li>
        <li>
          <Link
            onClick={async () => {
              if (currentUser) {
                try {
                  await signOut();
                  history.push("/");
                  props.toast("Bye bye 👋");
                } catch (error) {
                  props.toast("Error signing out");
                }
              } else {
                let uri = isProduction() ? API_AUTH.PRODUCTION : API_AUTH.DEBUG;

                window.open(uri, "_current");
              }
            }}
          >
            {currentUser ? "Logout" : "Login"}
          </Link>
        </li>
      </ul>
    </StyledNav>
  );
};

const StyledNav = styled.nav`
  min-height: 4vh;
  display: flex;
  margin: auto;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 10rem;
  background: #282828;
  position: sticky;
  top: 0;
  z-index: 10;
  font-weight: bold;
  a {
    color: white;
    text-decoration: none;
  }
  ul {
    display: flex;
    list-style: none;
  }
  #logo {
    font-size: 1.5rem;
    font-family: "Lobster", cursive;
    font-weight: lighter;
  }
  li {
    padding-left: 10rem;
    position: relative;
  }

  @media (max-width: 800px) {
    padding: 0.3rem 1rem;
    #logo {
      display: inline-block;
      margin: 0rem;
    }
    ul {
      padding: 0rem;
      justify-content: space-around;
      width: 100%;
      li {
        padding: 0;
      }
    }
  }
`;
const Line = styled(motion.div)`
  height: 0.3rem;
  background: #c41818;
  width: 0%;
  position: absolute;
  bottom: -80%;
  left: 64%;
  @media (max-width: 800px) {
    left: 0%;
  }
`;
export default Nav;
