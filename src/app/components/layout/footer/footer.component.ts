import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {

  isPlaying: boolean = false;
  progress: number = 0;

  // ⏱️ Tiempos de reproducción
  currentTime: string = "0:00";
  duration: string = "3:54"; // Duración de la canción (puedes cambiarla)

  currentSong = {
    title: 'Getaway Car',
    artist: 'Taylor Swift',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/f/f2/Taylor_Swift_-_Reputation.png'
  };

  togglePlay() {
    this.isPlaying = !this.isPlaying;

    if (this.isPlaying) {
      this.startTimer();
    } else {
      this.stopTimer();
    }
  }

  previousTrack() {
    console.log('Previous track');
  }

  nextTrack() {
    console.log('Next track');
  }

  // 🕒 Simulación del avance del tiempo
  private interval: any;
  private currentSeconds: number = 0;
  private totalSeconds: number = 234; // 3:54 en segundos

  startTimer() {
    this.stopTimer(); // evita duplicados
    this.interval = setInterval(() => {
      if (this.currentSeconds < this.totalSeconds) {
        this.currentSeconds++;
        this.updateTime();
      } else {
        this.stopTimer();
        this.isPlaying = false;
      }
    }, 1000);
  }

  stopTimer() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  updateTime() {
    this.progress = (this.currentSeconds / this.totalSeconds) * 100;
    this.currentTime = this.formatTime(this.currentSeconds);
  }

  formatTime(seconds: number): string {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  }

}
