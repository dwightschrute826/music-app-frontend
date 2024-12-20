import React, { useState, useEffect, useCallback } from "react";
import { Box, Button, TextField, Typography} from "@mui/material";
import axios from "axios";

const SONG_URL = "/api/v1/song";

const SongManager = ({ albumId, reloadAlbumSongs }) => {
  const [songs, setSongs] = useState([]);
  const [newSong, setNewSong] = useState({ title: "", albumId });
  console.log("Initial newSong state:", newSong); 
  const [editingSongId, setEditingSongId] = useState(null);

  // Fetch songs by album
  const fetchSongsByAlbum = useCallback(() => {
    if (!albumId) return;
    axios
      .get(`${SONG_URL}/all`, { params: {albumId : albumId } })
      .then((response) => {
        setSongs(response.data);
      })
      .catch((error) => {
        console.error("Error fetching songs:", error);
      });
  }, [albumId]);

  
useEffect(() => {
    console.log("Current albumId:", albumId); // Log the albumId when component mounts or changes
    fetchSongsByAlbum();
  }, [fetchSongsByAlbum, albumId]); // Dependency on albumId to trigger useEffect when it changes


  // Handle add song
  const handleAddSong = () => {
    const songData = { ...newSong, albumId };
    console.log("Adding song with data:", songData); 
    axios
      .post(`${SONG_URL}/add`, songData)
      .then(() => {
        fetchSongsByAlbum();
        reloadAlbumSongs();
        setNewSong({ title: ""});
      })
      .catch((error) => {
        console.error("Error adding song:", error);
      });
  };

  // Handle update song
  const handleUpdateSong = () => {
    axios
      .put(`${SONG_URL}/update/${editingSongId}`, newSong)
      .then(() => {
        fetchSongsByAlbum();
        reloadAlbumSongs();
        setEditingSongId(null);
        setNewSong({ title: "" });
      })
      .catch((error) => {
        console.error("Error updating song:", error);
      });
  };

  // Handle delete song
  const handleDeleteSong = (id) => {
    axios
      .post(`${SONG_URL}/delete/${id}`)
      .then(() => {
        fetchSongsByAlbum();
        reloadAlbumSongs();
      })
      .catch((error) => {
        console.error("Error deleting song:", error);
      });
  };

  return (
    <Box sx={{ color: "#FFFFFF" }}>
      <Typography variant="h5" sx={{ mb: 2, color: "#FFFFFF", mt:10 }}>
        Manage Songs for Album: {albumId}
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ color: "#CCCCCC" }}>
          Add / Update Song
        </Typography>
        <TextField
          label="Song Title"
          fullWidth
          value={newSong.title}
          onChange={(e) => setNewSong({ ...newSong, title: e.target.value })}
          sx={{
            mb: 2,
            "& .MuiInputBase-root": { color: "#FFFFFF" },
            "& .MuiInputLabel-root": { color: "#CCCCCC" },
            "& .MuiOutlinedInput-notchedOutline": { borderColor: "#666666" },
          }}
        />

        <Button
          variant="contained"
          onClick={editingSongId ? handleUpdateSong : handleAddSong}
          sx={{
            mr: 2,
            backgroundColor: "#1976D2",
            "&:hover": { backgroundColor: "#125A9C" },
          }}
        >
          {editingSongId ? "Update Song" : "Add Song"}
        </Button>
        {editingSongId && (
          <Button
            variant="outlined"
            onClick={() => {
              setEditingSongId(null);
              setNewSong({ title: "" });
            }}
            sx={{ borderColor: "#CCCCCC", color: "#CCCCCC" }}
          >
            Cancel
          </Button>
        )}
      </Box>

      <Typography variant="h6" sx={{ color: "#CCCCCC" }}>
        Song List
      </Typography>
      {songs.length > 0 ? (
        songs.map((song) => (
          <Box
            key={song.id}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
              p: 2,
              backgroundColor: "#333333",
              color: "#FFFFFF",
              borderRadius: "8px",
            }}
          >
            <Box>
              <Typography variant="body1" sx={{ color: "#FFFFFF" }}>
                {song.title}
              </Typography>
            </Box>
            <Box>
              <Button
                variant="outlined"
                onClick={() => {
                  setEditingSongId(song.id);
                  setNewSong({ title: song.title });
                }}
                sx={{
                  borderColor: "#1976D2",
                  color: "#1976D2",
                  "&:hover": { backgroundColor: "#125A9C", color: "#FFFFFF" },
                }}
              >
                Edit
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => handleDeleteSong(song.id)}
                sx={{ ml: 1 }}
              >
                Delete
              </Button>
            </Box>
          </Box>
        ))
      ) : (
        <Typography sx={{ color: "#CCCCCC" }}>
          No songs available for this album.
        </Typography>
      )}
    </Box>
  );
};

export default SongManager;
