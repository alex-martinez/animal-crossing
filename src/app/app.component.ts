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
  insects: Insect[] = INSECTS;
  fishes: Fish[] = FISHES;
  insects$: Observable<Insect[]>;

  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;

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

  ngOnInit() {
    const searchText$ = fromEvent<any>(this.searchInput.nativeElement, 'keyup')
      .pipe(
      map(event => event.target.value),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(search => this.filterInsects(search))
      );

    this.insects$ = concat(of(this.insects), searchText$);
  }

  filterInsects(search = '') {
    // const exactMatch = (insect) => RegExp(search.toLowerCase(), 'g').test(insect.name.toLowerCase());
    const fuzzyMatch = (insect: Insect) => this.fuzzyMatch(search.toLowerCase(), insect.name.toLowerCase());
    const filteredList = this.insects.filter(fuzzyMatch);
    return of(filteredList);
  }

  fuzzyMatch(pattern: string, str: string) {
    pattern = '.*' + pattern.split('').join('.*') + '.*';
    const re = new RegExp(pattern);
    return re.test(str);
  }
}
