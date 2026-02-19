import { Component, ChangeDetectionStrategy, inject, model, OnInit, computed } from '@angular/core';
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
export class BuildArea implements OnInit
{
  public area = model<CellInfo[][]>([]);

  ngOnInit(): void {
    const cellInfos: CellInfo[][] = Array.from({length: 6}, () =>
    {
      return Array.from({length: 5}, () => ({state: 'ABSENT', letter: ''}));
    });
    this.area.set(cellInfos);
  }

  protected cellClick(row: number, col: number): void
  {
    const info = this.area()[row][col];

    const curI = states.indexOf(info.state);
    
    info.state = states[(curI + 1) % states.length];
  }

  public getWantedState(): GuessState[][]
  {
    return this.area().map(row => row.map(cell => {
      return cell.state;
    }));
  }
}
