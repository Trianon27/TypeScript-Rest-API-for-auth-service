"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.modifyPassword = exports.searchUser = exports.addUser = exports.authenticateDN = void 0;
const ldap = require('ldapjs');
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const client = ldap.createClient({
    url: process.env.LDAP_URI,
    reconnect: true,
    idleTimeout: 300000000000,
    initialDelay: 100,
    maxDelay: 500000000000000,
    failAfter: 5
});
function authenticateDN(name_user, password) {
    /*bind use for authentication*/
    client.bind(name_user, password, function (err) {
        if (err) {
            console.log("Error in new connetion " + err);
        }
        else {
            /*if connection is success then go for any operation*/
            addOu();
            console.log("Success");
        }
    });
}
exports.authenticateDN = authenticateDN;
// create a function to add Organizational Unit
function addOu() {
    var entry = {
        ou: "laluUsers",
        objectclass: 'organizationalUnit',
    };
    client.add('ou=laluUsers,dc=lalu,dc=dev', entry, function (err) {
        if (err) {
            console.log("err in new user " + err);
        }
        else {
            console.log("added user");
        }
    });
}
// create a function to add user
function addUser(user_name, name, email, password) {
    if (!validateEmail(email)) {
        return console.log("Email is not valid");
    }
    var entry = {
        cn: user_name,
        sn: name,
        mail: email,
        userPassword: password,
        objectclass: 'inetOrgPerson'
    };
    client.add('cn=' + user_name + ',ou=laluUsers,dc=lalu,dc=dev', entry, function (err) {
        if (err) {
            console.log("err in new user " + err);
        }
        else {
            console.log("added user");
        }
    });
}
exports.addUser = addUser;
//Validates the email format
function validateEmail(email) {
    const regularExpression = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regularExpression.test(String(email).toLowerCase());
}
// create a function to search user
function searchUser(username, password) {
    return new Promise((resolve, reject) => {
        var opts = {
            filter: '(objectClass=inetOrgPerson)',
            scope: 'sub',
            attributes: ['cn', 'userPassword']
        };
        //Client operation search 
        var flag_l = null;
        client.search('ou=laluUsers,dc=lalu,dc=dev', opts, function (err, res) {
            if (err) {
                console.log("Error in search " + err);
                return reject(err);
            }
            else {
                res.on('searchEntry', function (entry) {
                    //console.log('entry: ' + JSON.stringify(entry.object));
                    if (entry.object.cn == username && bcrypt_1.default.compareSync(password, entry.object.userPassword)) {
                        flag_l = true;
                    }
                    else {
                        flag_l = false;
                    }
                });
                //define the state of the search to the global function 
                res.on('end', (result) => {
                    if (flag_l) {
                        console.log("User found");
                        return resolve(true);
                    }
                    else {
                        console.log("User doesn't exist in directory");
                        return resolve(false);
                    }
                });
            }
        });
    }).catch(() => null); // unused rejection handler
}
exports.searchUser = searchUser;
//create a function to modify LDAP password
function modifyPassword(username, password) {
    const change = new ldap.Change({
        operation: 'replace',
        modification: {
            userPassword: password
        }
    });
    client.modify('cn=' + username + ',ou=laluUsers,dc=lalu,dc=dev', change, function (err) {
        if (err) {
            console.log("err in new user " + err);
        }
        else {
            console.log("password changed");
        }
    });
}
exports.modifyPassword = modifyPassword;
//# sourceMappingURL=ldap_auth.js.map