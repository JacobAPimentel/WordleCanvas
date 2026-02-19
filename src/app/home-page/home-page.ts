import { Component, ChangeDetectionStrategy, OnInit, inject } from '@angular/core';
import { BuildArea } from '../components/build-area/build-area';
import { WordBank } from '../services/word-bank';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,selector: 'app-home-page',
  imports: [BuildArea],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage
{
  protected WordBank = inject(WordBank);

}
