import axios from "axios";

const API = "http://localhost:5001/api/songs";
const DOWNLOADS_API = "http://localhost:5001/api/downloads";

export const getSongs = () => axios.get(API);

export const getStats = () => axios.get(`${API}/stats`);

export const getMissingSongs = () =>
  axios.get(`${API}/missing`);

export const searchSongs = (query: string) =>
  axios.get(`${API}/search?q=${query}`);

export const getSongById = (songId: number) =>
  axios.get(`${API}/${songId}`);

export const updateSong = (songId: number, data: any) =>
  axios.put(`${API}/${songId}`, data);

export const deleteSong = (songId: number) =>
  axios.delete(`${API}/${songId}`);

export const queueSong = (songId: number) =>
  axios.post(`${DOWNLOADS_API}/queue/${songId}`);

export const queueMissingSongs = () =>
  axios.post(`${DOWNLOADS_API}/queue-missing`);

export const getDownloadStats = () =>
  axios.get(`${DOWNLOADS_API}/stats`);