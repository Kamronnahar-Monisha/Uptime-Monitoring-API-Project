// Handler to handle user related routes
//dependencies
const { hash, parseJSON } = require('../../helpers/utilities');
const data = require('./../../lib/data');

//module scaffolding
const handler = {};


handler.userHandler = (requestProperties, callback) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    if (acceptedMethods.indexOf(requestProperties.method) > -1) {
        handler._users[requestProperties.method](requestProperties, callback);
    }
    else {
        callback(405);
    }
};

handler._users = {};

handler._users.post = (requestProperties, callback) => {
    const firstName =
        typeof requestProperties.body.firstName === 'string' &&
            requestProperties.body.firstName.trim().length > 0
            ? requestProperties.body.firstName
            : false;
    const lastName =
        typeof requestProperties.body.lastName === 'string' &&
            requestProperties.body.lastName.trim().length > 0
            ? requestProperties.body.lastName
            : false;
    const phone =
        typeof requestProperties.body.phone === 'string' &&
            requestProperties.body.phone.trim().length === 11
            ? requestProperties.body.phone
            : false;
    const password =
        typeof requestProperties.body.password === 'string' &&
            requestProperties.body.password.trim().length > 0
            ? requestProperties.body.password
            : false;
    const tosAgreement =
        typeof requestProperties.body.tosAgreement === 'boolean'
            ? requestProperties.body.tosAgreement
            : false;
    if (firstName && lastName && phone && password && tosAgreement) {
        // checking the existence of the user
        data.read('users', phone, (err) => {
            if (err) {
                const newUser = {
                    firstName,
                    lastName,
                    phone,
                    password: hash(password),
                    tosAgreement
                };
                // store the user to file
                data.create('users', phone, newUser, (err) => {
                    if (!err) {
                        callback(200, {
                            message: 'User was created successfully!'
                        });
                    }
                    else {
                        callback(500, {
                            error: 'Could not create user!'
                        });
                    }
                })
            }
            else {
                callback(500, {
                    error: 'Problem is server side or may be user already exist'
                })
            }
        })
    }
    else {
        callback(400, {
            error: 'There is a problem in request'
        })
    }
};


//todo--authentication
handler._users.get = (requestProperties, callback) => {
    //checking the phone number validation
    const phone =
        typeof requestProperties.queryStringObject.phone === 'string' &&
            requestProperties.queryStringObject.phone.trim().length === 11
            ? requestProperties.queryStringObject.phone
            : false;
    if (phone) {
        //search the user
        data.read('users', phone, (err, data) => {
            if (!err && data) {
                const user = { ...parseJSON(data) };
                delete user.password;
                callback(200, user);
            }
            else {
                callback(404, {
                    error: 'Requested user was not found!'
                });
            }
        });
    }
    else {
        callback(400, {
            error: 'There is a problem in request'
        });
    }
};


//todo--authentication
handler._users.put = (requestProperties, callback) => {
    //data validation
    const phone =
        typeof requestProperties.body.phone === 'string' &&
            requestProperties.body.phone.trim().length === 11
            ? requestProperties.body.phone
            : false;

    const firstName =
        typeof requestProperties.body.firstName === 'string' &&
            requestProperties.body.firstName.trim().length > 0
            ? requestProperties.body.firstName
            : false;

    const lastName =
        typeof requestProperties.body.lastName === 'string' &&
            requestProperties.body.lastName.trim().length > 0
            ? requestProperties.body.lastName
            : false;

    const password =
        typeof requestProperties.body.password === 'string' &&
            requestProperties.body.password.trim().length > 0
            ? requestProperties.body.password
            : false;
    if (phone) {
        if (firstName || lastName || password) {
            // checking the user
            data.read('users', phone, (err, userData) => {
                if (!err && userData) {
                    const user = { ...parseJSON(userData) };
                    if (firstName) {
                        user.firstName = firstName;
                    }
                    if (lastName) {
                        user.lastName = lastName;
                    }
                    if (password) {
                        user.password = hash(password);
                    }
                    //update the user
                    data.update('users', phone, user, (err) => {
                        if (!err) {
                            callback(200, {
                                message: 'User was updated successfully'
                            });
                        }
                        else {
                            callback(500, {
                                error: 'There was a problem in the server side!'
                            });
                        }
                    });
                }
                else {
                    callback(404, {
                        error: 'The user with this phone number does not exist.'
                    });
                }
            })
        }
    }
    else {
        callback(400, {
            error: 'You have a problem in your request!',
        });
    }
}

//todo --- authentication
handler._users.delete = (requestProperties, callback) => {
    // check the phone number if valid
    const phone =
        typeof requestProperties.queryStringObject.phone === 'string' &&
            requestProperties.queryStringObject.phone.trim().length === 11
            ? requestProperties.queryStringObject.phone
            : false;
    if(phone){
        //check the user
        data.read('users',phone,(err)=>{
            if(!err){
                data.delete('users',phone,(err)=>{
                    if(!err){
                        callback(200,{
                            message : 'User was successfully deleted!'
                        });
                    }
                    else{
                        callback(500, {
                            error: 'There was a server side error!',
                        });
                    }
                })
            }
            else{
                callback(404, {
                    error: 'There was a server side error or the user with the phone number does not exist',
                });
            }
        })
    }
    else{
        callback(400, {
            error: 'There was a problem in your request!',
        });
    }
};

module.exports = handler;