import { Component } from '@angular/core';

@Component({
  selector: 'clue-angular',
  template: `<h1>Clue, Hello {{name}}</h1>`
})
export class AppComponent {
  name = 'Angular!';
}
