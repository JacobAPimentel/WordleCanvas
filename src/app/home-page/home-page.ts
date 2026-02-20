import { Component, ChangeDetectionStrategy, OnInit, inject, TemplateRef, ViewChild, viewChild, signal, effect } from '@angular/core';
import { BuildArea } from '../components/build-area/build-area';
import { WordBank } from '../services/word-bank';
import { form, FormField, maxLength, minLength, pattern, required } from '@angular/forms/signals';

type Config = {
  word: string
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,selector: 'app-home-page',
  imports: [BuildArea, FormField],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage
{
  protected wordBank = inject(WordBank);

  private buildArea = viewChild.required(BuildArea);

  protected configModel = signal<Config>({
    word: 'TOKEN'
  });
  protected configForm = form(this.configModel, (schemaPath) => 
  {
    required(schemaPath.word);
    minLength(schemaPath.word,5);
    maxLength(schemaPath.word,5);
    pattern(schemaPath.word,/^[a-zA-Z]{5}$/);
  });
  
  protected uppercaseWordField = effect(() => 
  {
    const fieldVal = this.configForm.word().value;
    fieldVal.set(fieldVal().toUpperCase());
  });

  public onGenerate(event: Event)
  {
    event.preventDefault();
    if(this.configForm.word().invalid()) return;

    const words = this.wordBank.matchWords(this.configForm.word().value(),this.buildArea().getWantedState());

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
    this.buildArea().dirty.set(false);
  }
}
