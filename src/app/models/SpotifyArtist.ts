import { ExternalUrls } from "./ExternalUrls";
import { SpotifyImage } from "./SpotifyImage";

export interface SpotifyArtist {
  id: string;
  name: string;
  uri: string;
  external_urls: ExternalUrls;
  images?: SpotifyImage[];
  genres?: string[];
  followers?: {
    total: number;
  };
}