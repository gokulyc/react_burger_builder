import axios from "axios";
// import dotenvInit from "./config_env";
// console.log("Debug 1: "+process.env.REACT_APP_FIREBASE_BASE_URL);
const instance = axios.create({
    baseURL:process.env.REACT_APP_FIREBASE_BASE_URL,
});

export default instance;