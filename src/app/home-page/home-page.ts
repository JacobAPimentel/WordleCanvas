import { Component, ChangeDetectionStrategy, OnInit, inject, TemplateRef, ViewChild, viewChild, signal, effect } from '@angular/core';
import { BuildArea } from '../components/build-area/build-area';
import { WordBank } from '../services/word-bank';
import { form, FormField, maxLength, minLength, pattern, required } from '@angular/forms/signals';
import { HttpClient } from '@angular/common/http';
import { Editor } from '../services/editor';
import { Toolbar } from '../components/toolbar/toolbar';

type Config = {
  answer: string
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
  imports: [BuildArea, FormField, Toolbar],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage
{
  protected wordBank = inject(WordBank);
  protected editor = inject(Editor);
  protected http = inject(HttpClient);

  protected configModel = signal<Config>({
    answer: 'TOKEN'
  });
  protected configForm = form(this.configModel, (schemaPath) => 
  {
    required(schemaPath.answer, {message: 'Five letter alphabetic word is required.'});
    pattern(schemaPath.answer,/^[a-zA-Z]{5}$/,{message: 'Needs to be a five letter alphabetic word.'});
    minLength(schemaPath.answer,5);
    maxLength(schemaPath.answer,5);
  });
  
  protected uppercaseWordField = effect(() => 
  {
    const fieldVal = this.configForm.answer().value;
    fieldVal.set(fieldVal().toUpperCase());
  });

  public onGenerate(event: Event)
  {
    event.preventDefault();
    if(this.configForm.answer().invalid()) return;
    this.editor.findGuesses(this.configForm.answer().value());
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
        this.configForm.answer().value.set(response.solution);
      },
      error: (error) => 
      {
        console.error(error);
      }
    });
  }
}
