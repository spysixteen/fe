import React from "react";

import {
  profilecontainer,
  username,
  playertype,
  red,
  blue,
  none
} from "./styles.module.scss";

const UserView = ({ user }) => {
  const player = user.overwatch ? `${user.overwatch} Overwatch` : "Player";
  const getColor = () => {
    if (user.overwatch === "blue") return blue;
    if (user.overwatch === "red") return red;
    else return none;
  };

  return (
    <div className={[profilecontainer, getColor()].join(" ")}>
      <h2 className={username}>{user.username}</h2>
      <p className={playertype}>{player}</p>
    </div>
  );
};

export default UserView;
