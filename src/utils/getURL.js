// Needed for development to test on both phone and computer
// Computer uses "localhost" while phone uses the computer's name
// This makes sure we connect to the proper back-end url
//     no matter which device we use.
const urlBase =
  process.env.REACT_APP_ENVIRONMENT === "production"
    ? "https://devwarr-spiesconnect.herokuapp.com/"
    : window.location.href.replace(/:3000\/.*/, "") + ":2019";

export default urlBase;
