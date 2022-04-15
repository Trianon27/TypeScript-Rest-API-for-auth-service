CREATE DATABASE users_lalu;

CREATE TABLE users(
    id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(80) NOT NULL,
    second_name VARCHAR(80) NOT NULL,
    user_name VARCHAR(80) NOT NULL,
    email VARCHAR(80) NOT NULL,
    user_password VARCHAR(80) NOT NULL,
    confirm_password VARCHAR(80) NOT NULL,
    birth DATETIME NOT NULL
);

DESCRIBE users;