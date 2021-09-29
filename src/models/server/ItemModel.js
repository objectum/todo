/* eslint-disable no-whitespace-before-property */
/* eslint-disable eqeqeq */

import ItemModel from "../ItemModel.js";

function timeout (ms) {
	return new Promise (resolve => setTimeout (() => resolve (), ms));
}

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
	async progressDemo ({progress}) {
		// show progress on client side
		for (let i = 0; i < 10; i ++) {
			await timeout (1000);
			progress ({label: "processing", value: i + 1, max: 10});
		}
		return this.name;
	}
};
