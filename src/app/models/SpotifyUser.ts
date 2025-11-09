import { SpotifyImage } from "./SpotifyImage";
import { ExternalUrls } from "./ExternalUrls";

export interface SpotifyUser {
  id: string;
  display_name: string;
  email?: string;
  images: SpotifyImage[];
  followers?: {
    total: number;
  };
  uri: string;
  external_urls: ExternalUrls;
}