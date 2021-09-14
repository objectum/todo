/* eslint-disable no-whitespace-before-property */
/* eslint-disable eqeqeq */

import {useState, useEffect, useRef} from "react";
import {Form, Field, JsonField, BooleanField, FileField, Group, Action, Loading, i18n} from "objectum-react";
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
	let [categoryRecords, setCategoryRecords] = useState ([]);
	let [fileRecords, setFileRecords] = useState ([]);
	let [item, setItem] = useState (null);
	let [hoverItem, setHoverItem] = useState (null);
	let [name, setName] = useState ("");
	let [error, setError] = useState ("");
	let [completeVisible, setCompleteVisible] = useState (false);
	let [uploading, setUploading] = useState (false);
	let inputRef = useRef ();

	useEffect (() => {
		async function load () {
			updateItemRecords (await store.getRecords ({model: "item"}));
			setFileRecords (await store.getRecords ({model: "t.item.file"}));
			setCategoryRecords (await store.getDict ("d.item.category"));
			setLoading (false);
			inputRef.current.focus ();
		}
		load ();
	}, []);

	if (loading) {
		return <Loading container />;
	}
	async function onKeyDown (e) {
		if (e.key === "Enter" && name) {
			setCreating (name);
			try {
				await store.transaction (async () => {
					let record = await store.createRecord ({_model: "item", name, user: store.userId});
					setCreating (false);
					setName ("");
					setItemRecords ([record, ...itemRecords]);
					inputRef.current.focus ();
				});
			} catch (e) {
				setError (e.message);
			}
		}
	}
	function renderBadges (record) {
		let o = record.getOpts ("category");
		let elements = [];

		if (record.note) {
			elements.push (<span key="note" className="badge badge-secondary mr-1"><i className="fas fa-sticky-note mr-1" />{i18n ("Note")}</span>);
		}
		if (fileRecords.filter (fileRecord => fileRecord.item == record.id).length) {
			elements.push (<span key="files" className="badge badge-secondary mr-1"><i className="fas fa-paperclip mr-1" />{i18n ("Files attached")}</span>);
		}
		for (let a in o) {
			if (o [a]) {
				let categoryRecord = categoryRecords.find (record => record.name == a);
				elements.push (<span key={a} className="badge mr-1" style={{backgroundColor: categoryRecord.color}}>{a}</span>);
			}
		}
		return <div>{elements}</div>;
	}
	function renderItems (items) {
		return items.map ((record, i) => {
			let checkEl = record.done ? <i className="fas fa-check fa-stack-1x" /> : null;

			if (hoverItem == record.id) {
				checkEl = record.done ? null : <i className="fas fa-check fa-stack-1x" />;
			}
			return <tr key={i} className="border-bottom">
				<td className="todo-check todo-cursor" onMouseEnter={() => setHoverItem (record.id)} onMouseLeave={() => setHoverItem (null)}>
					<Action btnClassName="btn btn-link p-0 text-primary" store={store} transaction hideProgress onClick={async () => {
						record.date = new Date ();
						record.done = record.done ? null : new Date ();
						updateItemRecords (itemRecords);
						await record.sync ();
					}}>
						<span className="fa-stack text-info"><i className="far fa-circle fa-stack-2x" />{checkEl}</span>
					</Action>
				</td>
				<td className="todo-name todo-cursor" onClick={() => setItem (record.id)}>{record.name}{renderBadges (record)}</td>
				<td className="todo-star">
					<Action icon={`${record.important ? "fas": "far"} fa-star`} btnClassName="btn btn-link p-0 text-primary" title={i18n ("Important")}
						store={store} transaction hideProgress onClick={async () => {
							record.date = new Date ();
							record.important = record.important ? null : new Date ();
							updateItemRecords (itemRecords);
							await record.sync ();
						}}
					/>
				</td>
				<td className="todo-star">
					<Action icon="fas fa-times" btnClassName="btn btn-link p-0 text-danger" title={i18n ("Remove")}
						store={store} transaction hideProgress onClick={async () => {
							setItem (null);
							await store.removeRecord (record.id);
							setItemRecords (itemRecords.filter (itemRecord => itemRecord.id != record.id));
						}}
					/>
				</td>
			</tr>;
		});
	}
	let actualRecords = itemRecords.filter (record => !record.done);
	let completeRecords = itemRecords.filter (record => !!record.done);

	return <div className="container">
		<div className="d-flex bg-white rounded shadow-sm">
			<div className="w-100 d-flex">
				<div className="px-1 w-100">
					<table className="">
						<tbody>
							<tr className="border-bottom">
								<td className="todo-check"><i className="fas fa-plus fa-2x text-muted" /></td>
								<td className="todo-name">
									<input className="form-control" placeholder={i18n ("Add task")} onChange={e => setName (e.target.value)}
										onKeyDown={onKeyDown} value={name} disabled={creating} ref={inputRef} />
									{error && <div className="alert alert-danger my-1">{error}</div>}
								</td>
								<td className="todo-star"><i className="far fa-star text-muted" /></td>
								<td className="todo-star"><i className="fas fa-times text-muted" /></td>
							</tr>
							{creating && <tr className="border-bottom">
								<td className="todo-check"><span className="fa-stack text-secondary"><i className="far fa-circle fa-stack-2x" /></span></td>
								<td className="todo-name text-muted" colSpan={3}>{creating}</td>
							</tr>}
							{renderItems (actualRecords)}
							<tr className="todo-cursor" onClick={() => setCompleteVisible (!completeVisible)}>
								<td className="todo-check"><i className={`fas ${completeVisible ? "fa-chevron-down" : "fa-chevron-right"} fa-2x text-muted`} /></td>
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
						<Field property="type" dict hideLabel />
						<Group label="Category" className="mb-1">
							<JsonField property="category" col={6} props={categoryRecords.map (record => {
								return {
									prop: record.name,
									label: <span className="badge" style={{backgroundColor: record.color}}>{record.name}</span>,
									component: BooleanField
								};
							})} />
						</Group>
						<Field property="note" hideLabel />
					</Form>
					{fileRecords.filter (record => record.item == item).map ((record, i) => {
						return <div key={i} className="p-1 d-flex align-items-center">
							<Action icon="fas fa-times" btnClassName="btn btn-link p-0 text-danger mr-1" title={i18n ("Remove")}
								store={store} transaction hideProgress onClick={async () => {
									await store.removeRecord (record.id);
									setFileRecords (fileRecords.filter (fileRecord => fileRecord.id != record.id));
								}}
							/>
							<a href={record.getRef ("file")} target="_blank" rel="noreferrer">{record.file}</a>
						</div>;
					})}
					{!uploading && <FileField onChange={async ({value, file}) => {
						await store.transaction (async () => {
							setUploading (true);
							let record = await store.createRecord ({_model: "t.item.file", item, file: value});
							// hot reload: new file in /public/files
							await store.upload ({recordId: record.id, propertyId: store.getProperty ("t.item.file.file").id, name: value, file});
							setFileRecords ([...fileRecords, record]);
							setUploading (false);
						});
					}} />}
				</div>}
			</div>
		</div>
	</div>;
}
