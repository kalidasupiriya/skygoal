import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const logoutUser = async () => {
  try {
    await axios.post(
      `${API_BASE_URL}/users/logout`,
      {},
      { withCredentials: true }
    );
  } catch (error) {
    // ignore error
  }
};
