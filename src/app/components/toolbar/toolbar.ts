import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { Editor, GuessState } from '../../services/editor';
import { LowerCasePipe, NgClass } from '@angular/common';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,selector: 'app-toolbar',
  imports: [LowerCasePipe, NgClass],
  templateUrl: './toolbar.html',
  styleUrl: './toolbar.css',
})
export class Toolbar 
{
  public readonly colorPickers: GuessState[] = ['CORRECT','PRESENT','ABSENT'];
  protected editor = inject(Editor);

  /**
   * Update the editor's currently selected state.
   * 
   * @param state - The GuessState
   */
  protected colorPicked(state: GuessState): void
  {
    this.editor.selectedState.set(state);
  }
}
