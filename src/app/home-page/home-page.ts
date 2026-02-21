import { Component, ChangeDetectionStrategy, OnInit, inject, TemplateRef, ViewChild, viewChild, signal, effect } from '@angular/core';
import { BuildArea } from '../components/build-area/build-area';
import { WordBank } from '../services/word-bank';
import { form, FormField, maxLength, minLength, pattern, required } from '@angular/forms/signals';
import { HttpClient } from '@angular/common/http';

type Config = {
  word: string
}

type WordleInfomation = {
  id: number,
  solution: string,
  print_date: string,
  days_since_launch: number,
  editor: string
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
  protected http = inject(HttpClient);

  private buildArea = viewChild.required(BuildArea);

  protected configModel = signal<Config>({
    word: 'TOKEN'
  });
  protected configForm = form(this.configModel, (schemaPath) => 
  {
    required(schemaPath.word, {message: 'Five letter alphabetic word is required.'});
    pattern(schemaPath.word,/^[a-zA-Z]{5}$/,{message: 'Needs to be a five letter alphabetic word.'});
    minLength(schemaPath.word,5);
    maxLength(schemaPath.word,5);
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

  public getTodayAnswer()
  {
    const date = new Date();
    const YYYYMMDD = [date.getFullYear(),
                     (date.getMonth() + 1).toString().padStart(2,'0'),
                     date.getDate().toString().padStart(2,'0')].join('-');
                     
    this.http.get<WordleInfomation>(`/nyt/svc/wordle/v2/${YYYYMMDD}.json`).subscribe({
      next: (response) => 
      {
        this.configForm.word().value.set(response.solution);
      },
      error: (error) => 
      {
        console.error(error);
      }
    });
  }
}
