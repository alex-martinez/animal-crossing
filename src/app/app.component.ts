import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { INSECTS } from './data/insects';
import { FISHES } from './data/fishes';
import { Fish } from './interfaces/fish.interface';
import { Insect } from './interfaces/insect.interface';
import { fromEvent, Observable, of, concat, from } from 'rxjs';
import { tap, map, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  allItems = [...FISHES, ...INSECTS];
  insects: Insect[] = INSECTS;
  fishes: Fish[] = FISHES;
  items$: Observable<Insect[]>;

  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;

  ngOnInit() {
    const searchText$ = fromEvent<any>(this.searchInput.nativeElement, 'keyup')
      .pipe(
      map(event => event.target.value),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(search => this.filterInsects(search))
      );

    this.items$ = concat(of(this.allItems), searchText$);
  }

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

  filterInsects(search = '') {
    // const exactMatch = (insect) => RegExp(search.toLowerCase(), 'g').test(insect.name.toLowerCase());
    const fuzzyMatch = (insect: Insect) => this.fuzzyMatch(search.toLowerCase(), insect.name.toLowerCase());
    const filteredList = this.allItems.filter(fuzzyMatch);
    return of(filteredList);
  }

  fuzzyMatch(pattern: string, str: string) {
    pattern = '.*' + pattern.split('').join('.*') + '.*';
    const re = new RegExp(pattern);
    return re.test(str);
  }
}
