import { Directive, input, output } from '@angular/core';
import { timer } from 'rxjs';

@Directive({
  selector: '[appDebounceClick]',
  host: {
    '(click)': 'clickEvent($event)'
  }
})
export class DebounceClickDirective
{
  private debounced = false;

  public debounceTime = input(300);
  public debounceClick = output();

  clickEvent(event: MouseEvent) 
  {
    if(this.debounced) return;
    this.debounced = true;

    timer(this.debounceTime()).subscribe(() => this.debounced = false);
    this.debounceClick.emit();
  }
}