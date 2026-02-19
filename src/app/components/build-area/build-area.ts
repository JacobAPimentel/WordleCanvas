import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Cell } from '../cell/cell';
import { toArray } from 'rxjs';

const Colors = {
  ABSENT: '--color-absent',
  PRESENT: '--color-present',
  CORRECT: '--color-correct'
} as const;

type CellInfo =
{
  letter?: string,
  color: typeof Colors[keyof typeof Colors]
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,selector: 'app-build-area',
  imports: [Cell],
  templateUrl: './build-area.html',
  styleUrl: './build-area.css',
})
export class BuildArea 
{
  protected area = Array.from({length: 5}, () =>
  {
    return Array.from({length: 6}, () => ({color: Colors.ABSENT, letter: ''}));
  });
}
