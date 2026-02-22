import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { GuessState } from '../../services/editor';

const colors = {
  ABSENT: '--color-absent',
  PRESENT: '--color-present',
  CORRECT: '--color-correct'
};

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,selector: 'app-cell',
  imports: [],
  templateUrl: './cell.html',
  styleUrl: './cell.css',
  host: {
    '[style.background-color]': '"var(" + color() + ")"'
  }
})

export class Cell 
{
  public state = input.required<GuessState>();
  public letter = input<string>();

  public color = computed(() => colors[this.state()]);
}
