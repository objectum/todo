/* eslint-disable no-whitespace-before-property */
/* eslint-disable eqeqeq */

import {execute} from "objectum-client";

let store;
let data = {};
let value = {};
let record = {};
let records = {};
let listeners = {};

function init (opts) {
	store = opts.store;
}

async function set (a, v, opts) {
	value [a] = v;
	await callListeners ("change", {option: a, value: v, opts: opts || {}});
}

function get (a) {
	return value [a];
}

function addListener (e, fn) {
	listeners [e] = listeners [e] || [];
	listeners [e].push (fn);
}

function removeListener (e, fn) {
	listeners [e] = listeners [e] || [];
	
	for (let i = 0; i < listeners [e].length; i ++) {
		if (listeners [e][i] == fn) {
			listeners [e].splice (i, 1);
			break;
		}
	}
}

async function callListeners (e, opts) {
	if (listeners [e]) {
		for (let i = 0; i < listeners [e].length; i ++) {
			await execute (listeners [e][i], opts);
		}
	}
}

function isExpert () {
	if (record.role?.code == "manager" || record.role?.code == "expert") {
		return true;
	}
	return false;
}

const opts = {
	init,
	data,
	records,
	record,
	set,
	get,
	value,
	store,
	addListener,
	removeListener,
	isExpert
};
export default opts;
export {
	init,
	data,
	records,
	record,
	set,
	get,
	value,
	store,
	addListener,
	removeListener,
	isExpert
};
