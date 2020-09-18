import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'address-list', pathMatch: 'full' },
  { path: 'address-list', loadChildren: () => import('./address-list/address-list.module').then( m => m.AddressListPageModule) },
  { path: 'address/:id', loadChildren: () => import('./address/address.module').then( m => m.AddressPageModule) },
  { path: 'newAddress', loadChildren: () => import('./address/address.module').then( m => m.AddressPageModule) }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
