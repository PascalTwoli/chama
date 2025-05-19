// export default function handleJoinChama(chamaId: string): void {
//     console.log(`Joining chama: ${chamaId}`);
//     // TODO: Implement actual logic, e.g., navigation or state update
// }

// export default function handleCreateChama = () => {
//     console.log("Opening create chama modal");
//     // TODO: Implement actual modal opening logic
// };

import axios from 'axios';

const API_BASE = '/api/chamas'; // Adjust if needed

export const getUserChamas = async () => {
  const res = await axios.get(`${API_BASE}/user`);
  return res.data;
};

export const createChama = async (data: FormData) => {
  const res = await axios.post(`${API_BASE}/create`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

export const joinChama = async (chamaId: string) => {
  const res = await axios.post(`${API_BASE}/${chamaId}/join`);
  return res.data;
};