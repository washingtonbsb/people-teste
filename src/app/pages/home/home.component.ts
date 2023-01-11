import { Component } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { YahooService } from 'src/app/services/yahoo.service';

import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTooltip,
  ApexStroke,
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
};

export type FinanceYahoo = {
  result: [
    {
      meta: {
        currency: string;
        symbol: string;
        exchangeName: string;
        instrumentType: string;
        firstTradeDate: number;
        regularMarketTime: number;
        gmtoffset: number;
        timezone: string;
        exchangeTimezoneName: string;
        regularMarketPrice: number;
        chartPreviousClose: number;
        previousClose: number;
        scale: number;
        priceHint: number;
        currentTradingPeriod: {
          pre: {
            timezone: string;
            start: number;
            end: number;
            gmtoffset: number;
          };
          regular: {
            timezone: string;
            start: number;
            end: number;
            gmtoffset: number;
          };
          post: {
            timezone: string;
            start: number;
            end: number;
            gmtoffset: number;
          };
        };
        tradingPeriods: [
          [
            {
              timezone: string;
              start: number;
              end: number;
              gmtoffset: number;
            }
          ]
        ];
        dataGranularity: string;
        range: string;
        validRanges: [string];
      };
      timestamp: [string];
      indicators: {
        quote: [
          {
            volume: [string];
            low: [string];
            close: [string];
            open: [string];
            high: [string];
          }
        ];
      };
    }
  ];
  error: null;
};

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  constructor(private yahooServices: YahooService) {
    this.getCharts();

    this.chartOptions = {
      series: [
        {
          name: 'R$',
          data: [
            {
              x: '',
              y: '',
            },
          ],
        },
      ],
      chart: {
        height: 350,
        type: 'line',
      },

      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
      },

      xaxis: {
        type: 'datetime',

        labels: {
          showDuplicates: false,
          show: false,
        },
      },
      tooltip: {
        x: {
          format: 'dd/MM/yy HH:mm',
        },
      },
    };
  }

  dataService: any;
  stockName!: string;
  currency!: string;
  exchangeTimezoneName!: string;
  stockValue!: string;
  variation!: string;
  variationType!: string;
  stockPreviousClose!: string;
  stockPrevios30days!: string;
  stockPrevios30daysVariation!: string;
  stockPrevios30daysVariationType!: string;

  chartOptions!: Partial<ChartOptions>;

  inputValue?: string;
  options: Array<{ value: string; label: string }> = [];

  ngOnInit(): void {}

  async getStocks(search: string) {
    this.yahooServices
      .getStocks(search)
      .pipe(
        catchError(() => {
          return throwError(() => new Error('Houve um erro de comunicação'));
        })
      )
      .subscribe({
        next: (value) => {
          console.log('esse é o value', value.quotes);
          const dataOption = value.quotes;

          this.options = dataOption.map((item: any) => ({
            label: item.symbol,
            value: item.shortname,
          }));
        },
        error: (err) => {
          console.log('houve um erro');
        },
      });
  }

  async getCharts(data?: string) {
    this.yahooServices
      .getCharts(data)
      .pipe(
        catchError(() => {
          return throwError(() => new Error('Houve um erro de comunicação'));
        })
      )
      .subscribe({
        next: (value) => {
          this.dataService = value.chart.result[0];
          this.stockName = value.chart.result[0].meta.symbol;
          this.currency = value.chart.result[0].meta.currency;
          this.exchangeTimezoneName =
            value.chart.result[0].meta.exchangeTimezoneName;
          this.stockValue = value.chart.result[0].meta.regularMarketPrice;
          this.stockPreviousClose = value.chart.result[0].meta.previousClose;

          this.variationType =
            value.chart.result[0].meta.previousClose -
              value.chart.result[0].meta.regularMarketPrice >
            0
              ? 'negative'
              : 'positive';

          this.variation = this.variationCalculation(
            value.chart.result[0].meta.previousClose,
            value.chart.result[0].meta.regularMarketPrice
          );

          this.stockPrevios30daysVariation = this.variationCalculation(
            value.chart.result[0].indicators.quote[0].open[0],
            value.chart.result[0].meta.regularMarketPrice
          );
          this.stockPrevios30days =
            value.chart.result[0].indicators.quote[0].open[0].toFixed(2);

          this.stockPrevios30daysVariationType =
            value.chart.result[0].indicators.quote[0].open[0] -
              value.chart.result[0].meta.regularMarketPrice >
            0
              ? 'negative'
              : 'positive';

          const dataStep = value.chart.result[0].timestamp.map((item: any) => {
            const date = new Date(item * 1000).getTime() + 86400000;
            return date;
          });

          const dataObject: any =
            value.chart.result[0].indicators.quote[0].open.map(
              (item: any, index: any) => {
                var data = item !== null && [
                  dataStep[index],
                  item && item.toFixed(2),
                ];

                return data;
              }
            );

          const dataObjectFiltered = dataObject.filter(function (item: any) {
            return item !== false;
          });

          this.chartOptions = {
            series: [
              {
                color: '#9e9e9e',
                name: 'R$',
                data: dataObjectFiltered,
              },
            ],

            chart: {
              height: 350,
              type: 'area',
            },

            dataLabels: {
              enabled: false,
            },
            stroke: {
              curve: 'smooth',
            },

            xaxis: {
              type: 'datetime',

              labels: {
                showDuplicates: false,
                show: false,
              },
            },
            tooltip: {
              x: {
                format: 'dd/MM/yy HH:mm',
              },
            },
          };
        },
        error: (err) => {
          console.log('houve um erro', err);
        },
      });
  }

  variationCalculation(previousClose: number, regularMarketPrice: number) {
    var calc: number = regularMarketPrice - previousClose;

    var variationPorcent = (regularMarketPrice * 100) / previousClose - 100;

    var result;
    if (calc > 0) {
      result = `+ ${calc.toFixed(2)} (+ ${variationPorcent.toFixed(2)} %)`;
    } else {
      result = ` ${calc.toFixed(2)} ( ${variationPorcent.toFixed(2)} %)`;
    }

    return result;
  }

  onChangeInput(e: Event): void {
    const value = (e.target as HTMLInputElement).value;
    this.getStocks(value);
  }

  changeClickOption(): void {
    setTimeout(() => {
      this.getCharts(this.inputValue);
    }, 300);
  }
}
