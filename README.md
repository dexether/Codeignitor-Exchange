# README #

Exchange website EUR-NLG


### How do I get set up? ###

Setup a nginx server with php7 and a mysql server

Import the database located in /application/config/database.sql

Clone the repository and create a nginx config.


### Contribution guidelines ###

* Commit changes every day using git
* Test code
* add all changes to the database in database.sql

### Database ###

Table user => Mdl_user.php

Tables have: 
* id as primary key
* <table_name>_id

Use the query builder so vars are escaped

### Code ###
* No camelCase
* views => v_viewname.php
* Controllers => Controller.php
* Models => Mdl_<tablename>.php