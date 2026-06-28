import axios from "axios";

const API = "http://localhost:5001/api/library";

export const getLibraryHealth = () =>
  axios.get(`${API}/health`);

export const verifyLibrary = () =>
  axios.post(`${API}/verify`);