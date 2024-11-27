import { Component, OnInit, effect } from '@angular/core';
import { TransactionService } from '../../services/transaction.service';
import { ITransaction } from '../../types/transaction.interface';
import moment from 'moment'

interface MonthlySummary {
  [key: number]: { income: number; expense: number };
}

@Component({
  selector: 'app-graphs-chart',
  templateUrl: './graphs.component.html',
  styleUrls: ['./graphs.component.scss']
})
export class GraphsComponent implements OnInit {
  public lineChartData: any;
  public pieChartDataExpense: any;
  public pieChartDataIncome: any;
  public barChartData: any;
  public pieChartOptions: any;
  public barChartOptions: any;
  public lineChartOptions: any;

  constructor(public transactionService: TransactionService) {
    effect(() => {
      const transactions = this.transactionService.transactionSig();
      this.updateChartData(transactions);
    });
  }

  ngOnInit(): void {
    this.configurePieChartOptions();
    this.configureBarChartOptions();
    this.configureLineChartOptions();
  }

  updateChartData(transactions: ITransaction[]): void {
    // Aggregate transactions by month
    const transactionsPerMonth = transactions.reduce((acc, transaction) => {
      const month = moment(transaction.createdAt).format('YYYY-MM');
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    // Prepare data for the line chart
    const labels = Object.keys(transactionsPerMonth).sort();
    // Convert labels to month names
    const monthNames = Object.keys(transactionsPerMonth).sort().map(month => moment(month, 'YYYY-MM').format('MMMM'));
    const data = labels.map(month => transactionsPerMonth[month]);


    // Pie Chart Data expense
    const expenseByCategory = transactions
      .filter(transaction => transaction.type === 'expense')
      .reduce((acc, transaction) => {
        const category = transaction.category?.title || 'Other';
        acc[category] = (acc[category] || 0) + transaction.amount;
        return acc;
      }, {} as { [key: string]: number });

    // Pie Chart Data income
    const incomeByCategory = transactions
      .filter(transaction => transaction.type === 'income')
      .reduce((acc, transaction) => {
        const category = transaction.category?.title || 'Other';
        acc[category] = (acc[category] || 0) + transaction.amount;
        return acc;
      }, {} as { [key: string]: number });

    // Bar Chart Data by Month
    const monthlySummary: MonthlySummary = transactions.reduce((acc, transaction) => {
      const month = new Date(transaction.createdAt).getMonth();
      acc[month] = acc[month] || { income: 0, expense: 0 };

      if (transaction.type === 'income') {
        acc[month].income += transaction.amount;
      } else if (transaction.type === 'expense') {
        acc[month].expense += transaction.amount;
      }

      return acc;
    }, {} as MonthlySummary);

    this.lineChartData = {
      labels: monthNames,
      datasets: [
        {
          label: 'Number of Transactions',
          data: data,
          borderColor: 'rgb(37 99 235)',
          backgroundColor: 'rgba(66, 165, 245, 0.2)',
          fill: true,
          tension: 0.4
        }
      ]
    };


    this.pieChartDataIncome = {
      labels: Object.keys(incomeByCategory),
      datasets: [
        {
          data: Object.values(incomeByCategory),
          backgroundColor: ['#22C55E','#F97316', '#F59E0B', 'rgba(185,16,70,0.95)', '#3B82F6', '#6366F1', '#EF4444']
        }
      ]
    };

    this.pieChartDataExpense = {
      labels: Object.keys(expenseByCategory),
      datasets: [
        {
          data: Object.values(expenseByCategory),
          backgroundColor: ['#EF4444', '#F97316', '#F59E0B', '#10B981', '#3B82F6', '#6366F1', '#22C55E']
        }
      ]
    };

    this.barChartData = {
      labels: Object.keys(monthlySummary).map(month => new Date(0, +month).toLocaleString('default', { month: 'long' })),
      datasets: [
        {
          label: 'Income',
          data: Object.values(monthlySummary).map(summary => summary.income),
          backgroundColor: '#22C55E'
        },
        {
          label: 'Expense',
          data: Object.values(monthlySummary).map(summary => summary.expense),
          backgroundColor: '#EF4444'
        }
      ]
    };
  }

  configureBarChartOptions(): void {
    this.barChartOptions = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: {
            color: 'white'
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: 'white',
            font: {
              weight: 500
            }
          },

        },
        y: {
          ticks: {
            color: 'white'
          },
          grid: {
            color: 'white',
            drawBorder: false
          }
        }

      }
    };
  }

  configureLineChartOptions(): void {
    this.lineChartOptions = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: {
            color: 'white'
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: 'white'
          },
          grid: {
            color: 'white',
            drawBorder: false
          }
        },
        y: {
          ticks: {
            color: 'white'
          },
          grid: {
            color: 'white',
            drawBorder: false
          }
        }
      }
    };
  }

  configurePieChartOptions(): void {
    this.pieChartOptions = {
      responsive: true,
      plugins: {
        legend: {
          labels: {
            color: 'white'
          },
          display: true,
          position: 'bottom'
        }
      }
    };
  }
}
