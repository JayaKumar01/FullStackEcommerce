import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { Country } from '../common/country';
import { State } from '../common/state';

@Injectable({
  providedIn: 'root'
})
export class FormService {
  
  
  constructor(private http: HttpClient) { }  

  getCountries(): Observable<Country[]> {
    const url = 'http://localhost:8080/countries';
    
    return this.http.get<Country[]>(url).pipe(
      map(response => response)
    );
  }
  

  getStates(countryCode : string): Observable<State[]> {
    const url = `http://localhost:8080/states/countryCode?code=${countryCode}`; 

    return this.http.get<State[]>(url).pipe(
      map(response => response)
    );
  }


  getCreditCardMonths(): Observable<number[]> {
    let months: number[] = []; 

    for (let month= 1; month <= 12; month++) {
      months.push(month);
    }
    return of(months);
  } 

  getCreditCardYears(): Observable<number[]> {
    let years: number[] = [];
    const startYear: number = new Date().getFullYear();
    const endYear: number = startYear + 10; 

    for(let year = startYear; year <= endYear; year++) {
      years.push(year);
    }
    return of(years);
  }
}

interface GetCountry {
    
}