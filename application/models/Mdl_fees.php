<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Mdl_fees extends CI_Model {

    // payment is enabled when open fees amount >= this constant value
    const PAYMENT_MIN_LIMIT = 0.01;

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



    /**
     * Do payment top-level method
     * @return void
     */
    public function do_payment_main()
    {
        try {
            $this->db->trans_begin();

            $this->do_payment();

            if ($this->db->trans_status() === false) {
                $this->db->trans_rollback();
                return 'Error while payment processing';
            }

//            $this->db->trans_complete();
            $this->db->trans_rollback();

            return ''; // no errors result
        } catch (Exception $e) {
            $this->db->trans_rollback();
            return $e->getMessage();
        }
    }


    protected function close_open_fees()
    {
        $this->db->where('status', 'open');
        $this->db->update('open_fees', ['status' => 'closed']);
    }


    protected function add_dividend($total_fee)
    {
        $data = [
            'total_fee'         => $total_fee,
            'dividend_datetime' => date('Y-m-d H:i:s'),
            'status'            => 'paid'
        ];
        $this->db->insert('dividend', $data);
        return $this->db->insert_id();
    }


    protected function do_payment()
    {
        // check total open fees amount at the click moment
        $open_fees_total = $this->calc_open_fee();
        if ($open_fees_total < self::PAYMENT_MIN_LIMIT) {
            throw new Exception('Total open fees < ' . self::PAYMENT_MIN_LIMIT);
        }
        $this->close_open_fees();
        $dividend_id = $this->add_dividend($open_fees_total);

        $this->process_users_balances($open_fees_total, $dividend_id);

        return true;
    }


    protected function addDeposit($user_id, $dividend_id, $dividend, $shares_cnt)
    {
        $shares_cnt = number_format($shares_cnt, 8, '.', '');
        $data = [
            'user_id'       => $user_id,
            'EUR'           => $dividend,
            'GTS'           => 0,
            'NLG'           => 0,
            'transaction'   => '',
            'verified'      => '',
            'deposit_date'  => date('Y-m-d'),
            'description'   => 'dividend ' . $shares_cnt . ' GTS',
            'dividend_id'   => $dividend_id
        ];
        $this->db->insert('deposits', $data);
    }


    protected function create_empty_balance($user_id)
    {
        $data = [
            'user_id'     => $user_id,
            'NLG'         => 0,
            'EUR'         => 0,
            'GTS'         => 0,
            'pending_EUR' => 0,
            'pending_NLG' => 0,
            'pending_GTS' => 0
        ];
        $this->db->insert('balance', $data);
    }


    protected function add_remainig_fee_to_superadmin($fee)
    {
        $user = $this->db->get_where('users', ['role' => 'superadmin'])->row();
        if (!$user) {
            throw new Exception('Cannot find superadmin user to send remaining fee');
        }
        $balance = $this->db->get_where('balance', ['user_id' => $user->id ])->row();
        if (!$balance) {
            $this->create_empty_balance($user->id);
        }
        $this->updateUserBalance($user->id, $fee);
    }


    protected function updateUserBalance($user_id, $euro_adding_value)
    {
        $euro_adding_value = floatval($euro_adding_value);
        $this->db->set('EUR', 'EUR + ' . $euro_adding_value, false)
           ->where('user_id', $user_id)
           ->update('balance');
    }


    protected function process_users_balances($total_fee, $dividend_id)
    {
        $remaining_fee = $total_fee;
        $one_share_price = $total_fee / 100000;
        $query = $this->db->get_where('balance',['GTS >' => 0]);
        while ($balance = $query->unbuffered_row()) {
            $user_id = $balance->user_id;
            $gts_payment = $balance->GTS * $one_share_price;
            // round to down to 8 decimals behind the dots
            $gts_payment = floor($gts_payment * 100000000) / 100000000;
            $dividend = number_format($gts_payment, 8, '.', '');
            if ($dividend > $remaining_fee) {
                throw new Exception('Total fee is exhosted while dividend paying');
            }
            $this->addDeposit($user_id, $dividend_id, $dividend, $one_share_price);
            $this->updateUserBalance($user_id, $dividend);
            $remaining_fee -= $dividend;
        }
        if ($remaining_fee > 0) { // add remain
            $this->add_remainig_fee_to_superadmin($remaining_fee);
        }
    }

}
