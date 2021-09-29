import {useState} from "react";
import {Action} from "objectum-react";
import {store} from "../modules/mediator";

export default function TaskActions ({item}) {
	let [csv, setCsv] = useState ("");

	return <div>
		<div className="d-flex" style={{width: "50em"}}>
			<Action label="JSON" icon="fab fa-js" disabled={!item} onClick={async () => {
/*
				// Client:
				let record = await store.getRecord (item);
				let result = record.toJSON ();
*/
				// Server:
				let result = await store.remote ({
					model: "item",
					method: "toJSON",
					id: item
				});
				return `${result}`;
			}} />
			<Action label="Export CSV" icon="fas fa-file-csv" onClick={async () => {
				setCsv (await store.remote ({
					model: "item",
					method: "csv"
				}));
			}} />
		</div>
		<textarea className="form-control text-monospace mt-1" rows={10} value={csv} readOnly />
	</div>;
}
