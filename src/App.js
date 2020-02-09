import React from "react";
import io from "socket.io-client";

import CardList from "./components/Cards/CardList";
import LogMe from "./components/Login/LogMe";
import ControlPanel from "./components/ControlPanel/ControlPanel";
import UserView from "./components/User/User";

function App() {
  const [socket, setSocket] = React.useState();
  const [ready, setReady] = React.useState({
    cards: false,
    spyCard: false,
    overwatch: 0
  });
  const [cards, setCards] = React.useState([]);
  const [spyCard, setSpyCard] = React.useState([]);
  const [game, setGame] = React.useState(false);
  const [user, setUser] = React.useState(() => {
    // const username = localStorage.getItem("username");
    // if (username) return { username, overwatch: false };
    // else
    return { username: "", overwatch: false };
  });
  const [logged, setLogged] = React.useState();
  const [view, setView] = React.useState("login");

  // Needed for development to test on both phone and computer
  // Computer uses "localhost" while phone uses the computer's name
  // This makes sure we use the proper url no matter which device we use.
  // const urlBase = window.location.href.replace(/:3000\/.*/, "") + ":2019";
  const urlBase = "https://devwarr-spiesconnect.herokuapp.com/";

  React.useEffect(() => {
    if (!socket) setSocket(io.connect(urlBase));
    if (socket) {
      socket.on("loggedin", username => {
        setUser({ username, overwatch: false });
        setLogged(true);
      });
      socket.on("logagain", logging => {
        setView("login");
        setLogged(logging);
        localStorage.clear();
      });
      socket.on("newuser", console.log);
      socket.on("serverping", () => socket.emit("clientpong"));
      socket.on("resetall", () => {
        setUser(oldUser => ({ ...oldUser, overwatch: false }));
      });

      socket.on("overwatchassigned", console.log);
      socket.on("newoverwatch", console.log);
      socket.on("assignedoverwatch", setUser);

      socket.on("newcards", setCards);
      socket.on("newspycard", setSpyCard);
      socket.on("securespycard", () => setSpyCard([]));

      socket.on("cardclicked", setCards);
      socket.on("cardrevealed", setCards);

      socket.on("gamefail", console.log);
      socket.on("gameinfo", info => {
        console.log(info);
        setCards(info.gameCards);
        setSpyCard(info.spyCard);
        setGame(info.state === "gaming");
        setReady({
          cards: info.lockCards,
          spyCard: info.lockSpyCard,
          overwatch: info.totalOverwatch
        });
      });
    }
  }, [socket, urlBase]);

  const login = (username, view) => {
    setView(view);
    socket.emit("login", username);
    console.log("time");
  };

  const overwatch = e =>
    socket.emit("selectoverwatch", {
      username: user.username,
      isBlue: e.target.id === "true"
    });
  const noOverwatch = () => socket.emit("nooverwatch", user);

  const getCards = () => socket.emit("getcards");
  const confirmCards = () => socket.emit("confirmcards");

  const getSpyCard = () => socket.emit("getspycard", user.username);
  const confirmSpyCard = () => socket.emit("confirmspycard", user.username);

  const clickCard = _clickedCard =>
    socket.emit("clickcard", { username: user.username, _clickedCard });
  const revealCard = () => socket.emit("revealcard", user.username);

  const startGame = () => socket.emit("startgame");
  const resetAll = () =>
    socket.emit("resetall", localStorage.getItem("password"));

  const readyToStart = () =>
    ready.cards && ready.spyCard && ready.overwatch === 2;

  const controlPanelProps = {
    user,
    ready,
    game,
    noOverwatch,
    getSpyCard,
    confirmSpyCard,
    spyCard,
    overwatch,
    getCards,
    confirmCards,
    readyToStart,
    startGame,
    revealCard,
    resetAll
  };

  const fullView = () => (
    <>
      <CardList size="half" cards={cards} clickCard={clickCard} />
      <ControlPanel {...controlPanelProps} />
      {/* <UserView user={user} /> */}
    </>
  );
  const cardsView = () => (
    <CardList size="full" cards={cards} clickCard={clickCard} />
  );
  const overwatchView = () => <ControlPanel {...controlPanelProps} />;

  const loginView = () => <LogMe onSubmit={login} />;

  const switchView = () => {
    switch (view) {
      case "cards":
        return cardsView();
      case "overwatch":
        return overwatchView();
      case "full":
        return fullView();
      case false:
      case "login":
      default:
        return loginView();
    }
  };

  return <div className="App">{logged ? switchView() : loginView()}</div>;
}

export default App;
