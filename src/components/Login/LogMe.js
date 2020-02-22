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
  createbutton
} from "./styles.module.scss";

const Login = ({ onSubmit, setView, isLogged, roomID }) => {
  const [username, setUsername] = React.useState("");
  const [_gameRoom, setGameRoom] = React.useState(roomID);

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
      <div>
        <p>Play with friends!</p>
        <p>{window.location.href + _gameRoom}</p>
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
