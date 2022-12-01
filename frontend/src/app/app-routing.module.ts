import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatPageComponent } from './chat/chat-page/chat-page.component';
import { LoginPageComponent } from './login/login-page/login-page.component';
import { LoginPageGuard } from './guards/login-page.guard';

const routes: Routes = [
  { path: 'chat', component: ChatPageComponent },
  { path: '**', component: LoginPageComponent, canActivate: [LoginPageGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
