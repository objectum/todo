import {Store} from "objectum-client";
import {ObjectumApp, ObjectumRoute, locales} from "objectum-react";
import ToDo from "./components/ToDo";
import mediator from "./modules/mediator";
import ru from "./locales/ru.json";

import "./css/bootstrap.css";
import "objectum-react/lib/fontawesome/css/all.css";
import "./css/todo.css";

const store = new Store ();
store.setUrl ("/api");
mediator.init ({store});
window.store = store;
Object.assign (locales.ru, ru);

export default function App () {
	let opts = {
		store,
		name: process.env.REACT_APP_NAME || "todo",
		version: process.env.REACT_APP_VERSION
	};
	if (process.env.NODE_ENV === "development") {
		opts.username = "admin";
		opts.password = require ("crypto").createHash ("sha1").update ("admin").digest ("hex").toUpperCase ();
		opts.locale = "ru";
	}
	return <ObjectumApp {...opts}>
		<ObjectumRoute exact path="/" render={props => <ToDo {...props} />} />
	</ObjectumApp>;
};
