import { Component, ChangeDetectionStrategy } from '@angular/core';
import { BuildArea } from '../components/build-area/build-area';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,selector: 'app-home-page',
  imports: [BuildArea],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage {

}
