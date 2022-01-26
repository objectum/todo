/* eslint-disable no-whitespace-before-property */
/* eslint-disable eqeqeq */

import {Store} from "objectum-client";
import {ObjectumApp, ObjectumRoute, ModelList, Action, locales, i18n} from "objectum-react";
import ToDo from "./components/ToDo";
import ItemModel from "./models/client/ItemModel";
import ItemFileModel from "./models/ItemFileModel";
import mediator from "./modules/mediator";
import ru from "./locales/ru.json";
import "./css/bootstrap.css";
import "objectum-react/lib/css/objectum.css";
import "objectum-react/lib/fontawesome/css/all.css";
import "./css/todo.css";

const store = new Store ();
store.setUrl ("/api");
store.register ("item", ItemModel);
store.register ("t.item.file", ItemFileModel);
store.addListener ("connect", async () => {
	await store.getDict ("d.item.category");
});
window.store = store;
mediator.init ({store});
Object.assign (locales.ru, ru);

export default function App () {
	let opts = {
		store,
		registration: true,
		name: process.env.REACT_APP_NAME || "todo",
		version: process.env.REACT_APP_VERSION,
		siteKey: process.env.REACT_APP_SITE_KEY,
		onCustomRender: ({content}) => {
			if (!store.getSessionId ()) {
				return <div>
					<div>{content}</div>
					<div className="text-center"><Action icon="fas fa-key" label={i18n ("Create temporary account and sign in")} hideProgress onClick={async () => {
						let {username, password} = await store.remote ({
							model: "admin",
							method: "createTemporaryAccount"
						});
						await store.auth ({username, password});
					}} /></div>
				</div>;
			}
		}
	};
/*
	if (process.env.NODE_ENV === "development") {
		opts.username = "admin";
		opts.password = require ("crypto").createHash ("sha1").update ("admin").digest ("hex").toUpperCase ();
	}
*/
	return <ObjectumApp {...opts}>
		<ObjectumRoute exact path="/" render={props => {
			return store.username == "admin" ? <div className="container"><ModelList {...props} store={store} model="item" /></div> : <ToDo {...props} />;
		}} />
	</ObjectumApp>;
};
