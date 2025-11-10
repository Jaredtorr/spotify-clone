import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { PlayerService } from '../../services/player/player.service';
import { SpotifyTrack } from '../../models/SpotifyTrack';

@Component({
  selector: 'app-right-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './right-panel.component.html',
})
export class RightPanelComponent implements OnInit, OnDestroy {
  currentTrack: SpotifyTrack | null = null;
  private subscription?: Subscription;

  constructor(
    private playerService: PlayerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.subscription = this.playerService.currentTrack.subscribe(track => {
      this.currentTrack = track;
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  get coverUrl(): string {
    return this.currentTrack?.album.images[0]?.url
      || 'https://upload.wikimedia.org/wikipedia/en/f/f2/Taylor_Swift_-_Reputation.png';
  }

  get songTitle(): string {
    return this.currentTrack?.name || 'Getaway Car';
  }

  get artistName(): string {
    if (!this.currentTrack) return 'Taylor Swift';
    return this.currentTrack.artists.map(a => a.name).join(', ');
  }

  // Función actualizada: redirige a Information
  goToInformation(): void {
    this.router.navigate(['/information']);
  }
}
