import { Component, OnInit } from '@angular/core'
import { faRemove, faEdit } from '@fortawesome/free-solid-svg-icons'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { CategoryService } from '../../services/category.service'

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
  method: 'create' | 'update' = 'create';

  constructor(public categoryService: CategoryService) {
    this.categoryForm = new FormGroup({
      title: new FormControl('', [Validators.required])
    })
  }

  ngOnInit(): void {
    this.categoryService.findAll();
  }

  onSubmit() {
    if (this.categoryForm.valid && this.method === 'create') {
      this.categoryService.create(this.categoryForm.value.title);
      this.categoryForm.reset();
    } else {
      this.update();
      this.categoryForm.reset();
      this.method = 'create';
    }
  }

  delete(id: number) {
    this.categoryService.delete(id);
  }

  update() {
    this.categoryService.update(this.categoryId, this.categoryForm.value.title)
  }

  edit(id: number, title: string) {
    this.categoryId = id;
    this.categoryForm.setValue({title});
    this.method = 'update';
  }
}
