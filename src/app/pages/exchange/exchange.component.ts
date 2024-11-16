import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-exchange',
  templateUrl: './exchange.component.html',
  styleUrls: ['./exchange.component.scss']
})
export class ExchangeComponent implements OnInit {

  exchangeForm: FormGroup;
  currencies: string[] = [];
  convertedAmount: number | null = null;
  targetCurrency: string | null = null; // Přidána proměnná pro cílovou měnu

  constructor(private http: HttpClient) {
    this.exchangeForm = new FormGroup({
      currencyFrom: new FormControl('USD'),
      currencyTo: new FormControl('CZK'),
      amount: new FormControl(0)
    });
  }

  ngOnInit(): void {
    this.loadCurrencies();

    // Subscribe to value changes
    this.exchangeForm.valueChanges.subscribe(() => {
      this.convertCurrency(); // Call conversion whenever any input changes
    });
  }

  loadCurrencies(): void {
    const apiUrl = 'https://api.exchangerate-api.com/v4/latest/USD';
    this.http.get(apiUrl, { headers: { 'no-api-prefix': 'true' } }).subscribe((data: any) => {
      this.currencies = Object.keys(data.rates);
    }, error => {
      console.error('Chyba při získávání seznamu měn z API', error);
    });
  }

  convertCurrency(): void {
    const currencyFrom = this.exchangeForm.get('currencyFrom')?.value;
    const currencyTo = this.exchangeForm.get('currencyTo')?.value;
    const amount = this.exchangeForm.get('amount')?.value;

    if (!currencyFrom || !currencyTo) {
      console.error('Vyber měny');
      return;
    }

    const apiUrl = `https://api.exchangerate-api.com/v4/latest/${currencyFrom}`;
    this.http.get(apiUrl, { headers: { 'no-api-prefix': 'true' } }).subscribe((data: any) => {
      const rate = data.rates[currencyTo];
      this.convertedAmount = amount * rate;
      this.targetCurrency = currencyTo; // Nastavení cílové měny
    }, error => {
      console.error('Chyba při získávání dat z API', error);
    });
  }
}
