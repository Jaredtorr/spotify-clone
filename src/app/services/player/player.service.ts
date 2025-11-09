import { Injectable } from '@angular/core';
import { BehaviorSubject, interval, firstValueFrom } from 'rxjs';
import { SpotifyTrack } from '../../models/SpotifyTrack';
import { SpotifyService } from '../spotify/spotify.service';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private currentTrack$ = new BehaviorSubject<SpotifyTrack | null>(null);
  private isPlaying$ = new BehaviorSubject<boolean>(false);
  private progress$ = new BehaviorSubject<number>(0);
  private currentTime$ = new BehaviorSubject<number>(0);
  private hasActiveDevice$ = new BehaviorSubject<boolean>(false);
  private deviceCheckInProgress = false;

  currentTrack = this.currentTrack$.asObservable();
  isPlaying = this.isPlaying$.asObservable();
  progress = this.progress$.asObservable();
  currentTime = this.currentTime$.asObservable();
  hasActiveDevice = this.hasActiveDevice$.asObservable();

  private progressInterval: any;

  constructor(private spotifyService: SpotifyService) {
    this.isPlaying.subscribe(playing => {
      if (playing) {
        this.startProgressTracking();
      } else {
        this.stopProgressTracking();
      }
    });

    // Verificar dispositivos cada 30 segundos
    interval(30000).subscribe(() => this.checkDevices());
  }

  /**
   * Verifica si hay dispositivos activos disponibles
   */
  async checkDevices(): Promise<boolean> {
    if (this.deviceCheckInProgress) return this.hasActiveDevice$.value;
    
    this.deviceCheckInProgress = true;
    
    try {
      const devices = await firstValueFrom(this.spotifyService.getDevices());
      const hasActive = devices?.devices?.some((d: any) => d.is_active) || false;
      this.hasActiveDevice$.next(hasActive);
      this.deviceCheckInProgress = false;
      
      console.log(`📱 Dispositivos activos: ${hasActive ? 'Sí' : 'No'}`);
      if (devices?.devices?.length > 0) {
        console.log('Dispositivos disponibles:', devices.devices.map((d: any) => d.name));
      }
      
      return hasActive;
    } catch (error) {
      console.error('Error al verificar dispositivos:', error);
      this.hasActiveDevice$.next(false);
      this.deviceCheckInProgress = false;
      return false;
    }
  }

  /**
   * Reproduce una canción (verifica dispositivos primero)
   */
  async playTrack(track: SpotifyTrack): Promise<void> {
    this.currentTrack$.next(track);
    this.currentTime$.next(0);
    this.progress$.next(0);

    // Verificar dispositivos antes de intentar reproducir
    const hasDevice = await this.checkDevices();
    
    if (!hasDevice) {
      console.warn('⚠️ No hay dispositivos de Spotify activos. Reproducción simulada.');
      // Simular reproducción local
      this.isPlaying$.next(true);
      return;
    }

    this.spotifyService.play(track.uri).subscribe({
      next: () => {
        this.isPlaying$.next(true);
        console.log('✅ Reproduciendo en Spotify:', track.name);
      },
      error: (err) => {
        if (err.status === 404) {
          console.warn('⚠️ Error 404: No hay dispositivos activos');
          this.hasActiveDevice$.next(false);
        } else {
          console.error('❌ Error al reproducir:', err);
        }
        // Simular reproducción local de todas formas
        this.isPlaying$.next(true);
      }
    });
  }

  togglePlay(): void {
    const playing = this.isPlaying$.value;
    
    if (playing) {
      this.spotifyService.pause().subscribe({
        next: () => this.isPlaying$.next(false),
        error: () => this.isPlaying$.next(false)
      });
    } else {
      const track = this.currentTrack$.value;
      if (track) {
        this.spotifyService.play(track.uri).subscribe({
          next: () => this.isPlaying$.next(true),
          error: () => this.isPlaying$.next(true)
        });
      }
    }
  }

  nextTrack(): void {
    this.spotifyService.next().subscribe({
      next: () => console.log('⏭️ Siguiente canción'),
      error: (err) => console.error('Error al cambiar canción:', err)
    });
  }

  previousTrack(): void {
    this.spotifyService.previous().subscribe({
      next: () => console.log('⏮️ Canción anterior'),
      error: (err) => console.error('Error al cambiar canción:', err)
    });
  }

  private startProgressTracking(): void {
    this.stopProgressTracking();
    
    this.progressInterval = setInterval(() => {
      const track = this.currentTrack$.value;
      if (!track) return;

      const current = this.currentTime$.value;
      const newTime = current + 1000;

      if (newTime >= track.duration_ms) {
        this.isPlaying$.next(false);
        this.currentTime$.next(0);
        this.progress$.next(0);
      } else {
        this.currentTime$.next(newTime);
        this.progress$.next((newTime / track.duration_ms) * 100);
      }
    }, 1000);
  }

  private stopProgressTracking(): void {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
    }
  }

  getCurrentTrack(): SpotifyTrack | null {
    return this.currentTrack$.value;
  }

  getIsPlaying(): boolean {
    return this.isPlaying$.value;
  }

  getHasActiveDevice(): boolean {
    return this.hasActiveDevice$.value;
  }
}