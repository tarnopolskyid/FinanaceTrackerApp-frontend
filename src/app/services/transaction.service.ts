import { Injectable, signal, WritableSignal } from '@angular/core'
import { ITransaction, ITransactionData } from '../types/transaction.interface'
import { HttpClient } from '@angular/common/http'
import { ToastrService } from 'ngx-toastr'
import { tap } from 'rxjs'
import { CategoryService } from './category.service'

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  transactionSig: WritableSignal<ITransaction[]> = signal<ITransaction[]>([])

  constructor(private readonly http: HttpClient,
              private readonly toastr: ToastrService,
              private categoryService: CategoryService) {
    this.findAll(); // Automatické načítání dat při inicializaci
  }

  findAll() {
    this.http.get<ITransaction[]>('transactions')
      .subscribe(res => {
        this.transactionSig.set(res)
      })
  }

  create(data: ITransactionData) {
    return this.http.post<ITransaction>('transactions', data)
      .pipe(
        tap(newTransaction => {
          const category = this.categoryService.categoriesSignal()
            .find(ctg => ctg.id === newTransaction.category?.id)
          this.transactionSig.update(transactions => [
            {...newTransaction, category},
            ...transactions
          ])
        })
      )
      .subscribe(() => {
        this.toastr.success('Transaction created')
      })
  }

  delete(id: number) {
    this.http.delete(`transactions/transaction/${id}`).subscribe(() => {
      this.transactionSig.update(transactions =>
        transactions.filter(transaction => transaction.id !== id))
        this.toastr.warning('Transaction deleted')
    })
  }

  update(id: number, newTransaction: ITransactionData){
    this.http.patch<ITransaction>(`transactions/transaction/${id}`, newTransaction)
      .subscribe(updatedTransaction => {
        const category = this.categoryService.categoriesSignal()
          .find(ctg => ctg.id === updatedTransaction.category?.id);

        this.transactionSig.update((transactions) =>
          transactions.map(it => it.id === id
            ? {...it,
                title: newTransaction.title,
                amount: newTransaction.amount,
                comment: newTransaction.comment,
                type: newTransaction.type,
                category: category,
                createdAt: it.createdAt,
                updatedAt: new Date()
              }
            : it
          ));
        this.findAll();
        this.toastr.success('Transaction updated');
      })
  }
}
