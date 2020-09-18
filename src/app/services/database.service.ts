import { Injectable } from '@angular/core';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Platform } from '@ionic/angular';
import { Address, RealtyType } from './models';

@Injectable({
	providedIn: 'root'
})

export class DatabaseService {
	private database: SQLiteObject;
	private dbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

	addresses = new BehaviorSubject([]);
	types = new BehaviorSubject([]);

	constructor(private platform: Platform, private sqlitePorter: SQLitePorter, private sqlite: SQLite, private http: HttpClient) {
		this.platform.ready().then(() => {
			this.sqlite.create({
				name: 'youtanTrial.db',
				location: 'default'
			}).then((db: SQLiteObject) => {
				this.database = db;
				this.seedDatabase();
			}).catch(err => {
				console.log(err);
			})
		}).catch(err => {
			console.log(err);
		})
	}

	private seedDatabase() {
		this.http.get('assets/seed.sql', { responseType: 'text' }).subscribe(sql => {
			this.sqlitePorter.importSqlToDb(this.database, sql).then(_ => {
				this.loadAddresses();
				this.loadTypes();
				this.dbReady.next(true);
			}).catch(err => {
				console.error(err);
			});
		});
	}

	public getDatabaseState() {
		return this.dbReady.asObservable();
	}

	public getAddresses() {
		return this.addresses.asObservable();
	}

	public getTypes() {
		return this.types.asObservable();
	}

	public loadAddresses() {
		return this.database.executeSql('SELECT a.id as addressId, a.address, a.date, a.activityField, a.class, a.description, a.startingDate, a.endingDate, r.id as realtyTypeId, r.realtyType FROM addresses as a LEFT JOIN realtyTypes as r ON a.realtyType = r.id', []).then(data => {
			let addresses = [];
			if (data.rows.length > 0) {
				for (var i = 0; i < data.rows.length; i++) {
					let newAddress = new Address({ 
						id: data.rows.item(i).addressId,
						address: data.rows.item(i).address,
						date: data.rows.item(i).date,
						activityField: data.rows.item(i).activityField,
						class: data.rows.item(i).class,
						description: data.rows.item(i).description,
						startingDate: data.rows.item(i).startingDate,
						endingDate: data.rows.item(i).endingDate,
						realtyType: new RealtyType({
							id: data.rows.item(i).realtyTypeId,
							realtyType: data.rows.item(i).realtyType
						})
					})
					addresses.push(newAddress)
				}
			}
			this.addresses.next(addresses);
		});
	}
	
	public loadTypes() {
		return this.database.executeSql('SELECT * FROM realtyTypes', []).then(data => {
			let types = []
			if (data.rows.length > 0) {
				for (var i = 0; i < data.rows.length; i++) {
					types.push(new RealtyType({
						id: data.rows.item(i).id,
						realtyType: data.rows.item(i).realtyType
					}))
				}
			}
			this.types.next(types);
		})
	}

	public addAddress(address: Address) {
		let toBeInserted = [address.address, address.date, address.activityField, address.classDesc, address.description, address.startingDate, address.endingDate, address.realtyType.id]
		return this.database.executeSql('INSERT INTO addresses (address, date, activityField, class, description, startingDate, endingDate, realtyType) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', toBeInserted).then(data => {
			this.loadAddresses();
		});
	}

	public getAddress(id): Promise<Address> {
		return this.database.executeSql('SELECT a.id as addressId, a.address, a.date, a.activityField, a.class, a.description, a.startingDate, a.endingDate, r.id as realtyTypeId, r.realtyType FROM addresses as a LEFT JOIN realtyTypes as r ON a.realtyType = r.id WHERE a.id = ?', [id]).then(data => {
			return new Address({
				id: data.rows.item(0).addressId,
				address: data.rows.item(0).address,
				date: data.rows.item(0).date,
				activityField: data.rows.item(0).activityField,
				classDesc: data.rows.item(0).class,
				description: data.rows.item(0).description,
				startingDate: data.rows.item(0).startingDate,
				endingDate: data.rows.item(0).endingDate,
				realtyType: new RealtyType({
					id: data.rows.item(0).realtyTypeId,
					realtyType: data.rows.item(0).realtyType
				})
			});
		});
	}

	public updateAddress(address: Address) {
		let toBeUpdated = [address.address, address.date, address.activityField, address.classDesc, address.description, address.startingDate, address.endingDate, address.realtyType.id]
		return this.database.executeSql(`UPDATE addresses SET address = ?, date = ?, activityField = ?, class = ?, description = ?, startingDate = ?, endingDate = ?, realtyType = ? WHERE id = ${address.id}`, toBeUpdated).then(data => {
			this.loadAddresses();
		})
	}

}
