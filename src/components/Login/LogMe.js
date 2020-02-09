import React from "react";

import { form, heading, input, button, buttons } from "./styles.module.scss";

const Login = ({ onSubmit }) => {
  const [username, setUsername] = React.useState("");

  return (
    <form className={form}>
      <h2 className={heading}>Spies With Codes</h2>
      <input
        className={input}
        placeholder="username"
        onChange={e => setUsername(e.target.value)}
      />
      <button
        className={[button, buttons].join(" ")}
        onClick={e => {
          e.preventDefault();
          onSubmit(username, "full");
        }}
      >
        Full View
      </button>
      <button
        className={[button, buttons].join(" ")}
        onClick={e => {
          e.preventDefault();
          onSubmit(username, "cards");
        }}
      >
        Cards View
      </button>
      <button
        className={[button, buttons].join(" ")}
        onClick={e => {
          e.preventDefault();
          onSubmit(username, "overwatch");
        }}
      >
        Overwatch View
      </button>
    </form>
  );
};

export default Login;
