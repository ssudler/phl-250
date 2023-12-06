import axios from 'axios';

export default function createPrintRequest(text) {
  return axios.post(`${process.env.STICKER_API_BASE_URL}/print`, { data: text })
    .catch(() => console.log('Attempted to print, request failed'));
}