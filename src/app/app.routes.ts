import { Routes } from '@angular/router';
import { HomeComponent } from './modules/home/home.component';
import { CallbackComponent } from './modules/callback/callback.component';
import { InformationComponent } from './modules/information/information.component';
import { AlbumComponent } from './modules/album/album.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'callback', component: CallbackComponent },
  { path: 'information', component: InformationComponent },
  { path: 'album/:id', component: AlbumComponent } // ruta dinámica
];
