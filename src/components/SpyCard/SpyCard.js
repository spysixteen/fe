import React from "react";

import SpyTile from "./SpyTile";

import { spygrid } from "./styles.module.scss";

const SpyCard = props => {
  const tiles =
    props.spyCard && props.spyCard.length === 25
      ? props.spyCard
      : new Array(25).fill(0).map((tile, id) => ({ tile, id }));

  return (
    <div className={spygrid}>
      {tiles.map(tile => (
        <SpyTile key={tile.id} tile={tile} />
      ))}
    </div>
  );
};

export default SpyCard;
