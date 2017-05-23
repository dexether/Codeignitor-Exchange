<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Mdl_fees extends CI_Model {


    /**
     * Get last N days records from open_fees table grouped by days
     *
     * @param int $days_cnt last N days to get data for
     * @return array
     */
    public function get_recent_fees_data($days_cnt = 1)
    {
        $cur_date = new DateTime();
        $start_date = clone $cur_date;
        if ($days_cnt > 0) {
            $start_date->modify('-' . $days_cnt . ' day');
        }

        // var_dump($start_date->format('Y-m-d'));
        // die;

        $query = $this->db->select('COUNT(*) as cnt, SUM(fee) as fee, DATE(trade_datetime) as trade_date')
             ->from('open_fees')
             ->where('DATE(trade_datetime) >= ', $start_date->format('Y-m-d'))
             ->group_by('DATE(trade_datetime)')
             ->order_by('trade_date', 'ASC')
             ->get();

        $result = [];
        while ($start_date <= $cur_date) {
            $result[$start_date->format('Y-m-d')] = [];
            $start_date->modify('+1 day');
        }

        foreach($query->result() as $row) {
            $date = $row->trade_date;
            if (isset($result[$date])) {
                $result[$date] = [
                    'fee' => $row->fee,
                    'cnt' => $row->cnt
                ];
            }
        }
        return $result;
    }


    /**
     * Calculation of `fee` sum for all open-statused open_fees
     * table records
     *
     * @return float
     */
    public function calc_open_fee()
    {
        $query = $this->db->select_sum('fee', 'total_fee')
                 ->from('open_fees')
                 ->where('status', 'open')
                 ->get();
        $total_fee = $query->row()->total_fee;
        return floatval($total_fee);
    }

}
