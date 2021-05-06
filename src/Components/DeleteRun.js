import React, { useEffect, useState } from "react";
import "../Styles/app.scss";

import { useHistory } from "react-router-dom";

import { retrieveRuns } from "../Functions/RetrieveRuns";
import { deleteRun } from "../Functions/MainApiCalls";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import { useAuth } from "../Contexts/Auth";
const DeleteRun = (props) => {
  const history = useHistory();
  const [runIdList, setRunIdList] = useState();
  const [run, setRun] = useState();
  const { fetchUserData, currentUser, userData } = useAuth();
  const setStates = (vals) => {
    setRunIdList(vals[0]);
    let runData = vals[1][vals[1].length - 1];
    ////console.log(runData);
    setRun(runData);
  };

  const start = async () => {
    if (userData == null) {
      await fetchUserData(currentUser.uid);

      return;
    }

    await retrieveRuns(props, userData, setStates, history);
  };
  useEffect(() => {
    start();
  }, [userData]);

  if (run == undefined) {
    return <h1>Loading</h1>;
  }

  const attemptDelete = async (id) => {
    props.setLoading(true);
    await deleteRun(id, currentUser.uid, props.toast);
    await start();
    props.setLoading(false);
  };
  return (
    <div>
      {runIdList.map((run) => (
        <p
          onClick={() => {
            confirmAlert({
              title: "Confirm to submit",
              message: "Are you sure to do this.",
              buttons: [
                {
                  label: "Yes",
                  onClick: () => attemptDelete(run),
                },
                {
                  label: "No",
                },
              ],
            });
          }}
          style={{ background: "#282828", cursor: "pointer" }}
        >
          {run.split("T")[0]}
          <br />
          {run.split("T")[1].split(".")[0]}
        </p>
      ))}
    </div>
  );
};

export default DeleteRun;
