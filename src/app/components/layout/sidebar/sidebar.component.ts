import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpotifyService } from '../../../services/spotify/spotify.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements OnInit {
  isAuthenticated = false;
  userName = '';

  constructor(private spotifyService: SpotifyService) {}

  ngOnInit(): void {
    this.isAuthenticated = this.spotifyService.isAuthenticated();
    
    if (this.isAuthenticated) {
      this.loadUserInfo();
    }
  }

  login(): void {
    const authUrl = this.spotifyService.getAuthUrl();
    window.location.href = authUrl;
  }

  logout(): void {
    this.spotifyService.clearToken();
    this.isAuthenticated = false;
    this.userName = '';
  }

  private loadUserInfo(): void {
    this.spotifyService.getCurrentUser().subscribe({
      next: (user) => {
        this.userName = user.display_name;
      },
      error: (err) => {
        console.error('Error loading user:', err);
      }
    });
  }
}