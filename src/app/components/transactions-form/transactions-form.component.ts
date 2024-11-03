import { Component } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { TransactionService } from '../../services/transaction.service'
import { CategoryService } from '../../services/category.service'
import { ITransaction, MethodEnum } from '../../types/transaction.interface'

@Component({
  selector: 'app-transactions-form',
  templateUrl: './transactions-form.component.html',
  styleUrl: './transactions-form.component.scss'
})
export class TransactionsFormComponent {

  transaction?: ITransaction;
  method: MethodEnum = MethodEnum.CREATE;

  transactionForm: FormGroup;

  constructor(public transactionService: TransactionService,
              public categoryService: CategoryService) {
    this.transactionForm = new FormGroup({
      title: new FormControl('', Validators.required),
      amount: new FormControl('', [
        Validators.required,
        Validators.pattern("^[0-9]*$"),
        Validators.min(0)
      ]),
      type: new FormControl('', Validators.required),
      comment: new FormControl(' '),
      category: new FormControl('', Validators.required),
    })
  }

  protected onSubmit() {
    if (this.transactionForm.valid) {
      if (this.method === MethodEnum.CREATE) {
        this.transactionService.create(this.transactionForm.value);
      } else if (this.method === MethodEnum.EDIT) {
        const updatedTransaction = { ...this.transaction, ...this.transactionForm.value };
        this.transactionService.update(this.transaction!.id, updatedTransaction);
      }

      this.resetForm();
    }
  }

  update(transaction: ITransaction) {
    this.method = MethodEnum.EDIT;
    this.transaction = { ...transaction};
    console.log(transaction)

    this.transactionForm.patchValue({
      title: transaction.title,
      amount: transaction.amount,
      type: transaction.type,
      comment: transaction.comment,
      category: transaction.category?.id
    });
  }

  private resetForm() {
    this.transactionForm.reset();
    this.transaction = undefined;
    this.method = MethodEnum.CREATE;
  }

  protected readonly MethodEnum = MethodEnum
}
