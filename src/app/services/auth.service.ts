import { Injectable, signal } from '@angular/core'
import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { Router } from '@angular/router'
import { ToastrService } from 'ngx-toastr'
import { IAuthUser, IUser } from '../types/user.interface'
import { API_URL } from '../constants/constants'
import { catchError, tap } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isAuthSig = signal<boolean>(false);

  constructor(private readonly http: HttpClient,
              private readonly router: Router,
              private readonly toastr: ToastrService
  ) {
    const token = localStorage.getItem('token');
    this.isAuthSig.set(!!token)
  }

  signUp(userData: IAuthUser) {
    return this.http.post(`${API_URL}/user`, userData)
      .pipe(catchError(err => {
        tap(() => {
          this.login(userData);
        }),
        this.handleError(err);
          throw new Error(err.message);
      }))
      .subscribe(() => {
        this.toastr.success('Registration successfully');
      })
  }

  login(userData: IAuthUser) {
    return this.http.post<IUser>(`${API_URL}/auth/login`, userData)
      .pipe(
        tap((res: IUser) => {
          localStorage.setItem('token', res.token);
          this.isAuthSig.set(true);
        }),
        catchError((err) => {
          this.handleError(err);
          throw new Error(err.message)
        })
      )
      .subscribe(() => {
        this.toastr.success('Logged in');
        this.router.navigate(['/home'])
      })
  }

  logout() {
    localStorage.removeItem('token');
    this.isAuthSig.set(false);
    this.router.navigate(['/login'])
    this.toastr.success('Logged out')
  }

  private handleError(err: HttpErrorResponse): void {
    this.toastr.error(err.error.message)
  }
}
