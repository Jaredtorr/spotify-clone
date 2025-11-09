import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SpotifyService } from '../../services/spotify/spotify.service';
import { PlayerService } from '../../services/player/player.service';
import { SpotifyTrack } from '../../models/SpotifyTrack';

@Component({
  selector: 'app-main-content',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './main-content.component.html',
})
export class MainContentComponent implements OnInit {
  searchQuery = '';
  tracks: SpotifyTrack[] = [];
  isLoading = false;
  isAuthenticated = false;

  constructor(
    private spotifyService: SpotifyService,
    private playerService: PlayerService
  ) {}

  ngOnInit(): void {
    this.isAuthenticated = this.spotifyService.isAuthenticated();
    
    // Cargar algunas canciones populares al inicio
    if (this.isAuthenticated) {
      this.searchTracks('taylor swift');
      // Verificar dispositivos disponibles
      this.checkDevices();
    }
  }

  /**
   * Verifica dispositivos al cargar el componente
   */
  async checkDevices(): Promise<void> {
    const hasDevice = await this.playerService.checkDevices();
    if (!hasDevice) {
      console.warn('💡 Tip: Abre la app de Spotify para controlar la reproducción');
    }
  }

  onSearch(): void {
    if (!this.searchQuery.trim() || !this.isAuthenticated) return;
    this.searchTracks(this.searchQuery);
  }

  searchTracks(query: string): void {
    this.isLoading = true;
    this.spotifyService.search(query, ['track']).subscribe({
      next: (response) => {
        this.tracks = response.tracks?.items || [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error searching:', err);
        this.isLoading = false;
      }
    });
  }

  playTrack(track: SpotifyTrack): void {
    if (!this.isAuthenticated) return;
    this.playerService.playTrack(track);
    console.log('🎵 Seleccionada:', track.name);
  }

  formatDuration(ms: number): string {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  getArtistNames(track: SpotifyTrack): string {
    return track.artists.map(a => a.name).join(', ');
  }
}