<table >
 <tbody>
   <tr>
      <td>
      <h2>Dear <?php echo (isset($username))?$username:'' ?>,</h2>

     <p>Your login details are as follows, please keep a note of your username and password:</p>

      <p><strong>Username</strong>: <?php echo (isset($username))?$username:'' ?><br />
     <strong>Password</strong>: <?php echo (isset($password))?$password:'' ?></p>
     </td>
   </tr>
 </tbody>
</table>