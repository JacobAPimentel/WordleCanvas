import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { Cell } from '../cell/cell';
import { WordBank } from '../../services/word-bank';

const states = ['ABSENT','PRESENT','CORRECT'] as const
export type GuessState = typeof states[number]

type CellInfo =
{
  letter?: string,
  state: GuessState
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,selector: 'app-build-area',
  imports: [Cell],
  templateUrl: './build-area.html',
  styleUrl: './build-area.css',
})
export class BuildArea 
{
  //TODO: REMOVE
  protected WordBank = inject(WordBank);

  protected area: CellInfo[][] = Array.from({length: 6}, () =>
  {
    return Array.from({length: 5}, () => ({state: 'ABSENT', letter: ''}));
  });

  protected cellClick(row: number, col: number): void
  {
    const info = this.area[row][col];

    const curI = states.indexOf(info.state);
    
    info.state = states[(curI + 1) % states.length];
    
    const wants: GuessState[][] = this.area.map(row => row.map(cell => {
      return cell.state;
    }));

    const words = this.WordBank.matchWords("hoist",wants);
    console.log(words);
  }
}
