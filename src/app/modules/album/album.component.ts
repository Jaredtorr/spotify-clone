import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Track {
  number: number;
  title: string;
  duration: string;
  cover: string;
}

interface RelatedArtist {
  name: string;
  image: string;
}

interface ArtistInfo {
  name: string;
  image: string;
  topTracks: Track[];
  relatedArtists: RelatedArtist[];
}

interface Album {
  title: string;
  cover: string;
  artist: ArtistInfo;
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
      releaseDate: '2022-05-15',
      artist: {
        name: 'Simulated Artist',
        image: 'https://via.placeholder.com/150x150.png?text=Artist',
        topTracks: [
          { number: 1, title: 'Top Track 1', duration: '3:45', cover: 'https://via.placeholder.com/100x100.png?text=T1' },
          { number: 2, title: 'Top Track 2', duration: '4:05', cover: 'https://via.placeholder.com/100x100.png?text=T2' },
          { number: 3, title: 'Top Track 3', duration: '3:30', cover: 'https://via.placeholder.com/100x100.png?text=T3' }
        ],
        relatedArtists: [
          { name: 'Related Artist 1', image: 'https://via.placeholder.com/100x100.png?text=R1' },
          { name: 'Related Artist 2', image: 'https://via.placeholder.com/100x100.png?text=R2' },
          { name: 'Related Artist 3', image: 'https://via.placeholder.com/100x100.png?text=R3' }
        ]
      },
      tracks: Array.from({ length: 10 }, (_, i) => ({
        number: i + 1,
        title: `Track ${i + 1}`,
        duration: `${3 + Math.floor(Math.random() * 2)}:${Math.floor(Math.random() * 60).toString().padStart(2,'0')}`,
        cover: `https://via.placeholder.com/100x100.png?text=${i + 1}`
      }))
    };
  }
}
