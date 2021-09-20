/* eslint-disable no-whitespace-before-property */
/* eslint-disable eqeqeq */

import React from "react";
import {Record} from "objectum-client";
import {BooleanField, JsonField, Group} from "objectum-react";
import {store} from "../modules/mediator";

export default class ItemModel extends Record {
	static _renderGrid ({grid}) {
		return React.cloneElement (grid, {
			label: "Tasks",
			query: "item.list"
		});
	}

	static _layout ({id}) {
		return {
			"Task": [
				"id",
				[
					"name"
				],
				[
					...(id ? ["date", "done", "important", ""] : [])
				],
				[
					{"property": "type", "class": "col-6"},
					"user"
				],
				[
					<Group label="Category" className="mb-1">
						<JsonField property="category" col={6} props={store.map.dict ["d.item.category"].map (record => {
							return {
								prop: record.name,
								label: <span className="badge" style={{backgroundColor: record.color}}>{record.name}</span>,
								component: BooleanField
							};
						})} />
					</Group>
				],
				[
					"note"
				],
				[
					"t.item.file"
				]
			]
		};
	}
};
