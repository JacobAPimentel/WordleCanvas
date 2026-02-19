import { Injectable, signal } from '@angular/core';
import guesses from '../../resources/guesses.json';
import { GuessState } from '../components/build-area/build-area';

@Injectable({
  providedIn: 'root',
})
export class WordBank 
{
  public matchWords(word: string, buildArea: GuessState[][]): string[]
  {
    const matchedWords: string[] = new Array(word.length);

    for(let i = 0; i < buildArea.length; i++)
    {
      const wants = buildArea[i];
      for(const guess of guesses)
      {
        const guessState = this.validateGuess(word,guess);

        if(JSON.stringify(guessState) == JSON.stringify(wants))
        {
          matchedWords[i] = guess;
          break;
        }
      }
    }

    return matchedWords;
  }

  public validateGuess(word: string, guess: string): GuessState[]
  {
    const guessState: GuessState[] = new Array(guess.length).fill('ABSENT');

    const remainingLetters = [...word];

    //Determine all CORRECTS and ABSENTS
    for(let i = guess.length - 1; i >= 0; i--)
    {
      const letter = guess[i];

      if(letter === word[i])
      {
        guessState[i] = 'CORRECT';
        remainingLetters.splice(i,1);
      }
    }

    //Now determine any that is PRESENT
    for(let i = 0; i < guessState.length; i++)
    {
      if(guessState[i] === 'CORRECT') continue;
      const match = remainingLetters.indexOf(guess[i]);
      
      if(match !== -1)
      {
        remainingLetters.splice(match,1);
        guessState[i] = 'PRESENT';

        if(remainingLetters.length === 0) break;
      }
    }

    return guessState;
  }
}
