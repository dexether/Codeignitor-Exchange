<table class="body-wrap">
  <tr>
    <td></td>
    <td class="container" bgcolor="#FFFFFF">
      <div class="content">
        <table>
          <tr>
            <td>
              <h3>Hi, <?php echo @$username ?></h3>
              <p>

                This mail is sent as a security precaution.<br/><br/>
                A successful login to you account was logged at <b><?php echo date('Y-m-d H:m') ?></b>
                From ip address <b><?php echo $this->input->server('REMOTE_ADDR'); ?></b>
                <br/><br/>
                Please make sure your account is safe!
              </p>
              </td>
            </tr>
            </table>
        </div>
      </td>
    </tr>
</table>