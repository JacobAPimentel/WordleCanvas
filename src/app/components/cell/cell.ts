import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,selector: 'app-cell',
  imports: [],
  templateUrl: './cell.html',
  styleUrl: './cell.css',
  host: {
    '[style.background-color]': '"var(" + color() + ")"'
  }
})
export class Cell {
  public color = input.required<string>();
  public letter = input<string>();
}
