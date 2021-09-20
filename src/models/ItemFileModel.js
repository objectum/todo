import React from "react";
import {Record} from "objectum-client";

export default class ItemFileModel extends Record {
	static _renderGrid ({grid}) {
		return React.cloneElement (grid, {
			label: "Файлы"
		});
	}
}
