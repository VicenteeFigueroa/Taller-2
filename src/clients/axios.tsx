import axios from 'axios';

const ApiBackend = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json, text/plain, */*",
  },
  withCredentials: true,
});

export {ApiBackend};