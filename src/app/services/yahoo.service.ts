import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Headers': 'Origin, Content-Type, Accept',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class YahooService {
  constructor(private http: HttpClient) {}

  getCharts(stocks?: string | undefined): Observable<any> {
    var apiUrl;
    if (stocks) {
      apiUrl = `/api/v8/finance/chart/${stocks}?region=PT&lang=pt-BR&includePrePost=false&interval=15m&useYfid=true&range=30d&corsDomain=finance.yahoo.com&.tsrc=finance`;
    } else {
      apiUrl =
        '/api/v8/finance/chart/PETR4.SA?region=PT&lang=pt-BR&includePrePost=false&interval=15m&useYfid=true&range=30d&corsDomain=finance.yahoo.com&.tsrc=finance';
    }

    return this.http.get<any>(apiUrl);
  }

  getStocks(search: string): Observable<any> {
    const apiSearch = `api/v1/finance/search?q=${search}&lang=pt-BR&region=US&quotesCount=8&newsCount=0&enableFuzzyQuery=false&quotesQueryId=tss_match_phrase_query&multiQuoteQueryId=multi_quote_single_token_query&enableCb=true&enableNavLinks=true&enableEnhancedTrivialQuery=true&enableCulturalAssets=true&researchReportsCount=2`;
    return this.http.get<any>(apiSearch);
  }
}
