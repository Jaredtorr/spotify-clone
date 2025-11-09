import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { PlayerService } from '../../../services/player/player.service';
import { SpotifyTrack } from '../../../models/SpotifyTrack';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent implements OnInit, OnDestroy {
  currentTrack: SpotifyTrack | null = null;
  isPlaying: boolean = false;
  progress: number = 0;
  currentTimeMs: number = 0;
  hasActiveDevice: boolean = true;
  showDeviceWarning: boolean = false;
  
  private subscriptions = new Subscription();
  private warningTimeout: any;

  constructor(private playerService: PlayerService) {}

  ngOnInit(): void {
    // Suscribirse a los cambios del reproductor
    this.subscriptions.add(
      this.playerService.currentTrack.subscribe(track => {
        this.currentTrack = track;
      })
    );

    this.subscriptions.add(
      this.playerService.isPlaying.subscribe(playing => {
        this.isPlaying = playing;
      })
    );

    this.subscriptions.add(
      this.playerService.progress.subscribe(progress => {
        this.progress = progress;
      })
    );

    this.subscriptions.add(
      this.playerService.currentTime.subscribe(time => {
        this.currentTimeMs = time;
      })
    );

    // Mostrar advertencia cuando no hay dispositivos
    this.subscriptions.add(
      this.playerService.hasActiveDevice.subscribe(hasDevice => {
        this.hasActiveDevice = hasDevice;
        
        if (!hasDevice && this.isPlaying) {
          this.showWarning();
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    if (this.warningTimeout) {
      clearTimeout(this.warningTimeout);
    }
  }

  /**
   * Muestra advertencia temporal
   */
  private showWarning(): void {
    this.showDeviceWarning = true;
    
    if (this.warningTimeout) {
      clearTimeout(this.warningTimeout);
    }
    
    this.warningTimeout = setTimeout(() => {
      this.showDeviceWarning = false;
    }, 5000); // Ocultar después de 5 segundos
  }

  togglePlay(): void {
    this.playerService.togglePlay();
  }

  previousTrack(): void {
    this.playerService.previousTrack();
  }

  nextTrack(): void {
    this.playerService.nextTrack();
  }

  get currentTime(): string {
    return this.formatTime(this.currentTimeMs);
  }

  get duration(): string {
    if (!this.currentTrack) return '0:00';
    return this.formatTime(this.currentTrack.duration_ms);
  }

  get coverUrl(): string {
    if (!this.currentTrack) {
      return 'https://upload.wikimedia.org/wikipedia/en/f/f2/Taylor_Swift_-_Reputation.png';
    }
    return this.currentTrack.album.images[0]?.url || '';
  }

  get songTitle(): string {
    return this.currentTrack?.name || 'Selecciona una canción';
  }

  get artistName(): string {
    if (!this.currentTrack) return 'Artista';
    return this.currentTrack.artists.map(a => a.name).join(', ');
  }

  private formatTime(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }
}