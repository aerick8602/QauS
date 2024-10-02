import axios from 'axios';

const API_URL = 'https://api.quicksell.co/v1/internal/frontend-assignment';

export const fetchTickets = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
    // console.log(response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error fetching data", error.response?.data || error.message);
      throw new Error(`Network Error: ${error.message}`);
    } else {
      console.error("Unexpected error:", error);
      throw new Error("An unexpected error occurred");
    }
  }
};
