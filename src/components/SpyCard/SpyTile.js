import React from "react";

import { border, blue, red, ass, none, tilestyle } from "./styles.module.scss";

const SpyTile = props => {
  const tile = props.tile.tile;

  const getTileType = () => {
    if (tile === 1) return blue;
    if (tile === 2) return red;
    if (tile === 3) return ass;
    else return none;
  };

  return (
    <div className={border}>
      <div className={[tilestyle, getTileType()].join(" ")} />
    </div>
  );
};

export default SpyTile;
