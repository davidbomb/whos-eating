import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private nightModeSubject = new BehaviorSubject<boolean>(false);
  public nightMode$ = this.nightModeSubject.asObservable();

  setNightMode(isNightMode: boolean): void {
    this.nightModeSubject.next(isNightMode);
  }

  toggleNightMode(): void {
    this.nightModeSubject.next(!this.nightModeSubject.value);
  }

  get isNightMode(): boolean {
    return this.nightModeSubject.value;
  }
}

