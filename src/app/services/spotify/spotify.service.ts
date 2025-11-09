import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../../environment/environment';
import { SpotifyAuthResponse } from '../../models/SpotifyAuthResponse';
import { SpotifyTrack } from '../../models/SpotifyTrack';
import { SpotifyArtist } from '../../models/SpotifyArtist';
import { SpotifyAlbum } from '../../models/SpotifyAlbum';
import { SpotifyPlaylist } from '../../models/SpotifyPlaylist';
import { SpotifySearchResponse } from '../../models/SpotifySearchResponse';
import { SpotifyPlaybackState } from '../../models/SpotifyPlaybackState';
import { SpotifyUser } from '../../models/SpotifyUser';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
  private accessToken$ = new BehaviorSubject<string | null>(null);
  private readonly TOKEN_KEY = 'spotify_access_token';
  private readonly TOKEN_EXPIRY_KEY = 'spotify_token_expiry';

  constructor(private http: HttpClient) {
    this.loadTokenFromStorage();
  }

  getAuthUrl(): string {
    const scopes = [
      'user-read-private',
      'user-read-email',
      'user-read-playback-state',
      'user-modify-playback-state',
      'user-read-currently-playing',
      'playlist-read-private',
      'playlist-read-collaborative',
      'user-library-read'
    ].join(' ');

    const params = new URLSearchParams({
      client_id: environment.spotify.clientId,
      response_type: 'code',
      redirect_uri: environment.spotify.redirectUri,
      scope: scopes,
      show_dialog: 'true'
    });

    return `${environment.spotify.authUrl}/authorize?${params.toString()}`;
  }

  getAccessToken(code: string): Observable<SpotifyAuthResponse> {
    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: environment.spotify.redirectUri,
      client_id: environment.spotify.clientId,
      client_secret: environment.spotify.clientSecret
    });

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    return this.http.post<SpotifyAuthResponse>(
      `${environment.spotify.authUrl}/api/token`,
      body.toString(),
      { headers }
    ).pipe(
      tap(response => this.saveToken(response)),
      catchError(this.handleError)
    );
  }

  refreshAccessToken(refreshToken: string): Observable<SpotifyAuthResponse> {
    const body = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: environment.spotify.clientId,
      client_secret: environment.spotify.clientSecret
    });

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    return this.http.post<SpotifyAuthResponse>(
      `${environment.spotify.authUrl}/api/token`,
      body.toString(),
      { headers }
    ).pipe(
      tap(response => this.saveToken(response)),
      catchError(this.handleError)
    );
  }

  private saveToken(authResponse: SpotifyAuthResponse): void {
    const expiryTime = Date.now() + (authResponse.expires_in * 1000);
    localStorage.setItem(this.TOKEN_KEY, authResponse.access_token);
    localStorage.setItem(this.TOKEN_EXPIRY_KEY, expiryTime.toString());
    this.accessToken$.next(authResponse.access_token);
  }

  private loadTokenFromStorage(): void {
    const token = localStorage.getItem(this.TOKEN_KEY);
    const expiry = localStorage.getItem(this.TOKEN_EXPIRY_KEY);

    if (token && expiry && Date.now() < parseInt(expiry)) {
      this.accessToken$.next(token);
    } else {
      this.clearToken();
    }
  }

  clearToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.TOKEN_EXPIRY_KEY);
    this.accessToken$.next(null);
  }

  isAuthenticated(): boolean {
    return this.accessToken$.value !== null;
  }

  private getHeaders(): HttpHeaders {
    const token = this.accessToken$.value;
    if (!token) {
      throw new Error('No access token available');
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  search(query: string, types: string[] = ['track', 'artist', 'album']): Observable<SpotifySearchResponse> {
    const params = new HttpParams()
      .set('q', query)
      .set('type', types.join(','))
      .set('limit', '20');

    return this.http.get<SpotifySearchResponse>(
      `${environment.spotify.apiUrl}/search`,
      { headers: this.getHeaders(), params }
    ).pipe(catchError(this.handleError));
  }

  getTrack(trackId: string): Observable<SpotifyTrack> {
    return this.http.get<SpotifyTrack>(
      `${environment.spotify.apiUrl}/tracks/${trackId}`,
      { headers: this.getHeaders() }
    ).pipe(catchError(this.handleError));
  }

  getTracks(trackIds: string[]): Observable<{ tracks: SpotifyTrack[] }> {
    const params = new HttpParams().set('ids', trackIds.join(','));
    return this.http.get<{ tracks: SpotifyTrack[] }>(
      `${environment.spotify.apiUrl}/tracks`,
      { headers: this.getHeaders(), params }
    ).pipe(catchError(this.handleError));
  }

  getAlbum(albumId: string): Observable<SpotifyAlbum> {
    return this.http.get<SpotifyAlbum>(
      `${environment.spotify.apiUrl}/albums/${albumId}`,
      { headers: this.getHeaders() }
    ).pipe(catchError(this.handleError));
  }

  getAlbumTracks(albumId: string): Observable<{ items: SpotifyTrack[] }> {
    return this.http.get<{ items: SpotifyTrack[] }>(
      `${environment.spotify.apiUrl}/albums/${albumId}/tracks`,
      { headers: this.getHeaders() }
    ).pipe(catchError(this.handleError));
  }

  getArtist(artistId: string): Observable<SpotifyArtist> {
    return this.http.get<SpotifyArtist>(
      `${environment.spotify.apiUrl}/artists/${artistId}`,
      { headers: this.getHeaders() }
    ).pipe(catchError(this.handleError));
  }

  getArtistTopTracks(artistId: string, market: string = 'US'): Observable<{ tracks: SpotifyTrack[] }> {
    const params = new HttpParams().set('market', market);
    return this.http.get<{ tracks: SpotifyTrack[] }>(
      `${environment.spotify.apiUrl}/artists/${artistId}/top-tracks`,
      { headers: this.getHeaders(), params }
    ).pipe(catchError(this.handleError));
  }

  getArtistAlbums(artistId: string): Observable<{ items: SpotifyAlbum[] }> {
    return this.http.get<{ items: SpotifyAlbum[] }>(
      `${environment.spotify.apiUrl}/artists/${artistId}/albums`,
      { headers: this.getHeaders() }
    ).pipe(catchError(this.handleError));
  }

  getUserPlaylists(limit: number = 20): Observable<{ items: SpotifyPlaylist[] }> {
    const params = new HttpParams().set('limit', limit.toString());
    return this.http.get<{ items: SpotifyPlaylist[] }>(
      `${environment.spotify.apiUrl}/me/playlists`,
      { headers: this.getHeaders(), params }
    ).pipe(catchError(this.handleError));
  }

  getPlaylist(playlistId: string): Observable<SpotifyPlaylist> {
    return this.http.get<SpotifyPlaylist>(
      `${environment.spotify.apiUrl}/playlists/${playlistId}`,
      { headers: this.getHeaders() }
    ).pipe(catchError(this.handleError));
  }

  getCurrentUser(): Observable<SpotifyUser> {
    return this.http.get<SpotifyUser>(
      `${environment.spotify.apiUrl}/me`,
      { headers: this.getHeaders() }
    ).pipe(catchError(this.handleError));
  }

  getCurrentPlayback(): Observable<SpotifyPlaybackState> {
    return this.http.get<SpotifyPlaybackState>(
      `${environment.spotify.apiUrl}/me/player`,
      { headers: this.getHeaders() }
    ).pipe(catchError(this.handleError));
  }

  // ✅ NUEVOS MÉTODOS AGREGADOS
  
  /**
   * Obtiene la lista de dispositivos disponibles
   */
  getDevices(): Observable<any> {
    return this.http.get(
      `${environment.spotify.apiUrl}/me/player/devices`,
      { headers: this.getHeaders() }
    ).pipe(catchError(this.handleError));
  }

  /**
   * Transfiere la reproducción a un dispositivo específico
   */
  transferPlayback(deviceId: string, play: boolean = true): Observable<void> {
    const body = {
      device_ids: [deviceId],
      play: play
    };
    
    return this.http.put<void>(
      `${environment.spotify.apiUrl}/me/player`,
      body,
      { headers: this.getHeaders() }
    ).pipe(catchError(this.handleError));
  }

  play(uri?: string, deviceId?: string): Observable<void> {
    const body = uri ? { uris: [uri] } : {};
    const params = deviceId ? new HttpParams().set('device_id', deviceId) : undefined;
    
    return this.http.put<void>(
      `${environment.spotify.apiUrl}/me/player/play`,
      body,
      { headers: this.getHeaders(), params }
    ).pipe(catchError(this.handleError));
  }

  pause(): Observable<void> {
    return this.http.put<void>(
      `${environment.spotify.apiUrl}/me/player/pause`,
      {},
      { headers: this.getHeaders() }
    ).pipe(catchError(this.handleError));
  }

  next(): Observable<void> {
    return this.http.post<void>(
      `${environment.spotify.apiUrl}/me/player/next`,
      {},
      { headers: this.getHeaders() }
    ).pipe(catchError(this.handleError));
  }

  previous(): Observable<void> {
    return this.http.post<void>(
      `${environment.spotify.apiUrl}/me/player/previous`,
      {},
      { headers: this.getHeaders() }
    ).pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    console.error('Spotify API Error:', error);
    return throwError(() => error);
  }
}