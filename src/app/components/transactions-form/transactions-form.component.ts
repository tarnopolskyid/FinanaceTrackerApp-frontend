import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { TransactionService } from '../../services/transaction.service'
import { CategoryService } from '../../services/category.service'

@Component({
  selector: 'app-transactions-form',
  templateUrl: './transactions-form.component.html',
  styleUrl: './transactions-form.component.scss'
})
export class TransactionsFormComponent {
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
      comment: new FormControl(''),
      category: new FormControl('', Validators.required),
    })
  }

  onSubmit() {
    if (this.transactionForm.valid) {
      this.transactionService.create(this.transactionForm.value);
      this.transactionForm.reset();
    }
  }

}
