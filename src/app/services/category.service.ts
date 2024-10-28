import { Injectable, signal } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { ToastrService } from 'ngx-toastr'
import { ICategory } from '../types/category.interface'

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  categoriesSignal = signal<ICategory[]>([])

  constructor(private readonly http: HttpClient,
              private readonly toastr: ToastrService
              ) {}

  findAll() {
    return this.http.get<ICategory[]>('categories')
      .subscribe((categories: ICategory[]) => {
        this.categoriesSignal.set(categories)
      })
  }

  create(title: string) {
    return this.http.post<ICategory>('categories', {title})
      .subscribe((newCategory: ICategory) => {
        this.categoriesSignal.update((categories) =>
          [...categories, newCategory])
        this.toastr.success('Category created')
      })
  }

  delete(id: number) {
    this.http.delete(`categories/category/${id}`)
      .subscribe(() => {
        this.categoriesSignal.update((categories) =>
          categories.filter((category) => category.id !== id)
        )
        this.toastr.warning('Category deleted')
      })
  }

  update(id: number, title: string){
    this.http.patch(`categories/category/${id}`, {title})
      .subscribe(() => {
        this.categoriesSignal.update((categories) =>
          categories.map(it => it.id === id ? {...it, title} : it));
          this.toastr.success('Category updated');
      })

  }
}
