import { SpotifyArtist } from "./SpotifyArtist";
import { SpotifyAlbum } from "./SpotifyAlbum";
import { ExternalUrls } from "./ExternalUrls";

export interface SpotifyTrack {
  id: string;
  name: string;
  duration_ms: number;
  explicit: boolean;
  preview_url: string | null;
  track_number: number;
  uri: string;
  artists: SpotifyArtist[];
  album: SpotifyAlbum;
  external_urls: ExternalUrls;
}