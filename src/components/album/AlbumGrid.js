import { Grid } from "@mui/material";
import AlbumCard from "./AlbumCard";
import { Fragment } from "react";

export default function AlbumGrid({ albums, openFormHandler, onChangeAlbumToDeleteHandler, onAlbumClick }) {
  return (
    <Fragment>
      {albums.map((album) => (
        <Grid key={album.id} item>
          <AlbumCard
            album={album}
            openFormHandler={openFormHandler}
            onChangeAlbumToDeleteHandler={onChangeAlbumToDeleteHandler}
            onAlbumClick={onAlbumClick} // Pass the onAlbumClick prop
          />
        </Grid>
      ))}
    </Fragment>
  );
}
