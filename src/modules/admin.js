import crypto from "crypto";

let role;

async function createTemporaryAccount ({store}) {
	return await store.transaction (async () => {
		if (!role) {
			let records = await store.getRecords ({
				model: "objectum.role",
				filters: [
					["code", "=", "user"]
				]
			});
			role = records [0].id;
		}
		let username = `user-${new Date ().getTime ()}`;
		let password = crypto.createHash ("sha1").update (username).digest ("hex").toUpperCase ();

		await store.createRecord ({
			_model: "objectum.user",
			login: username,
			password,
			role
		});
		return {username, password};
	});
}

export default {
	createTemporaryAccount
};
