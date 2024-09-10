import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HumanComponent } from './features/component/human/human.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HumanComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'human';
}
