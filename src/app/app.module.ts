import { PrimeToastModule } from './shared/ui/prime-ng/toast/toast.module';
import { NotificationsComponent } from './shared/ui/notifications/notifications.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { PrimeMenuModule } from './shared/ui/prime-ng/menu/menu.module';
import { UserInfoComponent } from './users/user-info/user-info.component';
import { PrimeSidebarModule } from './shared/ui/prime-ng/sidebar/sidebar.module';
import { PrimePanelMenuModule } from './shared/ui/prime-ng/panel-menu/panel-menu.module';
import { PrimeMenubarModule } from './shared/ui/prime-ng/menubar/menubar.module';
import { PrimeButtonModule } from './shared/ui/prime-ng/button/button.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './users/login/login.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { StartComponent } from './shared/ui/start/start.component';
import { GraphQLModule } from './graphql.module';
import { JwtInterceptor } from './shared/helpers/jwt.interceptor';
import { PrimeCardModule } from './shared/ui/prime-ng/card/card.module';
import { PrimeInputTextModule } from './shared/ui/prime-ng/input-text/input-text.module';
import { PrimePasswordModule } from './shared/ui/prime-ng/password/password.module';
import { DialogService } from 'primeng/dynamicdialog';
import { BadgeModule } from 'primeng/badge';

@NgModule({
  declarations: [
    AppComponent,
    StartComponent,
    LoginComponent,
    UserInfoComponent,
    NotificationsComponent,
    UnauthorizedComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,

    // Prime NG
    BadgeModule,
    PrimeCardModule,
    PrimeButtonModule,
    PrimeInputTextModule,
    PrimePasswordModule,
    PrimeButtonModule,
    PrimeMenuModule,
    PrimePanelMenuModule,
    PrimeMenubarModule,
    PrimeSidebarModule,
    PrimeToastModule,

    // Apollo
    HttpClientModule, // provides HttpClient for HttpLink

    // App modules
    GraphQLModule,
  ],
  providers: [
    DialogService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor() {
    // tslint:disable-next-line: no-string-literal
    // window['_rollupMoment__default'] = null;
  }
}
