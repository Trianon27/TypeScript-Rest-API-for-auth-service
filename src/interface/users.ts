export interface users{
    id?: number,
    first_name: string,
    second_name: string,
    user_name: string,
    email: string,
    user_password: string,
    confirm_password: string,
    birth: Date,

    /*    
{
    "first_name": "Test1",
    "second_name": "Test1",
    "user_name": "Test1",
    "email": "Test1@test.com",
    "user_password": "1234",
    "confirm_password": "1234",
    "birth" : "2014-01-01T23:28:56.7-05:00"
}
    */
}