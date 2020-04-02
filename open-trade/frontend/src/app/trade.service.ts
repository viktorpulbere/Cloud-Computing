import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError, map} from 'rxjs/operators';
import { environment } from '../environments/environment';
import { config } from '../config'

@Injectable({
  providedIn: 'root'
})
export class TradeService {
  private apiURL;
  
  constructor(private http: HttpClient) { }
  
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  }  
  
  checkRegister(email): Observable<any> {
    this.apiURL = `${config.apiUrl}`
    return this.http.get<any>(this.apiURL + '/users/' + email)
    .pipe(
      retry(1),
      catchError(this.handleError)
      )
    }
    
    createUser(lat, lng, email,name) {
      this.apiURL = `${config.apiUrl}/users`
      console.log(this.apiURL)
      return this.http.post<any>(this.apiURL, {location: {lng, lat}, email, name})
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
    }

    createProduct(name, description) {
      this.apiURL = `${config.apiUrl}/products`
      console.log(this.apiURL)
      return this.http.post<any>(this.apiURL, {name, description})
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
    }

    createTransactionWithoutDestination(productId) {
      this.apiURL = `${config.apiUrl}/transactions`
      console.log(this.apiURL)
      return this.http.post<any>(this.apiURL, {productId: productId})
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
    }
    createTransactionWithDestination(destination, productId) {
      this.apiURL = `${config.apiUrl}/transactions`
      console.log(this.apiURL)
      return this.http.post<any>(this.apiURL, {destination, productId})
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
    }

    getTransactions(pending) {
      let params = new HttpParams();
      params = params.append('pending', pending);
      this.apiURL = `${config.apiUrl}`
      return this.http.get<any>(this.apiURL + '/transactions', {params: params})
      .pipe(
        retry(1),
        catchError(this.handleError)
        )
    }

    getSentProducts() {
      this.apiURL = `${config.apiUrl}`
      return this.http.get<any>(`${this.apiURL}/products`)
      .pipe(
        retry(1),
        catchError(this.handleError)
        )
    }

    getLatLong(address) {
      this.apiURL = `${config.geocodeUrl}`
      let params = new HttpParams();
      params = params.append('address', address);
      params = params.append('key', config.apiKey);
      return this.http.get<any>(this.apiURL, {params: params}).pipe(
        retry(1),
        catchError(this.handleError)
        )
    }

  handleError(error) {
     let errorMessage = '';
     if(error.error instanceof ErrorEvent) {
       errorMessage = error.error.message;
     } else if(error.error instanceof HttpErrorResponse) {
       errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
     }
     return throwError(errorMessage);
  }

}