import apiConfig from "../../config/apiConfig";
const API_BASE_URL = apiConfig.updateStatusBaseUrl; // Replace with the actual base URL of your microservice

export const updatePlayareaStatus = async (playareaId, newStatus, comments) => {
  try {
    const response = await fetch(`${API_BASE_URL}/playarea-status/${playareaId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id: playareaId, status: newStatus, comments: comments })
    });
    console.log('reesponse ',response);
    if (!response.ok) throw new Error('Network response was not ok.');
    return await response.json();
  } catch (error) {
    console.error('There has been a problem with your fetch operation:', error);
    throw error;
  }
};
