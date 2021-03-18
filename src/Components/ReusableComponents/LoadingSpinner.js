import BarLoader from "react-spinners/BarLoader";
import BeatLoader from "react-spinners/BeatLoader";
import BounceLoader from "react-spinners/BounceLoader";
import CircleLoader from "react-spinners/CircleLoader";
import ClimbingBoxLoader from "react-spinners/ClimbingBoxLoader";
import ClipLoader from "react-spinners/ClimbingBoxLoader";
import ClockLoader from "react-spinners/ClockLoader";
import DotLoader from "react-spinners/DotLoader";
import FadeLoader from "react-spinners/FadeLoader";
import GridLoader from "react-spinners/GridLoader";
import HashLoader from "react-spinners/HashLoader";
import MoonLoader from "react-spinners/MoonLoader";
import PacmanLoader from "react-spinners/PacmanLoader";
import PropagateLoader from "react-spinners/PropagateLoader";
import PuffLoader from "react-spinners/PuffLoader";
import PulseLoader from "react-spinners/PulseLoader";
import RingLoader from "react-spinners/RingLoader";
import RiseLoader from "react-spinners/RiseLoader";
import RotateLoader from "react-spinners/RotateLoader";
import ScaleLoader from "react-spinners/ScaleLoader";
import SkewLoader from "react-spinners/SkewLoader";
import SquareLoader from "react-spinners/SquareLoader";
import SyncLoader from "react-spinners/SyncLoader";
import LoadingOverlay from "react-loading-overlay";
import { useEffect } from "react";

// Overlay a random loader from react-spinners

const loaders = [
  <BarLoader color={"red"} />,
  <BeatLoader color={"red"} />,
  <BounceLoader color={"red"} />,
  <CircleLoader color={"red"} />,
  <ClimbingBoxLoader color={"red"} />,
  <ClipLoader color={"red"} />,
  <ClockLoader color={"red"} />,
  <DotLoader color={"red"} />,
  <FadeLoader color={"red"} />,
  <GridLoader color={"red"} />,
  <HashLoader color={"red"} />,
  // <MoonLoader color={"red"} />,
  <PacmanLoader color={"red"} />,
  <PropagateLoader color={"red"} />,
  <PuffLoader color={"red"} />,
  <PulseLoader color={"red"} />,
  <RingLoader color={"red"} />,
  <RiseLoader color={"red"} />,
  <RotateLoader color={"red"} />,
  <ScaleLoader color={"red"} />,
  <SkewLoader color={"red"} />,
  <SquareLoader color={"red"} />,
  <SyncLoader color={"red"} />,
];
let choice;
const LoadingSpinner = ({ active, children }) => {
  useEffect(() => {
    if (active) return;
    console.log("changing...");
    let c = Math.floor(Math.random() * loaders.length);
    choice = loaders[c];
    console.log(c);
  }, [active]);
  return (
    <LoadingOverlay
      active={active}
      spinner={choice}
      styles={{ overlay: (base) => ({ ...base, height: "100vh" }) }}
    >
      {children}
    </LoadingOverlay>
  );
};

export default LoadingSpinner;
