# README #

Exchange website EUR-NLG


### How do I get set up? ###

Setup a nginx server with php7 (+ php-fpm) and a mysql server (latest version)

Import the database located in /application/config/database.sql

Clone the repository and create a nginx config.


### Contribution guidelines ###

* Commit changes every day using git
* Test code
* add all changes to the database in database.sql
* please communicate is you have any questions or ideas.

### Database ###

Table user => Mdl_user.php

Tables have: 
* id as primary key
* <table_name>_id

Use the query builder so vars are escaped. Please check that all keys are added.

### Code design ###
- reusable blocks for chart, buy, sell etc
- reusable model methods

### Code ###
* No camelCase
* views => v_viewname.php
* Controllers => Controller.php
* Models => Mdl_<tablename>.php
* js for each method in a different file /js/<controller/function>/<method>.js
* js/css is loaded trough the asset library
* views are loaded in variables
* main view is loaded through view() function

### Security ###
* input -> typecasting (int,string, array, etc)
* input -> form validation through javascript
* input -> form validation.
* CSRF
* output -> xss

### Ajax ###
- always reset CSRF token
- always use serialize();
- always validate fields before submit (jquery.validate)