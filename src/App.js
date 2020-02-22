import React from "react";
import io from "socket.io-client";
import { useLocation } from "react-router-dom";

import CardList from "./components/Cards/CardList";
import LogMe from "./components/Login/LogMe";
import ControlPanel from "./components/ControlPanel/ControlPanel";
import UserView from "./components/User/User";

function App() {
  const location = useLocation();
  const [roomID, setRoomID] = React.useState(location.pathname.slice(1));
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
    return { username: "", overwatch: false };
  });
  const [view, setView] = React.useState("login");

  // Needed for development to test on both phone and computer
  // Computer uses "localhost" while phone uses the computer's name
  // This makes sure we use the proper url no matter which device we use.
  const urlBase = window.location.href.replace(/:3000\/.*/, "") + ":2019";
  // const urlBase = "https://devwarr-spiesconnect.herokuapp.com/";
  console.log(location);

  React.useEffect(() => {
    if (!socket) setSocket(io.connect(urlBase));
    if (socket) {
      socket.on("loggedin", ({ user, roomID }) => {
        setUser(user);
        setRoomID(roomID);
        console.log(roomID);
      });
      socket.on("logagain", message => {
        setView("login");
        setUser({});
        console.log(message);
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

  const login = (userInfo, socketCommand) => {
    socket.emit(socketCommand, userInfo);
  };

  const overwatch = e => socket.emit("selectoverwatch", { roomID });
  const noOverwatch = () => socket.emit("nooverwatch", { roomID });

  const getCards = () => socket.emit("getcards", { roomID });
  const confirmCards = () => socket.emit("confirmcards", { roomID });

  const getSpyCard = () => socket.emit("getspycard", { roomID });
  const confirmSpyCard = () => socket.emit("confirmspycard", { roomID });

  const clickCard = _clickedCard =>
    socket.emit("clickcard", { roomID, _clickedCard });
  const revealCard = () => socket.emit("revealcard", { roomID });

  const startGame = () => socket.emit("startgame", { roomID });
  const resetAll = () => socket.emit("resetall", { roomID });

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
    </>
  );
  const cardsView = () => (
    <CardList size="full" cards={cards} clickCard={clickCard} />
  );
  const overwatchView = () => <ControlPanel {...controlPanelProps} />;

  const loginView = () => (
    <LogMe
      onSubmit={login}
      setView={setView}
      isLogged={user.socketId}
      roomID={roomID}
    />
  );

  const switchView = () => {
    if (!user.socketId) return loginView();

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

  return <div className="App">{switchView()}</div>;
}

export default App;
