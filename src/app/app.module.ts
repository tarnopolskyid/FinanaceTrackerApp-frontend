import { LOCALE_ID, NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { HeaderComponent } from './components/header/header.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { TransactionsFormComponent } from './components/transactions-form/transactions-form.component';
import { TransactionsTableComponent } from './components/transactions-table/transactions-table.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http'
import { AuthInterceptor } from './ineterceptors/auth.interceptor'
import { registerLocaleData } from '@angular/common'
import localeCs from '@angular/common/locales/cs';
import { NgxPaginationModule } from 'ngx-pagination'
import { TableModule } from 'primeng/table';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ExchangeComponent } from './pages/exchange/exchange.component'
import { DropdownModule } from 'primeng/dropdown'
import { TransactionsChartComponent } from './components/transaction-chart/transactions-chart.component'
import { ChartModule } from 'primeng/chart'
import { GraphsComponent } from './pages/graphs/graphs.component'
import { Button, ButtonDirective } from 'primeng/button'
import { Ripple } from 'primeng/ripple'

// Registrace české lokalizace
registerLocaleData(localeCs, 'cs');

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    SignupComponent,
    HeaderComponent,
    CategoriesComponent,
    TransactionsFormComponent,
    TransactionsTableComponent,
    TransactionsChartComponent,
    ExchangeComponent,
    GraphsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot(), // ToastrModule added
    NgxPaginationModule,
    TableModule,
    RadioButtonModule,
    DropdownModule,
    FormsModule,
    ChartModule,
    ButtonDirective,
    Ripple,
    Button,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    { provide: LOCALE_ID, useValue: 'cs' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
