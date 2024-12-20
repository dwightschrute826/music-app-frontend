import "./App.css";
import SearchAppBar from "./components/layout/SearchAppBar";
import {
  Box,
  ThemeProvider,
  Backdrop,
  TextField,
  Button,
  Typography,
} from "@mui/material";
import AlbumPage from "./components/pages/AlbumPage";
import SongManager from "./components/pages/SongManager";
import { mainDarkTheme } from "./components/theme/mainDarkTheme";
import { useState, useEffect } from "react";
import axios from "axios";

const ALBUM_URL = "/api/v1/album";

function App() {
  const [albums, setAlbums] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [reload, setReload] = useState(true);
  const [selectedAlbumId, setSelectedAlbumId] = useState(null);

  const reloadNow = () => {
    setReload(true);
    setSearchValue("");
  };

  const onChangeSearchHandler = (event) => {
    setSearchValue(event.target.value);

    if (event.target.value.trim() === "") {
      reloadNow();
    }
  };

  const onKeyDownSearchHandler = (event) => {
    if (event.key === "Enter") {
      searchAlbums();
    }
  };

  useEffect(() => {
    if (reload === true) {
      getAllAlbums();
      setReload(false);
    }
  }, [reload]);

  const getAllAlbums = () => {
    axios
      .get(`${ALBUM_URL}/all`)
      .then((response) => {
        let data = response.data;
        setAlbums(data);
      })
      .catch((error) => {
        console.log("error: " + error);
      });
  };

  const searchAlbums = () => {
    axios
      .get(`${ALBUM_URL}/search/${searchValue}`)
      .then((response) => {
        let data = response.data;
        setAlbums(data);
      })
      .catch((error) => {
        console.log("error: " + error);
      });
  };

  const handleAlbumSelect = (albumId) => {
    setSelectedAlbumId(albumId);
  };

  return (
    <ThemeProvider theme={mainDarkTheme}>
      <SearchAppBar
        value={searchValue}
        onChange={onChangeSearchHandler}
        onKeyDown={onKeyDownSearchHandler}
      />
      <Box component="main" sx={{ m: 5 }}>
        <AlbumPage albums={albums} reload={reloadNow} onAlbumSelect={handleAlbumSelect} />
        {selectedAlbumId && (
          <SongManager albumId={selectedAlbumId} reloadAlbumSongs={reloadNow} />
        )}
      </Box>
      <Backdrop
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={false}
      >
        <Box
          sx={{
            bgcolor: "#FFFFFF",
            p: 3,
            borderRadius: "10px",
            maxWidth: "275px",
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
            Add new Song
          </Typography>
          <TextField
            required
            id="songTitle"
            label="Song Title"
            variant="outlined"
            error={null}
            helperText={null}
            value={null}
            onChange={null}
            fullWidth
          />

          <Button variant="contained" disableElevation fullWidth>
            Save
          </Button>
        </Box>
      </Backdrop>
    </ThemeProvider>
  );
}

export default App;
