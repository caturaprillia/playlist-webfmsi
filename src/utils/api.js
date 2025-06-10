const BASE_URL = 'https://webfmsi.singapoly.com/api/playlist';

export const playlistService = {
  // Get all playlists
  getAllPlaylists: async () => {
    try {
      const response = await fetch(`${BASE_URL}/37`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching playlists:', error);
      throw error;
    }
  },

  // Create new playlist
  createPlaylist: async (formData) => {
    try {
      const response = await fetch(`${BASE_URL}/37`, {
        method: 'POST',
        body: formData,
      });
      return await response.json();
    } catch (error) {
      console.error('Error creating playlist:', error);
      throw error;
    }
  },

  // Update playlist
  updatePlaylist: async (id, formData) => {
    try {
      const response = await fetch(`${BASE_URL}/update/${id}`, {
        method: 'POST',
        body: formData,
      });
      return await response.json();
    } catch (error) {
      console.error('Error updating playlist:', error);
      throw error;
    }
  },

  // Delete playlist
  deletePlaylist: async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'DELETE',
      });
      return await response.json();
    } catch (error) {
      console.error('Error deleting playlist:', error);
      throw error;
    }
  },
}; 