import { Component } from '@angular/core';
import { SidebarComponent } from "../../components/layout/sidebar/sidebar.component";
import { MainContentComponent } from "../../components/main-content/main-content.component";
import { RightPanelComponent } from "../../components/right-panel/right-panel.component";
import { FooterComponent } from "../../components/layout/footer/footer.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SidebarComponent,MainContentComponent, RightPanelComponent, FooterComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {}
 
