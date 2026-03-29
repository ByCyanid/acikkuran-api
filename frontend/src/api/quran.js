import axios from 'axios';

const API_BASE_URL = 'http://localhost:3112';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const fetchAuthors = async () => {
  const response = await api.get('/authors');
  return response.data.data;
};

export const fetchSurahs = async () => {
  const response = await api.get('/surahs');
  return response.data.data;
};

export const fetchPage = async (pageNumber, authorId) => {
  const response = await api.get(`/page/${pageNumber}?author=${authorId}`);
  return response.data.data;
};

export const fetchSurah = async (surahId, authorId = 105) => {
  const response = await api.get(`/surah/${surahId}?author=${authorId}`);
  return response.data.data;
};

export default api;
