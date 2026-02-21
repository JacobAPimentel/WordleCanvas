import { Component, ChangeDetectionStrategy, inject, model, OnInit, computed } from '@angular/core';
import { Cell } from '../cell/cell';
import { WordBank } from '../../services/word-bank';
import { Editor, GuessStates } from '../../services/editor';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,selector: 'app-build-area',
  imports: [Cell],
  templateUrl: './build-area.html',
  styleUrl: './build-area.css',
})
export class BuildArea
{
  protected editor = inject(Editor);

  protected cellClick(row: number, col: number): void
  {
    this.editor.dirty.set(true);
    const info = this.editor.buildArea()[row][col];
    const curI = GuessStates.indexOf(info.state);
    
    info.state = GuessStates[(curI + 1) % GuessStates.length];
  }
}
