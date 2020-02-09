import React from "react";

import {
  outercard,
  innercard,
  cardtext,
  clicked,
  revealed,
  blue,
  red,
  ass,
  none
} from "./styles.module.scss";

const Card = ({ card, clickCard }) => {
  const getColor = () => {
    if (card.spy === 1) return blue;
    if (card.spy === 2) return red;
    if (card.spy === 3) return ass;
    else return none;
  };

  const getClicked = () => (card.checked ? clicked : "");
  const getRevealed = () => (card.revealed ? revealed : "");

  return (
    <div
      className={[outercard, getColor(), getClicked()].join(" ")}
      onClick={() => clickCard(card)}
    >
      <div className={innercard}>
        <p className={[cardtext, getRevealed()].join(" ")}>{card.text}</p>
      </div>
    </div>
  );
};

export default Card;
