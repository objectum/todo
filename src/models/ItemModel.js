/* eslint-disable no-whitespace-before-property */
/* eslint-disable eqeqeq */

import objectumClient from "objectum-client";
const Record = objectumClient.Record;

export default class ItemModel extends Record {
	toJSON () {
		return JSON.stringify (this._data);
	}
};
