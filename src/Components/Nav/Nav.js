// import React, { useContext } from "react";
// import { AuthContext } from "../Auth";
// import Navbar from "reactjs-navbar";
// //import logo from "./logo.png";
// import Loader from "react-loader-spinner";
// import {
//   faCogs,
//   faAnchor,
//   faDizzy,
//   faAdjust,
//   faBell,
//   faGhost,
//   faFan,
//   faCarSide,
//   faJedi,
//   faLaughBeam,
//   faKey,
//   faWater,
//   faCheese,
//   faHome,
//   faQuestion,
//   faSignOutAlt,
//   faSignInAlt,
// } from "@fortawesome/free-solid-svg-icons";
// import { firebaseApp } from "../../firebase/firebase";
// import "reactjs-navbar/dist/index.css";
// import { isProduction } from "../../Common/CommonFunctions";

// import { useHistory } from "react-router-dom";
// import logo from "../../Assets/navlogo.png";
// import { mdiProgressUpload } from "@mdi/js";
// const Nav = (props) => {
//   const { currentUser } = useContext(AuthContext);
//   const history = useHistory();

//   return (
//     <Navbar
//       loader={<Loader type="Puff" color="#D85B5B" height={25} width={25} />}
//       helpCallback={() => {
//         props.toast("I need help too... and a coffee ☕🥱");
//       }}
//       logo={logo}
//       menuItems={[
//         {
//           title: "Home",
//           icon: faHome,
//           isAuth: true,
//           onClick: () => {
//             history.push("/");
//           },
//         },
//         {
//           title: "FAQ",
//           icon: faQuestion,
//           isAuth: true,
//           onClick: () => {
//             history.push("/faq");
//           },
//         },
//         {
//           title: "Settings",
//           icon: faCogs,
//           isAuth: true,
//           subItems: [
//             currentUser
//               ? {
//                   title: "Logout",
//                   icon: faSignOutAlt,
//                   isAuth: true,
//                   onClick: () => {
//                     // What you want to do...
//                     firebaseApp
//                       .auth()
//                       .signOut()
//                       .then(() => {
//                         setTimeout(() => {
//                           history.push("/");
//                         }, 200);
//                       });
//                   },
//                 }
//               : {
//                   title: "Login",
//                   icon: faSignInAlt,
//                   isAuth: true,
//                   onClick: () => {
//                     let uri = isProduction()
//                       ? "https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=22C8M7&redirect_uri=https://musicmakesyourunfaster.firebaseapp.com/fitbit&scope=activity%20heartrate%20location%20profile"
//                       : "https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=22C8M7&redirect_uri=http://localhost:3000/fitbit&scope=activity%20heartrate%20location%20profile";
//                     console.log(uri);
//                     window.open(uri, "_current");
//                   },
//                 },
//             {
//               title: "Subitem 2",
//               icon: faDizzy,
//               isAuth: true,
//               subItems: [
//                 { title: "Subitem 2-1", icon: faAdjust, isAuth: true },
//                 {
//                   title: "Subitem 2-2",
//                   icon: faBell,
//                   isAuth: true,
//                   subItems: [
//                     {
//                       title: "Subitem 2-2-1",
//                       icon: faGhost,
//                       isAuth: true,
//                       subItems: [
//                         {
//                           title: "Subitem 2-2-2-1",
//                           icon: faFan,
//                           isAuth: true,
//                         },
//                         {
//                           title: "Subitem 2-2-2-2",
//                           icon: faCarSide,
//                           isAuth: true,
//                         },
//                         {
//                           title: "Subitem 2-2-2-3",
//                           icon: faJedi,
//                           isAuth: true,
//                         },
//                         {
//                           title: "Subitem 2-2-2-4",
//                           icon: faLaughBeam,
//                           isAuth: true,
//                         },
//                       ],
//                     },
//                     {
//                       title: "Subitem 2-2-2",
//                       icon: faKey,
//                       isAuth: true,
//                     },
//                   ],
//                 },
//                 {
//                   title: "Make request",
//                   icon: faCheese,
//                   isAuth: true,
//                   onClick: () => {
//                     // What you want to do...
//                     this.setState({ isLoading: true }, () =>
//                       setTimeout(() => {
//                         this.setState({ isLoading: false });
//                       }, 3000)
//                     );
//                   },
//                 },
//               ],
//             },
//             {
//               title: "Subitem 3",
//               icon: faWater,
//               isAuth: () => {
//                 // Claim authorization logic...
//                 return false;
//               },
//             },
//           ],
//         },
//       ]}
//     />
//   );
// };

// export default Nav;

import { AuthContext } from "../Auth";
import {
  faCogs,
  faAnchor,
  faDizzy,
  faAdjust,
  faBell,
  faGhost,
  faFan,
  faCarSide,
  faJedi,
  faLaughBeam,
  faKey,
  faWater,
  faCheese,
  faHome,
  faQuestion,
  faSignOutAlt,
  faSignInAlt,
} from "@fortawesome/free-solid-svg-icons";
import { firebaseApp } from "../../firebase/firebase";
import { isProduction } from "../../Common/CommonFunctions";
import React, { useContext } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useLocation, useHistory } from "react-router-dom";
import { useEffect, useState } from "react";

const Nav = () => {
  const { currentUser } = useContext(AuthContext);
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
            onClick={() => {
              if (currentUser) {
                firebaseApp
                  .auth()
                  .signOut()
                  .then(() => {
                    setTimeout(() => {
                      history.push("/");
                    }, 200);
                  });
              } else {
                let uri = isProduction()
                  ? "https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=22C8M7&redirect_uri=https://musicmakesyourunfaster.firebaseapp.com/fitbit&scope=activity%20heartrate%20location%20profile"
                  : "https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=22C8M7&redirect_uri=http://localhost:3000/fitbit&scope=activity%20heartrate%20location%20profile";
                console.log(uri);
                window.open(uri, "_current");
              }
            }}
          >
            {currentUser ? "Logout" : "Login"}
          </Link>
        </li>
        {/* <li>
          <Link to="/time">Timer</Link>
          <Line
            transition={{ duration: 0.75 }}
            initial={{ width: "0%" }}
            animate={{ width: pathname === "/time" ? "50%" : "0%" }}
          />
        </li> */}
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
