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
    const tx = this.signTranssaction({name, description});
      this.apiURL = `${config.apiUrl}/products`
      console.log(this.apiURL)
      return this.http.post<any>(this.apiURL, {name, description, tx})
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

    submitRatingForProduct(source, rating, feedback) {
      this.apiURL = `${config.apiUrl}/ratings/${source}`
      console.log(this.apiURL)
      if (feedback)
      return this.http.post<any>(this.apiURL, {rating: parseFloat(rating), feedback: feedback})
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
    }

    listRatings() {
      this.apiURL = `${config.apiUrl}/ratings`
      console.log(this.apiURL)
      return this.http.get<any>(this.apiURL)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
    }

    listFeedback(source) {
      this.apiURL = `${config.apiUrl}/feedback/${source}`
      return this.http.get<any>(this.apiURL)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
    }

    createTransactionWithDestination(destination, productId) {
      const tx = this.signTranssaction({productId,destination});
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

    getProductTrace(id) {
      this.apiURL = `${config.apiUrl}`
      return this.http.get<any>(`${this.apiURL}/trace/${id}`)
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

    getLatLongMicrosoft(address) {
      this.apiURL = `${config.geocodeUrlMicrosoft}`
      let params = new HttpParams();
      params = params.append('query', address);
      params = params.append('subscription-key', config.apiKeyMicrosoft);
      params = params.append('api-version', '1.0');
      return this.http.get<any>(this.apiURL, {params: params}).pipe(
        retry(1),
        catchError(this.handleError)
        )
    }

    getAddressMicrosoft(lat, lon) {
      this.apiURL = 'https://atlas.microsoft.com/search/address/reverse/json'
      let params = new HttpParams();
      params = params.append('query', lat + ', ' + lon);
      params = params.append('subscription-key', config.apiKeyMicrosoft);
      params = params.append('api-version', '1.0');
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
  

  async signTranssaction(arr) {
    try {
      const blockchainData = JSON.stringify(arr);
      const msgUint8 = new TextEncoder().encode(blockchainData);
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      console.log(hashHex);
      return await window.web3.eth.abi.encodeFunctionCall(JSON.parse(config.abi), [...Object.values(arr), hashHex]);
    } catch (e) {
      console.error(e);
    }
  }
}
