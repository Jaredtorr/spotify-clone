import { SpotifyImage } from "./SpotifyImage";
import { SpotifyUser } from "./SpotifyUser";
import { PlaylistTrack } from "./PlaylistTrack";
import { ExternalUrls } from "./ExternalUrls";

export interface SpotifyPlaylist {
  id: string;
  name: string;
  description: string;
  images: SpotifyImage[];
  owner: SpotifyUser;
  tracks: {
    total: number;
    items: PlaylistTrack[];
  };
  uri: string;
  external_urls: ExternalUrls;
}