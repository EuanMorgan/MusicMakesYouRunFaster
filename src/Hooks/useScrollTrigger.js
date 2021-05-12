// import ScrollTrigger from "react-scroll-trigger";
// import React, { useState, useEffect } from "react";

// const useScrollTrigger = () => {
//   const [visible, setVisible] = useState(false);
//   useEffect(() => {
//     // Handler to call on window resize
//     onEnterViewport = () => {
//       this.setState({
//         visible: true,
//       });
//     };

//     onExitViewport = () => {
//       this.setState({
//         visible: false,
//       });
//     };
//     // Call handler right away so state gets updated with initial window size
//     handleResize();
//     // Remove event listener on cleanup
//     return () => window.removeEventListener("resize", handleResize);
//   }, []); // Empty array ensures that effect is only run on mount
//   return visible;
// };
