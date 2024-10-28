import { Component, OnInit } from '@angular/core'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { TransactionService } from '../../services/transaction.service'

@Component({
  selector: 'app-transactions-table',
  templateUrl: './transactions-table.component.html',
  styleUrl: './transactions-table.component.scss'
})
export class TransactionsTableComponent implements OnInit {

  removeIcon = faTrash;
  currentPage = 1;

  constructor(readonly transactionService: TransactionService) {
  }

  ngOnInit(): void {
    this.transactionService.findAll()
  }

  delete(id: number) {
    this.transactionService.delete(id);
  }

}
