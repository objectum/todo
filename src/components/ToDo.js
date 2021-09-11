/* eslint-disable no-whitespace-before-property */
/* eslint-disable eqeqeq */

import {useState, useEffect, useRef} from "react";
import {Form, Field, Action, Loading, i18n} from "objectum-react";
import {store} from "../modules/mediator";

export default function ToDo () {
	let [loading, setLoading] = useState (true);
	let [creating, setCreating] = useState (false);
	let [itemRecords, setItemRecords] = useState ([]);
	let updateItemRecords = items => {
		items.sort ((a, b) => {
			if (a.date > b.date) {
				return -1;
			}
			return 1;
		});
		setItemRecords ([...items]);
	};
	let [item, setItem] = useState (null);
	let [hoverItem, setHoverItem] = useState (null);
	let [name, setName] = useState ("");
	let [error, setError] = useState ("");
	let [completeVisible, setCompleteVisible] = useState (false);
	let inputRef = useRef ();

	useEffect (() => {
		async function load () {
			updateItemRecords (await store.getRecords ({model: "item"}));
			setLoading (false);
			inputRef.current.focus ();
		}
		load ();
	}, []);

	if (loading) {
		return <div className="p-5"><Loading /></div>;
	}
	async function onKeyDown (e) {
		if (e.key === "Enter" && name) {
			setCreating (true);
			await store.startTransaction ();

			try {
				let record = await store.createRecord ({_model: "item", name});
				await store.commitTransaction ();
				setItemRecords ([record, ...itemRecords]);
			} catch (e) {
				await store.rollbackTransaction ();
				setError (e.message);
			}
			setCreating (false);
			setName ("");
			inputRef.current.focus ();
		}
	}
	function renderItems (items) {
		return items.map ((record, i) => {
			let checkEl = record.done ? <i className="fas fa-check fa-stack-1x" /> : null;

			if (hoverItem == record.id) {
				checkEl = record.done ? null : <i className="fas fa-check fa-stack-1x" />;
			}
			return <tr key={i} className="border-bottom">
				<td
					className="todo-check todo-cursor"
					onMouseEnter={() => setHoverItem (record.id)}
					onMouseLeave={() => setHoverItem (null)}
				>
					<Action
						btnClassName="btn btn-link p-0 text-primary"
						transaction
						store={store}
						onClick={async () => {
							record.date = new Date ();
							record.done = record.done ? null : new Date ();
							updateItemRecords (itemRecords);
							await record.sync ();
						}}
					>
						<span className="fa-stack text-info">
							<i className="far fa-circle fa-stack-2x" />
							{checkEl}
						</span>
					</Action>
				</td>
				<td className="todo-name todo-cursor" onClick={() => setItem (record.id)}>{record.name}</td>
				<td className="todo-star">
					<Action
						icon={`${record.important ? "fas": "far"} fa-star`}
						btnClassName="btn btn-link p-0 text-primary"
						title={i18n ("Important")}
						transaction
						store={store}
						onClick={async () => {
							record.date = new Date ();
							record.important = record.important ? null : new Date ();
							updateItemRecords (itemRecords);
							await record.sync ();
						}}
					/>
				</td>
				<td className="todo-star">
					<Action
						icon="fas fa-times"
						btnClassName="btn btn-link p-0 text-danger"
						title={i18n ("Remove")}
						transaction
						store={store}
						onClick={async () => {
							setItem (null);
							setItemRecords (itemRecords.filter (itemRecord => itemRecord.id != record.id));
							await store.removeRecord (record.id);
						}}
					/>
				</td>
			</tr>;
		});
	}
	let actualRecords = itemRecords.filter (record => !record.done);
	let completeRecords = itemRecords.filter (record => !!record.done);

	return <div className="container pt-3">
		<div className="d-flex bg-white rounded shadow-sm">
			<div className="w-100 d-flex">
				<div className="px-1 w-100">
					<table className="">
						<tbody>
							<tr className="border-bottom">
								<td className="todo-check">
									<i className="fas fa-plus fa-2x text-muted" />
								</td>
								<td className="todo-name">
									<input
										className="form-control"
										placeholder={i18n ("Add task")}
										onChange={e => setName (e.target.value)}
										onKeyDown={onKeyDown}
										value={name}
										disabled={creating}
										ref={inputRef}
									/>
									{error && <div className="alert alert-danger my-1">{error}</div>}
								</td>
								<td className="todo-star"><i className="far fa-star text-muted" /></td>
								<td className="todo-star"><i className="fas fa-times text-muted" /></td>
							</tr>
							{creating && <tr>
								<td />
								<td className="align-middle p-2 w-100"><Loading /></td>
								<td colSpan={2} />
							</tr>}
							{renderItems (actualRecords)}
							<tr className="todo-cursor" onClick={() => setCompleteVisible (!completeVisible)}>
								<td className="todo-check">
									<i className={`fas ${completeVisible ? "fa-chevron-down" : "fa-chevron-right"} fa-2x text-muted`} />
								</td>
								<td className="todo-name">
									<span className="font-weight-bold">{i18n ("Completed")}</span>
									{completeRecords.length ? <span className="ml-2">{completeRecords.length}</span> : null}
								</td>
							</tr>
							{completeVisible && renderItems (completeRecords)}
						</tbody>
					</table>
				</div>
				{item && <div className="todo-item border-left ml-2 p-2">
					<Form store={store} rsc="record" rid={item} mid="item" autoSave>
						<Field property="name" hideLabel />
{/*
						<select className="custom-select">
							<option selected>Open this select menu</option>
							<option value="1" className="text-primary">One</option>
							<option value="2">Two</option>
							<option value="3">Three</option>
						</select>
*/}
						<Field property="category" dict />
						<Field property="note" hideLabel />
					</Form>
				</div>}
			</div>
		</div>
	</div>;
}
