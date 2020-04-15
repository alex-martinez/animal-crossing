import { Component } from '@angular/core';
import { INSECTS } from './data/insects';
import { FISHES } from './data/fishes';
import { Fish } from './interfaces/fish.interface';
import { Insect } from './interfaces/insect.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  INSECTS: Insect[] = INSECTS;
  FISHES: Fish[] = FISHES;

  getMonthNames(monthList: number[]): string[] {
    if (monthList.length === 12) {
      return ['All year'];
    }

    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    return monthList.map(m => months[m]);
  }
}
