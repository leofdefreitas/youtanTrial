export class Address {
	public id: number = 0;
	public address: string = '';
	public date: string = '';
	public activityField: string = '';
	public classDesc: string = '';
	public description: string = '';
	public startingDate: string = '';
	public endingDate: string = '';
    public realtyType: RealtyType = new RealtyType();
    
    constructor(address?: Object) {
        if (typeof address == 'undefined' || address == null) return;

        for (let i of Object.keys(this)) {
            if (this[i] !== null && typeof this[i] == 'object') continue;
            if (address[i] != undefined) this[i] = address[i]
        }

        if (typeof address['realtyType'] != 'undefined') {
            this.realtyType = Object.assign({}, address['realtyType']);
        }
    }
}

export class RealtyType {
    public id: number = 0;
    public realtyType: string = '';

    constructor(realtyType?: Object) {
        if (typeof realtyType == 'undefined' || realtyType == null) return;

        for (let i of Object.keys(this)) {
            if (realtyType[i] != undefined) this[i] = realtyType[i]
        }
    }
}