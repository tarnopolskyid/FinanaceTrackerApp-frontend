import { Component, EventEmitter, OnInit, Output } from '@angular/core'
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons'
import { TransactionService } from '../../services/transaction.service'
import { ITransaction, TransactionType } from '../../types/transaction.interface'

@Component({
  selector: 'app-transactions-table',
  templateUrl: './transactions-table.component.html',
  styleUrl: './transactions-table.component.scss'
})
export class TransactionsTableComponent implements OnInit {

  @Output()
  editClicked = new EventEmitter<ITransaction>();

  editIcon = faEdit;
  removeIcon = faTrash;
  currentPage = 1;

  constructor(readonly transactionService: TransactionService) {
  }

  ngOnInit(): void {
    this.transactionService.findAll()
  }

  protected delete(id: number) {
    this.transactionService.delete(id);
  }

  protected onEditClick(transaction: ITransaction) {
    this.editClicked.emit(transaction);
  }
}
