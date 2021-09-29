/* eslint-disable no-whitespace-before-property */
/* eslint-disable eqeqeq */

import {Record} from "objectum-client";

export default class ItemModel extends Record {
	toJSON () {
		return JSON.stringify (this._data);
	}
};
