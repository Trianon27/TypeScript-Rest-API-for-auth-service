import dotenv from 'dotenv';
import {authenticateDN} from './lalu_ldap/ldap_auth'; 
dotenv.config();




import { App } from "./app";

async function main() {
    const app = new App(3000);
    await app.listen();
    authenticateDN("cn=admin,dc=lalu,dc=unal,dc=edu,dc=co", "admin");
}

main();

