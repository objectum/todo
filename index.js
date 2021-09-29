import Proxy from "objectum-proxy";
import fs from "fs";
import {fileURLToPath} from "url";
import {dirname} from "path";
import accessMethods from "./src/modules/access.js";
import adminMethods from "./src/modules/admin.js";
import ItemModel from "./src/models/server/ItemModel.js";

const __filename = fileURLToPath (import.meta.url);
const __dirname = dirname (__filename);
const config = JSON.parse (fs.readFileSync ("./config.json", "utf8"));
const proxy = new Proxy ();

proxy.register ("item", ItemModel);
proxy.registerAccessMethods (accessMethods);
proxy.registerAdminMethods ({
	...proxy.getOfficeMethods ({
		role: "user",
		smtp: config.smtp,
		secret: config.secret,
		secretKey: config.secretKey
	}),
	...adminMethods
});
proxy.start ({config, path: "/api", __dirname});
