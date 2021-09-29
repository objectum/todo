/* eslint-disable no-whitespace-before-property */
/* eslint-disable eqeqeq */

import ItemModel from "../ItemModel.js";

export default class ServerItemModel extends ItemModel {
	static async csv ({store}) {
		let properties = Object.keys (store.getModel ("item").properties);
		let records = await store.getRecords ({
			model: "item",
			filters: [
				["user", "=", store.userId]
			]
		});
		let result = [properties.join (";")];

		records.forEach (record => {
			result.push (properties.map (p => record [p]).join (";"));
		});
		return result.join ("\n");
	}
};
