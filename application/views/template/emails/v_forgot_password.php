<h3>Forgot password request</h3>
<table width="100%">
  <tbody>
   <tr>
    <td>
      <h3>Hello <?php echo (isset($username))? $username : '' ?>,</h3>
      <p>You have requested a password reset at <b><?php echo APP_TITLE ?></b> 
         for username: <?php echo (isset($username))? $username : '' ?>
       <br/>
       <br/>
         Please make a note of your login details showing in below 
      </p>

     <p>New Password : <?php echo (isset($password))? $password : '' ?></p>
   </td>
 </tr>
</tbody>
</table>