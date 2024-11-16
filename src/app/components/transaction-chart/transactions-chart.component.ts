import { Component, OnInit, effect } from '@angular/core';
import { TransactionService } from '../../services/transaction.service';
import { ITransaction } from '../../types/transaction.interface';

@Component({
  selector: 'app-transactions-chart',
  templateUrl: './transactions-chart.component.html',
  styleUrls: ['./transactions-chart.component.scss']
})
export class TransactionsChartComponent implements OnInit {
  public chartData: any;
  public chartOptions: any;

  constructor(public transactionService: TransactionService) {
    effect(() => {
      const transactions = this.transactionService.transactionSig();
      this.updateChartData(transactions);
    });
  }

  ngOnInit(): void {
    this.configureChartOptions();
  }

  updateChartData(transactions: ITransaction[]): void {
    const totalIncome = transactions
      .filter(transaction => transaction.type === 'income')
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    const totalExpense = transactions
      .filter(transaction => transaction.type === 'expense')
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    this.chartData = {
      labels: ['Income', 'Expense'],
      datasets: [
        {
          data: [totalIncome, totalExpense],
          backgroundColor: ['#22C55E', '#EF4444']
        }
      ]
    };
  }

  configureChartOptions(): void {
    this.chartOptions = {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: 'top'
        }
      }
    };
  }
}
