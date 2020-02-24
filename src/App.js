import React from "react";
import io from "socket.io-client";
import { useLocation } from "react-router-dom";
import urlBase from "./utils/getURL";

import CardList from "./components/Cards/CardList";
import LogMe from "./components/Login/LogMe";
import ControlPanel from "./components/ControlPanel/ControlPanel";
import UserView from "./components/User/User";

function App() {
  const location = useLocation();
  const [socket, setSocket] = React.useState();
  const [roomID, setRoomID] = React.useState(location.pathname.slice(1));
  const [ready, setReady] = React.useState({
    cards: false,
    spyCard: false,
    overwatch: 0
  });
  const [cards, setCards] = React.useState([]);
  const [spyCard, setSpyCard] = React.useState([]);
  const [game, setGame] = React.useState("login");
  const [user, setUser] = React.useState({});
  const [view, setView] = React.useState("login");
  /*
  =========================================================
  Object Structure:

  enum cardType {
    civilian:  0
    blue:      1
    red:       2
    assassin:  3
  }
  game = "login" | "setup" | "gaming" | "finish"
  view = "login" | "full"  | "cards"  | "overwatch"
  endGameVictor = 0 | 1 | 2

  user: {
    username:  string;
    socketId:  string;
    overwatch: 0|1|2
  }
  card: {
    id:        number;
    text:      string;
    spy:       0|1|2|3;
    clicked:   bool;
    revealed:  bool;
  }
  spyCardSquare: {
    id:        number;
    val:       0|1|2|3
  }

  =========================================================
  */

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

      socket.on("overwatchassigned", console.log);
      socket.on("newoverwatch", console.log);
      socket.on("assignedoverwatch", setUser);

      socket.on("gamefail", console.log);
      socket.on("gameinfo", info => {
        console.log(info);
        setCards(info.gameBoard);
        setSpyCard(info.spyCard);
        setGame(info.state);
        setReady({
          cards: info.lockCards,
          spyCard: info.lockSpyCard,
          overwatch: info.allUsers.reduce(
            (prev, curr) => (curr.overwatch ? ++prev : prev),
            0
          )
        });
      });
    }
  }, [socket]);

  const login = (userInfo, socketCommand) => {
    socket.emit(socketCommand, userInfo);
  };

  const overwatch = () => socket.emit("selectoverwatch", { roomID });
  const noOverwatch = () => socket.emit("nooverwatch", { roomID });

  const getCards = () => socket.emit("getcards", { roomID });
  const confirmCards = () => socket.emit("confirmcards", { roomID });

  const getSpyCard = () => socket.emit("getspycard", { roomID });
  const confirmSpyCard = () => socket.emit("confirmspycard", { roomID });

  const clickCard = clickedCard =>
    socket.emit("clickcard", { roomID, clickedCard });
  const revealCard = () => socket.emit("revealcard", { roomID });

  const startGame = () => socket.emit("startgame", { roomID });
  const resetAll = () => socket.emit("resetall", { roomID });

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
      location={location}
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
