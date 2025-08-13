import axios from "axios";
const API_BASE_URL = "http://localhost:5000/api/v1";

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
