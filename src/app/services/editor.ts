import { inject, Injectable, signal } from '@angular/core';
import { WordBank } from './word-bank';

export const GuessStates = ['ABSENT','PRESENT','CORRECT'] as const;
export type GuessState = typeof GuessStates[number];
export type CellInfo =
{
  letter?: string,
  state: GuessState
}

@Injectable({
  providedIn: 'root',
})
export class Editor 
{
  public wordBank = inject(WordBank);

  public dirty = signal<boolean>(false);
  public answer = signal<string>('');
  public buildArea = signal<CellInfo[][]>(
    Array.from({length: 6}, () =>
    {
      return Array.from({length: 5}, () => ({state: 'ABSENT', letter: ''}));
    })
  );

  public getWantedState(): GuessState[][]
  {
    return this.buildArea().map(row => row.map(cell => {
      return cell.state;
    }));
  }

  public findGuesses(answer: string)
  {
    const words = this.wordBank.matchWords(answer,this.getWantedState());

    const area = [...this.buildArea()];
    for(let row = 0; row < words.length; row++)
    {
      const word = words[row];
      for(let col = 0; col < word.length; col++)
      {
        area[row][col].letter = word[col];
      }
    }
    this.buildArea.set(area);
    this.dirty.set(false);
  }
}
