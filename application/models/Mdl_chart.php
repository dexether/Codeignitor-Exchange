<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Mdl_chart extends CI_Model {

    public function __construct()
    {
        parent::__construct();
    }

    public function chart($bid='nlg', $time = '30minutes')
    {
        switch ($time) {
            case '5minutes':
                $time = '300';
                break;
            
            case '30minutes':
                $time = '1800';
                break;;

            default:
                $time = '1800';
                break;
        }
        $sql = "SELECT MAX(`price`) as `highest`, "
                . "MIN(`price`) as `low`, "
                . "SUBSTRING_INDEX( GROUP_CONCAT(CAST(`price` AS CHAR) ORDER BY `trade_datetime`), ',', 1 ) AS `open`, "
                . "SUBSTRING_INDEX( GROUP_CONCAT(CAST(`price` AS CHAR) ORDER BY `trade_datetime` DESC), ',', 1 ) AS `close`, "
                . "FROM_UNIXTIME( CEILING(UNIX_TIMESTAMP(`trade_datetime`)/$time)*$time ) AS `timeslice` "
                . "FROM trades_$bid "
                . "GROUP BY `timeslice`";
        
        return $this->db->query($sql);
        
    }

}