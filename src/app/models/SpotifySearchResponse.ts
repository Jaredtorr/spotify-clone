import { SpotifyTrack } from "./SpotifyTrack";
import { SpotifyArtist } from "./SpotifyArtist";
import { SpotifyAlbum } from "./SpotifyAlbum";
import { SpotifyPlaylist } from "./SpotifyPlaylist";

export interface SpotifySearchResponse {
  tracks?: {
    items: SpotifyTrack[];
    total: number;
  };
  artists?: {
    items: SpotifyArtist[];
    total: number;
  };
  albums?: {
    items: SpotifyAlbum[];
    total: number;
  };
  playlists?: {
    items: SpotifyPlaylist[];
    total: number;
  };
}