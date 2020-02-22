import React from "react";

import {
  form,
  heading,
  input,
  button,
  buttons,
  joincontainer,
  joininput,
  joinbutton,
  createbutton,
  sharediv,
  sharetop,
  sharebottom
} from "./styles.module.scss";

const Login = ({ onSubmit, setView, isLogged, roomID, location }) => {
  const [username, setUsername] = React.useState("");
  const [_gameRoom, setGameRoom] = React.useState(roomID);
  const shareableLink = location.pathname.slice(1)
    ? window.location.href.replace(location.pathname.slice(1), `${roomID}`)
    : window.location.href + roomID;

  const [copyMe, setCopyMe] = React.useState("Play with friends!");
  const copyRef = React.useRef(null);
  const copy = () => {
    copyRef.current.select();
    document.execCommand("copy");
    setCopyMe("Copied!");
  };

  const login = () => (
    <>
      <input
        className={input}
        value={username}
        placeholder="username"
        onChange={e => setUsername(e.target.value)}
      />
      <div className={joincontainer}>
        <input
          className={joininput}
          value={_gameRoom}
          placeholder="Game Room"
          onChange={e => setGameRoom(e.target.value)}
        />
        <button
          className={[buttons, joinbutton].join(" ")}
          onClick={e => {
            e.preventDefault();
            onSubmit({ username, roomID: _gameRoom }, "joinroom");
          }}
        >
          Join
        </button>
      </div>
      <button
        className={[button, buttons, createbutton].join(" ")}
        onClick={e => {
          e.preventDefault();
          onSubmit({ username }, "newroom");
        }}
      >
        Create Room
      </button>
    </>
  );

  const chooseView = () => (
    <>
      <button
        className={[button, buttons].join(" ")}
        onClick={e => {
          e.preventDefault();
          setView("full");
        }}
      >
        Full View
      </button>
      <button
        className={[button, buttons].join(" ")}
        onClick={e => {
          e.preventDefault();
          setView("cards");
        }}
      >
        Cards View
      </button>
      <button
        className={[button, buttons].join(" ")}
        onClick={e => {
          e.preventDefault();
          setView("overwatch");
        }}
      >
        Overwatch View
      </button>
      <div className={[button, buttons, sharediv].join(" ")} onClick={copy}>
        <p className={sharetop}>{copyMe}</p>
        <input
          className={sharebottom}
          ref={copyRef}
          value={shareableLink}
          readOnly
        />
      </div>
    </>
  );

  return (
    <form className={form}>
      <h2 className={heading}>Spies With Codes</h2>
      {isLogged ? chooseView() : login()}
    </form>
  );
};

export default Login;
