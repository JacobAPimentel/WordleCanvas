import { Injectable } from '@angular/core';
import guesses from '../../resources/guesses.json';
import { GuessState } from './editor';

@Injectable({
  providedIn: 'root',
})
export class WordBank 
{
  /**
   * Goes through the list of guesses and determine if any guess matches
   * the guess state of the build area.
   * 
   * @param answer - The answer that will be evaluated
   * @param buildArea  - The buildArea's guess state.
   * @returns array of guess words
   */
  public matchWords(answer: string, buildArea: GuessState[][]): string[]
  {
    const matchedWords: string[] = new Array(buildArea.length).fill('?????');

    for(let i = 0; i < buildArea.length; i++)
    {
      const wants = buildArea[i];

      if(wants.every(state => state === 'CORRECT')) //Correct guess. Cannot continue.
      {
        matchedWords[i] = answer;
        break;
      }

      for(const guess of guesses)
      {
        const guessState = this.validateGuess(answer,guess);

        if(JSON.stringify(guessState) == JSON.stringify(wants))
        {
          matchedWords[i] = guess;
          break;
        }
      }
    }

    return matchedWords;
  }

  /**
   * Compare the Guess with the Answer and determine its guess state.
   * 
   * @param answer - the answer that is being evaulated
   * @param guess  = the current guess that is being evaulated
   * @returns the guess state for the current guess.
   */
  public validateGuess(answer: string, guess: string): GuessState[]
  {
    const guessState: GuessState[] = new Array(guess.length).fill('ABSENT');

    const remainingLetters = [...answer];

    //Determine all CORRECTS and ABSENTS
    for(let i = guess.length - 1; i >= 0; i--)
    {
      const letter = guess[i];

      if(letter === answer[i])
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
