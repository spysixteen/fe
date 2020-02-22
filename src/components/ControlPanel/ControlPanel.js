import React from "react";

import SpyCard from "../SpyCard/SpyCard";
import "./styles.scss";

const ControlPanel = props => {
  const {
    user,
    noOverwatch,
    getSpyCard,
    confirmSpyCard,
    spyCard,
    overwatch,
    getCards,
    confirmCards,
    ready,
    game,
    startGame,
    revealCard,
    resetAll
  } = props;

  const readyToStart = () =>
    ready.cards && ready.spyCard && ready.overwatch === 2;

  const cardsView = () => {
    if (game !== "setup") return <div className="cards" />;
    else
      return (
        <div className="cards">
          <button className="buttons" disabled={ready.cards} onClick={getCards}>
            Shuffle Cards
          </button>
          <button
            className="buttons"
            disabled={ready.cards}
            onClick={confirmCards}
          >
            Confirm Current Cards
          </button>
        </div>
      );
  };

  const gameButtonsView = () => {
    const start = () => game === "setup" && readyToStart();
    const reveal = () => game === "gaming" && user.overwatch !== false;
    const finish = () => game === "finish";

    return (
      <div className="gamebuttons">
        {start() && (
          <button className="buttons" onClick={startGame}>
            Start The Game!
          </button>
        )}
        {reveal() && (
          <button className="buttons" onClick={revealCard}>
            Reveal Selected Card
          </button>
        )}
        {finish() && (
          <button className="buttons" onClick={resetAll}>
            Reset the game!
          </button>
        )}
      </div>
    );
  };

  const overwatchView = () => {
    const spyCardView = () =>
      user.overwatch && (
        <>
          <div className="spycard">
            <SpyCard spyCard={spyCard} />
          </div>
          {game === "setup" && (
            <div className="spybuttons">
              <button
                className="buttons"
                disabled={ready.spyCard}
                onClick={getSpyCard}
              >
                New Spy Card
              </button>
              <button
                className="buttons"
                disabled={ready.spyCard}
                onClick={confirmSpyCard}
              >
                Confirm Current Spy Card
              </button>
            </div>
          )}
        </>
      );

    const overwatchView = () => {
      if (game !== "setup") return;
      else
        return (
          <div className="overwatchcontainer">
            {user.overwatch ? (
              <button
                className="buttons overwatch"
                disabled={ready.spyCard}
                onClick={noOverwatch}
              >
                Relieve yourself from the Overwatch Role
              </button>
            ) : (
              <>
                <button
                  className="buttons overwatch"
                  disabled={ready.overwatch === 2}
                  id="true"
                  onClick={overwatch}
                >
                  Become the Blue Overwatch
                </button>
                <button
                  className="buttons overwatch"
                  disabled={ready.overwatch === 2}
                  id="false"
                  onClick={overwatch}
                >
                  Become the Red Overwatch
                </button>
              </>
            )}
          </div>
        );
    };
    return (
      <>
        {spyCardView()}
        {overwatchView()}
      </>
    );
  };

  return (
    <div className="controlpanel">
      {cardsView()}
      {gameButtonsView()}
      {overwatchView()}
    </div>
  );
};

export default ControlPanel;
