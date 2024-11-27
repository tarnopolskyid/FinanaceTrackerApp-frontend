import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component'
import { LoginComponent } from './pages/login/login.component'
import { SignupComponent } from './pages/signup/signup.component'
import { authGuard } from './guards/auth.guard'
import { ExchangeComponent } from './pages/exchange/exchange.component'
import { GraphsComponent } from './pages/graphs/graphs.component'

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Home',
    canActivate: [authGuard()]
  },
  {
    path: 'exchange',
    component: ExchangeComponent,
    title: 'Exchange',
    canActivate: [authGuard()]
  },
  {
    path: 'graphs',
    component: GraphsComponent,
    title: 'Graphs',
    canActivate: [authGuard()]
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'Login'
  },
  {
    path: 'signup',
    component: SignupComponent,
    title: 'Signup'
  },
  {
    path: "**",
    component: HomeComponent,
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
