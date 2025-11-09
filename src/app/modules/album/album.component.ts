import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Track {
  number: number;
  title: string;
  duration: string;
  cover: string;
}

interface Album {
  title: string;
  cover: string;
  artist: string;
  releaseDate: string;
  tracks: Track[];
}

@Component({
  selector: 'app-album',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.css']
})
export class AlbumComponent implements OnInit {

  album!: Album;

  ngOnInit(): void {
    this.album = {
      title: 'Simulated Album',
      cover: 'https://via.placeholder.com/300x300.png?text=Album+Cover',
      artist: 'Simulated Artist',
      releaseDate: '2022-05-15',
      tracks: Array.from({ length: 15 }, (_, i) => ({
        number: i + 1,
        title: `Track ${i + 1}`,
        duration: `${3 + Math.floor(Math.random() * 2)}:${Math.floor(Math.random() * 60).toString().padStart(2,'0')}`,
        cover: `https://via.placeholder.com/100x100.png?text=${i + 1}`
      }))
    };
  }
}
