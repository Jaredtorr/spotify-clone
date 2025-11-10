import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface Artist {
  name: string;
  image: string;
  followers: number;
  genres: string[];
  topTracks: { title: string; cover: string }[];
  albums: { id: string; title: string; cover: string; releaseDate: string }[];
  relatedArtists: { name: string; image: string }[];
}

@Component({
  selector: 'app-information',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.css']
})
export class InformationComponent implements OnInit {

  artist!: Artist;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.artist = {
      name: 'Simulated Artist',
      image: 'https://via.placeholder.com/300x300.png?text=Artist+Image',
      followers: 12345678,
      genres: ['Pop', 'Rock', 'Indie'],
      topTracks: [
        { title: 'Track 1', cover: 'https://via.placeholder.com/200x200.png?text=Track+1' },
        { title: 'Track 2', cover: 'https://via.placeholder.com/200x200.png?text=Track+2' },
        { title: 'Track 3', cover: 'https://via.placeholder.com/200x200.png?text=Track+3' },
        { title: 'Track 4', cover: 'https://via.placeholder.com/200x200.png?text=Track+4' },
        { title: 'Track 5', cover: 'https://via.placeholder.com/200x200.png?text=Track+5' }
      ],
      albums: [
        { id: '1', title: 'Album 1', cover: 'https://via.placeholder.com/180x180.png?text=Album+1', releaseDate: '2021-03-15' },
        { id: '2', title: 'Album 2', cover: 'https://via.placeholder.com/180x180.png?text=Album+2', releaseDate: '2019-08-22' },
        { id: '3', title: 'Album 3', cover: 'https://via.placeholder.com/180x180.png?text=Album+3', releaseDate: '2020-11-05' },
        { id: '4', title: 'Album 4', cover: 'https://via.placeholder.com/180x180.png?text=Album+4', releaseDate: '2018-06-30' },
        { id: '5', title: 'Album 5', cover: 'https://via.placeholder.com/180x180.png?text=Album+5', releaseDate: '2022-01-20' }
      ],
      relatedArtists: [
        { name: 'Related Artist 1', image: 'https://via.placeholder.com/120x120.png?text=Artist+1' },
        { name: 'Related Artist 2', image: 'https://via.placeholder.com/120x120.png?text=Artist+2' },
        { name: 'Related Artist 3', image: 'https://via.placeholder.com/120x120.png?text=Artist+3' },
        { name: 'Related Artist 4', image: 'https://via.placeholder.com/120x120.png?text=Artist+4' }
      ]
    };
  }

  goToAlbum(id: string): void {
    this.router.navigate(['/album', id]);
  }
}
