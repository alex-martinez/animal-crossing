import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { INSECTS } from './data/insects';
import { FISHES } from './data/fishes';
import { Fish } from './interfaces/fish.interface';
import { Insect } from './interfaces/insect.interface';
import { fromEvent, Observable, of, concat, from } from 'rxjs';
import { tap, map, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { FiltersService } from './filters.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  allItems = [...FISHES, ...INSECTS];
  insects: Insect[] = INSECTS;
  fishes: Fish[] = FISHES;

  shouldShowFish = true;
  shouldShowInsects = true;

  items$: Observable<(Insect|Fish)[]>;

  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;

  constructor(
    private readonly filtersService: FiltersService
  ) {}

  ngOnInit() {
    const searchText$ = fromEvent<any>(this.searchInput.nativeElement, 'keyup')
      .pipe(
        map(event => event.target.value),
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(search => this.filterItems(search))
      );

    this.items$ = concat(of(this.allItems), searchText$);
  }

  filterByType(type = '') {
    this.items$ = this.items$.pipe(
      map((items) => items.filter((item) => item.type === type))
    );
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

  filterItems(search = ''): Observable<(Insect|Fish)[]> {
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

  sortByPrice() {
    this.items$ = this.items$.pipe(
      map((items) => items.sort((a, b) => a.price < b.price ? 1 : -1))
    );
  }

  sortAtoZ() {
    this.items$ = this.items$.pipe(
      map((items) => items.sort((a, b) => a.name < b.name ? -1 : 1))
    );
  }

  sortZtoA() {
    this.items$ = this.items$.pipe(
      map((items) => items.sort((a, b) => a.name < b.name ? 1 : -1))
    );
  }
}
