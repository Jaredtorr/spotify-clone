import { SpotifyTrack } from "./SpotifyTrack";
import { SpotifyDevice } from "./SpotifyDevice";

export interface SpotifyPlaybackState {
  is_playing: boolean;
  progress_ms: number;
  item: SpotifyTrack;
  device: SpotifyDevice;
  shuffle_state: boolean;
  repeat_state: 'off' | 'track' | 'context';
}
