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
  protected readonly colorPickers: GuessState[] = ['CORRECT','PRESENT','ABSENT'];
  protected editor = inject(Editor);

  colorPicked(state: GuessState)
  {
    this.editor.selectedState.set(state);
  }
}
