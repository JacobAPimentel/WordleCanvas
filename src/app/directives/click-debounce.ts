import { Directive, input, output } from '@angular/core';
import { timer } from 'rxjs';

@Directive({
  selector: '[appDebounceClick]',
  host: {
    '(click)': 'clickEvent()'
  }
})
export class DebounceClickDirective
{
  private debounced = false;

  public debounceTime = input(300);
  public debounceClick = output();

  /**
   * If there is no debounce, enable the debounce and emit debounceClick() signal.
   * 
   * If there is a debounce, do nothing.
   * 
   */
  public clickEvent(): void
  {
    if(this.debounced) return;
    this.debounced = true;

    timer(this.debounceTime()).subscribe(() => this.debounced = false);
    this.debounceClick.emit();
  }
}