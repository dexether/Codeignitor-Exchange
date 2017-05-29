<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Migration_Balance extends CI_Migration {

    public function __construct()
    {
        $this->load->dbforge();
        $this->load->database();
    }

    public function up() {

        // balance
        $fields = [];
        $fields['id'] = ['type' => 'INT','constraint' => 11,'auto_increment' => true];
        $fields['user_id'] = ['type' => 'INT','constraint' => 11];
        $fields['NLG'] = ['type' => 'DECIMAL','constraint' => '18,8'];
        $fields['EUR'] = ['type' => 'DECIMAL','constraint' => '18,8'];
        $fields['GTS'] = ['type' => 'DECIMAL','constraint' => '18,8'];

        $this->dbforge->add_field($fields);
        $this->dbforge->add_key('id', true);
        $this->dbforge->add_key('user_id', true);
        $this->dbforge->create_table('balance', true);

        // addresses
        $fields = [];
        $fields['id'] = ['type' => 'INT','constraint' => 11,'auto_increment' => true];
        $fields['user_id'] = ['type' => 'INT','constraint' => 11];
        $fields['NLG'] = ['type' => 'VARCHAR','constraint' => 100];
        $fields['EUR'] = ['type' => 'VARCHAR','constraint' => 100];
        $fields['GTS'] = ['type' => 'VARCHAR','constraint' => 100];

        $this->dbforge->add_field($fields);
        $this->dbforge->add_key('id', true);
        $this->dbforge->add_key('user_id', true);
        $this->dbforge->create_table('addresses', true);

        // country
        $fields = [];
        $fields['id'] = ['type' => 'INT','constraint' => 4,'auto_increment' => true];
        $fields['country'] = ['type' => 'VARCHAR','constraint' => 255];
        $fields['status'] = ['type' => 'VARCHAR','constraint' => 1];

        $this->dbforge->add_field($fields);
        $this->dbforge->add_key('id', true);
        $this->dbforge->create_table('country', true);

         $this->db->query("INSERT INTO `country` VALUES (1,'Afghanistan','A'),(2,'Albania','A'),(3,'Algeria','B'),(4,'Andorra','A'),(5,'American Samoa','A'),(6,'Angola','A'),(7,'Anguilla','A'),(8,'Antartica','A'),(9,'Antigua and Barbuda','A'),(10,'Argentina','A'),(11,'Armenia','A'),(12,'Aruba','A'),(13,'Ashmore and Cartier Island','A'),(14,'Australia','A'),(15,'Austria','A'),(16,'Azerbaijan','A'),(17,'Bahamas','A'),(18,'Bahrain','A'),(19,'Bangladesh','A'),(20,'Barbados','A'),(21,'Belarus','A'),(22,'Belgium','A'),(23,'Belize','A'),(24,'Benin','A'),(25,'Bermuda','A'),(26,'Bhutan','A'),(27,'Bolivia','A'),(28,'Bosnia and Herzegovina','A'),(29,'Botswana','A'),(30,'Brazil','A'),(31,'British Virgin Islands','A'),(32,'Brunei','A'),(33,'Bulgaria','A'),(34,'Burkina Faso','A'),(35,'Burma','A'),(36,'Burundi','A'),(37,'Cambodia','A'),(38,'Cameroon','A'),(39,'Canada','A'),(40,'Cape Verde','A'),(41,'Cayman Islands','A'),(42,'Central African Republic','A'),(43,'Chad','A'),(44,'Chile','A'),(45,'China','A'),(46,'Christmas Island','A'),(47,'Clipperton Island','A'),(48,'Cocos (Keeling) Islands','A'),(49,'Colombia','A'),(50,'Comoros','A'),(51,'Congo','A'),(52,'Cook Islands','A'),(53,'Costa Rica','A'),(54,'Cote dIvoire','A'),(55,'Croatia','A'),(56,'Cuba','A'),(57,'Cyprus','A'),(58,'Czeck Republic','A'),(59,'Denmark','A'),(60,'Djibouti','A'),(61,'Dominica','A'),(62,'Dominican Republic','A'),(63,'Ecuador','A'),(64,'Egypt','A'),(65,'El Salvador','A'),(66,'Equatorial Guinea','A'),(67,'Eritrea','A'),(68,'Estonia','A'),(69,'Ethiopia','A'),(70,'Europa Island','A'),(71,'Falkland Islands (Islas Malvinas)','A'),(72,'Faroe Islands','A'),(73,'Fiji','A'),(74,'Finland','A'),(75,'France','A'),(76,'French Guiana','A'),(77,'French Polynesia','A'),(78,'French Southern and Antarctic Lands','A'),(79,'Gabon','A'),(80,'Gambia','A'),(81,'Gaza Strip','A'),(82,'Georgia','A'),(83,'Germany','A'),(84,'Ghana','A'),(85,'Gibraltar','A'),(86,'Glorioso Islands','A'),(87,'Greece','A'),(88,'Greenland','A'),(89,'Grenada','A'),(90,'Guadeloupe','A'),(91,'Guam','A'),(92,'Guatemala','A'),(93,'Guernsey','A'),(94,'Guinea','A'),(95,'Guinea-Bissau','A'),(96,'Guyana','A'),(97,'Haiti','A'),(98,'Heard Island and McDonald Islands','A'),(99,'Holy See (Vatican City)','A'),(100,'Honduras','A'),(101,'Hong Kong','A'),(102,'Howland Island','A'),(103,'Hungary','A'),(104,'Iceland','A'),(105,'India','A'),(106,'Indonesia','A'),(107,'Iran','A'),(108,'Iraq','A'),(109,'Ireland','A'),(110,'Israel','A'),(111,'Italy','A'),(112,'Jamaica','A'),(113,'Jan Mayen','A'),(114,'Japan','A'),(115,'Jarvis Island','A'),(116,'Jersey','A'),(117,'Johnston Atoll','A'),(118,'Jordan','A'),(119,'Juan de Nova Island','A'),(120,'Kazakhstan','A'),(121,'Kenya','A'),(122,'Kiribati','A'),(123,'Korea North','A'),(124,'Korea South','A'),(125,'Kuwait','A'),(126,'Kyrgyzstan','A'),(127,'Laos','A'),(128,'Latvia','A'),(129,'Lebanon','A'),(130,'Lesotho','A'),(131,'Liberia','A'),(132,'Libya','A'),(133,'Liechtenstein','A'),(134,'Lithuania','A'),(135,'Luxembourg','A'),(136,'Macau','A'),(137,'Macedonia','A'),(138,'Madagascar','A'),(139,'Malawi','A'),(140,'Malaysia','A'),(141,'Maldives','A'),(142,'Mali','A'),(143,'Malta','A'),(144,'Man Isle of','A'),(145,'Marshall Islands','A'),(146,'Martinique','A'),(147,'Mauritania','A'),(148,'Mauritius','A'),(149,'Mayotte','A'),(150,'Mexico','A'),(151,'Micronesia','A'),(152,'Midway Islands','A'),(153,'Moldova','A'),(154,'Monaco','A'),(155,'Mongolia','A'),(156,'Montserrat','A'),(157,'Morocco','A'),(158,'Mozambique','A'),(159,'Namibia','A'),(160,'Nauru','A'),(161,'Nepal','A'),(162,'Netherlands','A'),(163,'Netherlands Antilles','A'),(164,'New Caledonia','A'),(165,'New Zealand','A'),(166,'Nicaragua','A'),(167,'Niger','A'),(168,'Nigeria','A'),(169,'Niue','A'),(170,'Norfolk Island','A'),(171,'No Man`s Island','A'),(172,'Northern Mariana Islands','A'),(173,'Norway','A'),(174,'Oman','A'),(175,'Pakistan','A'),(176,'Palau','A'),(177,'Panama','A'),(178,'Papua New Guinea','A'),(179,'Paraguay','A'),(180,'Peru','A'),(181,'Philippines','A'),(182,'Pitcaim Islands','A'),(183,'Poland','A'),(184,'Portugal','A'),(185,'Puerto Rico','A'),(186,'Qatar','A'),(187,'Reunion','A'),(188,'Romainia','A'),(189,'Russia','A'),(190,'Rwanda','A'),(191,'Saint Helena','A'),(192,'Saint Kitts and Nevis','A'),(193,'Saint Lucia','A'),(194,'Saint Pierre and Miquelon','A'),(195,'Saint Vincent and the Grenadines','A'),(196,'Samoa','A'),(197,'San Marino','A'),(198,'Sao Tome and Principe','A'),(199,'Saudi Arabia','A'),(200,'Scotland','A'),(201,'Senegal','A'),(202,'Serbia and Monterago','A'),(203,'Seychelles','A'),(204,'Sierra Leone','A'),(205,'Singapore','A'),(206,'Slovakia','A'),(207,'Slovenia','A'),(208,'Solomon Islands','A'),(209,'Somalia','A'),(210,'South Africa','A'),(211,'South Georgia and the South Sandwich Islandss','A'),(212,'Spain','A'),(213,'Spratly Islands','A'),(214,'SriLanka','A'),(215,'Sudan','A'),(216,'Suriname','A'),(217,'Svalbard','A'),(218,'Swaziland','A'),(219,'Sweden','A'),(220,'Switzerland','A'),(221,'Syria','A'),(222,'Taiwan','A'),(223,'Tajikistan','A'),(224,'Tanzania','A'),(225,'Thailand','A'),(226,'Trinidad and Tobago','A'),(227,'Toga','A'),(228,'Tokelau','A'),(229,'Tonga','A'),(230,'Tunisia','A'),(231,'Turkey','A'),(232,'Turkmenistan','A'),(233,'Turks and Caicos Island','A'),(234,'Tuvalu','A'),(235,'Uganda','A'),(236,'Ukraine','A'),(237,'United Arab Emirates','A'),(238,'United Kingdom','A'),(239,'Uruguay','A'),(240,'United States','A'),(241,'Uzbekistan','A'),(242,'Vanuatu','A'),(243,'Venezuela','A'),(244,'Vietnam','A'),(245,'Virgin Islands','A'),(246,'Wales','A'),(247,'Wallis and Futuna','A'),(248,'West Bank','A'),(249,'Western Sahara','A'),(250,'Yemen','A'),(251,'Yugoslavia','A'),(252,'Zambia','A'),(253,'Zimbabwe','A'),(254,'Others','A'),(255,'Doesnt Matter','A');");

    }

    public function down() {
        $this->dbforge->drop_table('balance');
        $this->dbforge->drop_table('addresses');
        $this->dbforge->drop_table('country');
    }

}

/* End of file 002_Balance.php */
/* Location: ./application/migrations/002_Balance.php */