const ldap = require('ldapjs');
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';


dotenv.config();
declare global {
    var flag: boolean;
  }
  const client = ldap.createClient({
    url: process.env.LDAP_URI,
    reconnect: true,
        idleTimeout: 10000,
        initialDelay: 100,
        maxDelay: 500,
        failAfter: 5
    });

export function authenticateDN(name_user: any, password: any) {

    /*bind use for authentication*/
    client.bind(name_user, password, function (err: any) {
        if (err) {
            console.log("Error in new connetion " + err)
        } else {
            /*if connection is success then go for any operation*/
            addOu();
            console.log("Success");
        }
    });
}

// create a function to add Organizational Unit
function addOu(){
    var entry = {
        ou: "laluUsers",
        objectclass:  'organizationalUnit',

    };
    client.add('ou=laluUsers,dc=lalu,dc=dev', entry, function (err: any) {
        if (err) {
            console.log("err in new user " + err);
        } else {
            console.log("added user")
        }
    });
}

// create a function to add user
export function addUser(user_name:string, name:string,  email:string, password:string) {
    if (!validateEmail(email)){
         return console.log("Email is not valid");
    }
    var entry = {
        cn: user_name,
        sn: name, 
        mail: email,
        userPassword: password,
        objectclass:  'inetOrgPerson' 
    };
    
    client.add('cn=' + user_name + ',ou=laluUsers,dc=lalu,dc=dev', entry, function (err: any) {
        if (err) {
            console.log("err in new user " + err);
        } else {
            console.log("added user")
        }
    });
}

//Validates the email format
function validateEmail(email:string) {
    const regularExpression = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regularExpression.test(String(email).toLowerCase());
   }


// create a function to search user
export function searchUser(username:string, password:string): any {

    return new Promise((resolve, reject) => {
        var opts = {
            filter: '(objectClass=inetOrgPerson)',  //simple search
            scope: 'sub',
            attributes: ['cn', 'userPassword']
        };
    
        //Client operation search 
        var flag_l: any = null ;
        client.search('ou=laluUsers,dc=lalu,dc=dev', opts, function (err: any, res: any) {
            if (err) {
                console.log("Error in search " + err)
                return reject(err);
            } else {
                res.on('searchEntry', function (entry : any) {
                    //console.log('entry: ' + JSON.stringify(entry.object));
                    if (entry.object.cn == username && bcrypt.compareSync(password, entry.object.userPassword)) {
                        flag_l = true; 
                    } else {
                        
                        flag_l = false; 
                    }  
                });
                
                
                //define the state of the search to the global function 
                res.on('end', (result:any) => {
                    if (flag_l){
                        console.log("User found");
                        return resolve(true)
                    }
                    else{
                        console.log("User doesn't exist in directory");
                        return resolve(false)                  
                    }
                  });
            }
        
        });

        }).catch(()=>null); // unused rejection handler
        
}

//create a function to modify LDAP password
export function modifyPassword(username:string, password:string) {
    const change = new ldap.Change({
        operation: 'replace',
        modification: {
            userPassword: password
        }
      });
    client.modify('cn=' + username +',ou=laluUsers,dc=lalu,dc=dev', change, function (err: any) {
        if (err) {
            console.log("err in new user " + err);
        } else {
            console.log("password changed")
        }
    });
}