import { Component, ChangeDetectionStrategy, inject, model, OnInit, computed } from '@angular/core';
import { Cell } from '../cell/cell';
import { WordBank } from '../../services/word-bank';
import { Editor } from '../../services/editor';

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
    
    info.state = this.editor.selectedState();
  }
}
