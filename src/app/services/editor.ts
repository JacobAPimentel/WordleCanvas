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

  public buildArea = signal<CellInfo[][]>(this.defaultArea());
  public selectedState = signal<GuessState>('PRESENT');
  public answer = signal<string>('');
  public dirty = signal<boolean>(false);

  /**
   * @returns the default build area (empty letters, all absent states)
   */
  public defaultArea(): CellInfo[][]
  {
    return Array.from({length: 6}, () =>
    {
      return Array.from({length: 5}, () => ({state: 'ABSENT', letter: ''}));
    });
  }

  /**
   * Sets the build area to the default area.
   */
  public resetArea(): void
  {
    this.buildArea.set(this.defaultArea());
  }

  /**
   * @returns the wanted GuessState of the build area.
   */
  public getWantedState(): GuessState[][]
  {
    return this.buildArea().map(row => row.map(cell => 
    {
      return cell.state;
    }));
  }

  /**
   * Find the guesses that will result in the wanted build state.
   * 
   * @param answer - the answer that is being evaulated.
   */
  public findGuesses(answer: string): void
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
