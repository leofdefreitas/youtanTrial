import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DatabaseService } from '../services/database.service';
import { Address } from '../services/models';

@Component({
	selector: 'app-address-list',
	templateUrl: './address-list.page.html',
	styleUrls: ['./address-list.page.scss'],
})
export class AddressListPage implements OnInit {

	public addresses: Address[] = [];
	public realtyTypes: Observable<any[]>;
	public newAddress: Address = new Address();

	constructor(private db: DatabaseService) { }

	ngOnInit() {
		this.db.getDatabaseState().subscribe(ready => {
			if (ready) {
				this.db.getAddresses().subscribe(addresses => {
					this.addresses = addresses;
				}, err => {
					console.log(err);
				});
			}
    	}, err => {
			console.error(err);
		})
	}

	public addAddress() {
		this.db.addAddress(this.newAddress).then(_ => {
			this.newAddress = new Address();
		});
	}

}
