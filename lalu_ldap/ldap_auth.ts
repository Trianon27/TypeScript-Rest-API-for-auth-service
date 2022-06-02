const ldap = require('ldapjs');

const client = ldap.createClient({
    url: 'ldap:localhost:8085'
  });



export function authenticateDN(name_user: any, password: any) {


    
    /*bind use for authentication*/
    client.bind(name_user, password, function (err: any) {
        if (err) {
            console.log("Error in new connetion " + err)
        } else {
            /*if connection is success then go for any operation*/
            console.log("Success");
            searchUser();
            //addUser();
            //deleteUser();
            //addUserToGroup('cn=Administrators,ou=groups,ou=system');
            //deleteUserFromGroup('cn=Administrators,ou=groups,ou=system');
            //updateUser('cn=test,ou=users,ou=system');
            //compare('cn=test,ou=users,ou=system');
            //modifyDN('cn=bar,ou=users,ou=system');
        }
    });
}

function addUser() {
    var entry = {
        cn: 'foo',
        sn: 'bar',
        objectclass: 'top'
    };
    client.add('cn=foo12,ou=sa,dc=lalu,dc=unal,dc=edu,dc=co', entry, function (err: any) {
        if (err) {
            console.log("err in new user " + err);
        } else {
            console.log("added user")
        }
    });
}

function searchUser() {
    var opts = {
        filter: '(objectClass=*)',  //simple search
        //  filter: '(&(uid=2)(sn=John))',// and search
        //filter: '(|(uid=2)(sn=John)(cn=Smith))', // or search
        scope: 'sub',
        attributes: ['sn']
    };

    client.search('ou=sa,dc=lalu,dc=unal,dc=edu,dc=co', opts, function (err: any, res: any) {
        if (err) {
            console.log("Error in search " + err)
        } else {
            res.on('searchEntry', function (entry : any) {
                console.log('entry: ' + JSON.stringify(entry.object));
            });
            res.on('searchReference', function (referral : any) {
                console.log('referral: ' + referral.uris.join());
            });
            res.on('error', function (err : any) {
                console.error('error: ' + err.message);
            });
            res.on('end', function (result  : any) {
                console.log('status: ' + result.status);
            });
        }
    });
}