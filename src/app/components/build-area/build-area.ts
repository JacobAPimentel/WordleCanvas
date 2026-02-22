import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { Cell } from '../cell/cell';
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

  /**
   * Cell was clicked; update the cell's state.
   * 
   * @param row - The cell's row that was clicked
   * @param col - The cell's col that was clicked.
   * 
   * @remarks
   * Will set the editor dirty value to "true",
   * this will unrender all of the letters on the build area.
   */
  protected cellClick(row: number, col: number): void
  {
    this.editor.dirty.set(true);
    const info = this.editor.buildArea()[row][col];
    
    info.state = this.editor.selectedState();
  }
}
