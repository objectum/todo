async function _accessFilter ({store, model, alias}) {
	if (store.roleCode != "admin" && model.getPath () == "item") {
		return `{"prop": "${alias}.user"} = ${store.userId}`;
	}
}
async function _accessCreate ({store, model, data}) {
	if (store.roleCode == "admin") {
		return true;
	}
	if (["item", "t.item.file"].indexOf (model.getPath ()) > -1) {
		return data.user == store.userId;
	}
	return false;
}
async function _accessRead ({store, model, record}) {
	if (store.roleCode == "admin") {
		return true;
	}
	if (model.getPath () == "item" && record.user != store.userId) {
		return false;
	}
	return true;
}
async function _accessUpdate ({store, model, record, data}) {
	if (store.roleCode == "admin") {
		return true;
	}
	if (model.getPath () == "item" && (
		record.user != store.userId || (data.hasOwnProperty ("user") && data.user != store.userId)
	)) {
		return false;
	}
	return true;
}
async function _accessDelete ({store, model, record}) {
	if (store.roleCode == "admin") {
		return true;
	}
	if (model.getPath () == "item" && record.user == store.userId) {
		return true;
	}
	if (model.getPath () == "t.item.file") {
		let itemRecord = await store.getRecord (record.item);
		return itemRecord.user == store.userId;
	}
	return false;
}

export default {
	_accessFilter,
	_accessCreate,
	_accessRead,
	_accessUpdate,
	_accessDelete
};
