import React from "react";

import Card from "./Card";
import { cardfield, fullsize, halfsize } from "./styles.module.scss";

const CardList = ({ cards, clickCard, size }) => {
  const fullOrHalf = () => {
    if (size === "full") return [cardfield, fullsize].join(" ");
    else return [cardfield, halfsize].join(" ");
  };

  return (
    <div className={fullOrHalf()}>
      {cards.length > 0 &&
        cards.map(card => (
          <Card key={card.id} card={card} clickCard={clickCard} />
        ))}
    </div>
  );
};

export default CardList;
