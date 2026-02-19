import { Component, ChangeDetectionStrategy, OnInit, inject, TemplateRef, ViewChild, viewChild } from '@angular/core';
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
  protected wordBank = inject(WordBank);

  private buildArea = viewChild.required(BuildArea);

  public placeholderClick()
  {
    const words = this.wordBank.matchWords('hoist',this.buildArea().getWantedState());

    const area = [...this.buildArea().area()];
    for(let row = 0; row < words.length; row++)
    {
      const word = words[row];
      for(let col = 0; col < word.length; col++)
      {
        area[row][col].letter = word[col];
      }
    }
    this.buildArea().area.set(area);
  }
}
