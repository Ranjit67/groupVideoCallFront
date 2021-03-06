import { useRef, useEffect, useState } from "react";
import io from "socket.io-client";
import { makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";
const useStyles = makeStyles((theme) => ({
  peerVideo: {
    [theme.breakpoints.up("md")]: {
      width: "360px",
      margin: "0 10px 15px 0",
    },
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      marginBottom: "20px",
    },
  },
  nameHoldDiv: {
    padding: "0 0 5px 20px",
  },
  disconnectBtn: {
    backgroundColor: "#ff7675",
  },
}));
const PeerVideo = (props) => {
  const ref = useRef();
  const socketRef = useRef();
  const [clientName, setclientName] = useState();
  const [host, sethost] = useState();
  const classes = useStyles();
  useEffect(() => {
    socketRef.current = io("https://groupvideocallapi.herokuapp.com/");
    props.peer.on("stream", (stream) => {
      ref.current.srcObject = stream;
    });

    socketRef.current.emit("request for name", { id: props.peerId });
    socketRef.current.on("client name", (name) => {
      // console.log(name.clientName);
      if (!name.clientName) {
        socketRef.current.emit("for room name", { id: props.peerId });
      } else {
        setclientName(name.clientName);
      }
    });
    socketRef.current.on("room name", (roomName) => {
      sethost(roomName.roomName);
    });
  }, []);

  return (
    <div style={{ display: "inline-block" }}>
      <div className={classes.nameHoldDiv}>
        {clientName && <h3>{clientName}</h3>}
        {host && <h1 style={{ color: "red" }}>{host}</h1>}
      </div>
      <div>
        <video
          playsInline
          autoPlay
          ref={ref}
          className={classes.peerVideo}
          width="360"
        />
      </div>
      {props.roomName && (
        <div>
          <Button
            variant="contained"
            className={classes.disconnectBtn}
            onClick={props.disconnect}
          >
            Disconnect
          </Button>
        </div>
      )}
    </div>
  );
};
export default PeerVideo;
