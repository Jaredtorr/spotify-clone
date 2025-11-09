import { SpotifyImage } from "./SpotifyImage";
import { SpotifyArtist } from "./SpotifyArtist";
import { ExternalUrls } from "./ExternalUrls";
import { SpotifyTrack } from "./SpotifyTrack";

export interface SpotifyAlbum {
  id: string;
  name: string;
  album_type: 'album' | 'single' | 'compilation';
  release_date: string;
  total_tracks: number;
  uri: string;
  images: SpotifyImage[];
  artists: SpotifyArtist[];
  external_urls: ExternalUrls;
  tracks?: {
    items: SpotifyTrack[];
  };
}