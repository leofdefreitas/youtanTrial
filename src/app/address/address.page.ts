import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import * as moment from 'moment';
import { DatabaseService } from '../services/database.service';
import { Address, RealtyType } from '../services/models';

@Component({
	selector: 'app-address',
	templateUrl: './address.page.html',
	styleUrls: ['./address.page.scss'],
})
export class AddressPage implements OnInit {

	public address: Address = new Address();
	public realtyTypes: RealtyType[] = []
	public date = "";
	public startingDate = "";
	public endingDate = "";
	public highlightRequiredFields: boolean = false;
	public nextYear = moment().add(1, 'year').format('YYYY');

	constructor(private db: DatabaseService, private route: ActivatedRoute, private router: Router, private toast: ToastController, ) { }

	ngOnInit() {
		this.address = new Address();
		this.route.paramMap.subscribe(params => {
			let addressId = params.get('id');
			if (addressId != 'undefined') {
				this.db.getAddress(addressId).then(data => {
					this.address = data;
				}).catch(err => {
					console.log("Failed to fetch desired address. ", err);
				})
			}
		}, err => {
			console.log("Failed to get route params. ", err);
		});

		this.db.getTypes().subscribe(data => {
			this.realtyTypes = data;
		}, err => {
			console.log("Failed to fetch realty types. ", err);
		});
	}

	public saveAddress() { 
		if (this.validateEntries(this.address)) {
			if (this.address.id) {
				this.db.updateAddress(this.address).then(_ => {
					this.presentToast("Address succesfully updated.");
				}).catch(err => {
					this.presentToast("Failed to update address.");
					console.log("Failed to update address. ", err);
				})
			} else {
				this.db.addAddress(this.address).then(_ => {
					this.presentToast("Address succesfully added.");
				}).catch(err => {
					this.presentToast("Failed to add new address.");
					console.log("Failed to add new address. ", err);
				})
			}	
		} else {
			this.highlightRequiredFields = true;
			console.log("Please make sure all required fields are correcly filled.");
			this.db.loadAddresses();
		}
		
	}

	public validateEntries(address: Address): boolean {
		if (address.address == '' || 
			address.date == '' ||
			address.activityField == '' ||
			address.classDesc == '' ||
			address.description == '' ||
			address.startingDate == '' ||
			address.endingDate == '' ||
			address.realtyType.id == 0) {
				this.presentToast("Failed to create/update address. Please make sure all required fields are filled.");
				this.highlightRequiredFields = true;
				return false;
			}
		
		if (moment(address.startingDate).diff(moment(address.endingDate), 'days') > 0) {
			this.presentToast("Starting Date must be earlier then Ending date");
			return false
		}
	
		this.highlightRequiredFields = false;
		return true;
	}

	public async presentToast(message, time?, position?) {
		const toast = await this.toast.create({
		  message: message,
		  duration: time ? time : 2000,
		  position: position ? position : "bottom"
		});
		toast.present();
	  }

}
