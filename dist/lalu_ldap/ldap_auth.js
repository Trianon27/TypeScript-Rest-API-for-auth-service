"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.modifyPassword = exports.searchUser = exports.addUser = exports.authenticateDN = void 0;
const ldap = require('ldapjs');
const bcrypt_1 = __importDefault(require("bcrypt"));
const client = ldap.createClient({
    url: 'ldap:localhost:8085'
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
    client.add('ou=laluUsers,dc=lalu,dc=unal,dc=edu,dc=co', entry, function (err) {
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
    client.add('cn=' + user_name + ',ou=laluUsers,dc=lalu,dc=unal,dc=edu,dc=co', entry, function (err) {
        if (err) {
            console.log("err in new user " + err);
        }
        else {
            console.log("added user");
        }
    });
}
exports.addUser = addUser;
function validateEmail(email) {
    const regularExpression = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regularExpression.test(String(email).toLowerCase());
}
// create a function to search user
var flag_l = null;
function searchUser(username, password) {
    var opts = {
        filter: '(objectClass=inetOrgPerson)',
        scope: 'sub',
        attributes: ['cn', 'userPassword']
    };
    client.search('ou=laluUsers,dc=lalu,dc=unal,dc=edu,dc=co', opts, function (err, res) {
        if (err) {
            console.log("Error in search " + err);
        }
        else {
            res.on('searchEntry', function (entry) {
                //console.log('entry: ' + JSON.stringify(entry.object));
                if (entry.object.cn == username && bcrypt_1.default.compareSync(password, entry.object.userPassword)) {
                    console.log("User found");
                    flag_l = true;
                }
                else {
                    console.log("User doesn't exist in directory");
                    flag_l = false;
                }
            });
            res.on('end', (result) => {
                if (flag_l) {
                    global.flag = true;
                }
                else {
                    global.flag = false;
                }
            });
        }
    });
    return global.flag;
    //let object: any = null
    /* client.search('ou=laluUsers,dc=lalu,dc=unal,dc=edu,dc=co', opts, (err:any, res:any) => {

      res.on('searchEntry', entry => {
        object = entry.object
      })

      res.on('error', err => {
        console.error('error: ' + err.message)
        client.destroy()
        reject(err)
      })
      res.on('end', result => {
        if (!object) {
          client.destroy()
          return reject('Invalid user on ldap')
        }
        client.bind(object.dn, password, err => {
          if (err) {
            client.destroy()
            console.error('Invalid Login', err)
            return reject(err)
          }

          client.destroy()

          return resolve(new User(object.dn, object.sAMAccountName, object.mail))
        })
      })
    }) */
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
    client.modify('cn=' + username + ',ou=laluUsers,dc=lalu,dc=unal,dc=edu,dc=co', change, function (err) {
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