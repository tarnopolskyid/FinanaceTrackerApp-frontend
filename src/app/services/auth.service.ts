import { Injectable } from '@angular/core'
import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { Router } from '@angular/router'
import { ToastrService } from 'ngx-toastr'
import { IAuthUser } from '../types/user.interface'
import { API_URL } from '../constants/constants'
import { catchError } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private readonly http: HttpClient,
              private readonly router: Router,
              private readonly toastr: ToastrService
  ) {}

  signUp(userData: IAuthUser) {
    return this.http.post(`${API_URL}/user`, userData)
      .pipe(catchError(err => {
        this.handleError(err);
          throw new Error(err);
      }))
      .subscribe(() => {
        this.toastr.success('Registration successfully')
      })
  }

  private handleError(err: HttpErrorResponse): void {
    this.toastr.error(err.error.message)
  }
}
