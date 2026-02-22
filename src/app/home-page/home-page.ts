import { Component, ChangeDetectionStrategy, inject, viewChild, signal, effect } from '@angular/core';
import { BuildArea } from '../components/build-area/build-area';
import { WordBank } from '../services/word-bank';
import { disabled, form, FormField, maxLength, minLength, pattern, required } from '@angular/forms/signals';
import { HttpClient } from '@angular/common/http';
import { Editor } from '../services/editor';
import { Toolbar } from '../components/toolbar/toolbar';
import {finalize } from 'rxjs/operators';
import { timer } from 'rxjs';
import { DebounceClickDirective } from '../directives/click-debounce';

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
  imports: [BuildArea, FormField, Toolbar, DebounceClickDirective],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
  host: {
    '[class.loading]': 'loading()',
    tabindex: '-1', //Make the host focusable
    '(keydown)': 'processKeydown($event)'
  }
})
export class HomePage
{
  protected wordBank = inject(WordBank);
  protected editor = inject(Editor);
  protected http = inject(HttpClient);
  protected toolbar = viewChild.required(Toolbar);

  public loading = signal<boolean | undefined>(undefined); // undefined, because we are using [attr.disabled], which consider any non-null value as true.
  protected configModel = signal<Config>({
    answer: 'TOKEN'
  });
  protected configForm = form(this.configModel, (schemaPath) => 
  {
    required(schemaPath.answer, {message: 'Five letter alphabetic word is required.'});
    pattern(schemaPath.answer,/^[a-zA-Z]{5}$/,{message: 'Needs to be a five letter alphabetic word.'});
    minLength(schemaPath.answer,5);
    maxLength(schemaPath.answer,5);
    disabled(schemaPath,() => !!this.loading()); //!! to make it into a boolean value.
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

    const loadingTimer = timer(300).subscribe(() => this.loading.set(true));
    this.http.get<WordleInfomation>(`/nyt/svc/wordle/v2/${YYYYMMDD}.json`).pipe(
      finalize(() => 
      {
        loadingTimer.unsubscribe();
        this.loading.set(undefined);
      })
    ).subscribe({
      next: (response) => 
      {
        this.configForm.answer().value.set(response.solution);
      },
      error: (error) => 
      {
        console.error(error);
        this.configForm.answer().value.set('?????');
      }
    });
  }

  processKeydown(event: KeyboardEvent)
  {
    const target = event.target as HTMLElement;
    if(target.tagName === 'INPUT') return;

    const num = parseInt(event.key);
    if(num && 0 < num && num <= 3)
    {
      const state = this.toolbar().colorPickers[num - 1];
      this.editor.selectedState.set(state);
    }
  }
}
