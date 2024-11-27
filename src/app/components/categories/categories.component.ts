import { Component, OnInit } from '@angular/core'
import { faEdit, faRemove } from '@fortawesome/free-solid-svg-icons'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { CategoryService } from '../../services/category.service'
import { TransactionService } from '../../services/transaction.service'
import { MethodEnum } from '../../types/transaction.interface'
import { distinctUntilChanged, of } from 'rxjs'

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent implements OnInit {

  categoryForm: FormGroup

  removeIocn = faRemove;
  editIcon = faEdit;

  categoryId: number = 0;
  title: string = '';
  method: MethodEnum = MethodEnum.CREATE;

  constructor(public categoryService: CategoryService,
              public transactionService: TransactionService) {
    this.categoryForm = new FormGroup({
      title: new FormControl('', [Validators.required])
    })
  }

  ngOnInit(): void {
    this.categoryService.findAll();
  }

  protected onSubmit() {
    if (this.categoryForm.valid && this.method === MethodEnum.CREATE) {
      this.categoryService.create(this.categoryForm.value.title);
      this.categoryForm.reset();
    } else {
      this.update();
      this.categoryForm.reset();
      this.method = MethodEnum.CREATE;
    }
  }

  protected delete(id: number) {
    this.categoryService.delete(id);
    this.transactionService.findAll();
  }

  private update() {
    this.categoryService.update(this.categoryId, this.categoryForm.value.title);
    of(this.categoryService.categoriesSignal()).pipe(
      distinctUntilChanged()
    ).subscribe(() => {
      this.transactionService.findAll();
    })
  }

  protected edit(id: number, title: string) {
    this.categoryId = id;
    this.categoryForm.setValue({title});
    this.method = MethodEnum.EDIT;
  }

  protected readonly MethodEnum = MethodEnum
}
