import { LightningElement, api } from 'lwc';

export default class MyDateTimeLwc extends LightningElement {

	@api
	value;

	connectedCallback() {
		console.log('value: ' + JSON.stringify(this.value));
		console.log('dateTime value: ' + this.value.dateTimeValue);
	}

	get dateTimeValue() {
		return this.value ? this.value.dateTimeValue : '';
	}

	get formatDateTime() {
		if (this.value && this.value.dateTimeValue) {
			const date = new Date(this.value.dateTimeValue);
			console.log('Parsed date: ' + date);
			const year = date.getUTCFullYear();
			// getUTCMonth() is zero-indexed (0 is January), so add 1
			const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
			const day = date.getUTCDate().toString().padStart(2, '0');
			const hours = date.getUTCHours().toString().padStart(2, '0');
			const minutes = date.getUTCMinutes().toString().padStart(2, '0');

			return `${year}-${month}-${day} ${hours}:${minutes}`;
		}
		return '';
	}

}