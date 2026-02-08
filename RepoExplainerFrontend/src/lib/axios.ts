// src/lib/axios.ts

import axios from "axios";

// Point directly to your local backend port
const API_URL = "https://tambobackend-topaz.vercel.app/"; 

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Required for cookies
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;