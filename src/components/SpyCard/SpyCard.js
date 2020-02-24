import React from "react";

import SpyTile from "./SpyTile";

import { spygrid } from "./styles.module.scss";

const SpyCard = props => {
  const spyCard =
    props.spyCard && props.spyCard.length === 25
      ? props.spyCard
      : new Array(25).fill(0).map((spy, id) => ({ spy, id }));

  return (
    <div className={spygrid}>
      {spyCard.map(tile => (
        <SpyTile key={tile.id} tile={tile} />
      ))}
    </div>
  );
};

export default SpyCard;
