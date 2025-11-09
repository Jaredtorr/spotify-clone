import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SpotifyService } from '../../services/spotify/spotify.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-callback',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center justify-center min-h-screen bg-black">
      <div class="text-center">
        <div class="text-white text-2xl mb-4">
          {{ message }}
        </div>
        <div *ngIf="loading" class="text-gray-400">
          Autenticando con Spotify...
        </div>
      </div>
    </div>
  `
})
export class CallbackComponent implements OnInit {
  loading = true;
  message = 'Procesando autenticación...';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private spotifyService: SpotifyService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const code = params['code'];
      const error = params['error'];

      if (error) {
        this.message = 'Error en la autenticación';
        this.loading = false;
        setTimeout(() => this.router.navigate(['/']), 3000);
        return;
      }

      if (code) {
        this.spotifyService.getAccessToken(code).subscribe({
          next: () => {
            this.message = '¡Autenticación exitosa!';
            this.loading = false;
            setTimeout(() => this.router.navigate(['/']), 1000);
          },
          error: (err) => {
            console.error('Error getting access token:', err);
            this.message = 'Error al obtener el token';
            this.loading = false;
            setTimeout(() => this.router.navigate(['/']), 3000);
          }
        });
      }
    });
  }
}