<?php if(!empty($list)){ ?>
<div class="bDiv" >
	<table class="table table-bordered table-hover" id="flex1">
		<thead>
			<tr class='hDiv'>

				<?php foreach($columns as $column){?>
				<th class="field-sorting <?php if(isset($order_by[0]) &&  $column->field_name == $order_by[0]){?><?php echo " ".$order_by[1]?><?php }?>" rel='<?php echo $column->field_name?>'>
					<?php echo $column->display_as?> <span class="sort pull-right"><i class="fa fa-sort"></i></span>
				</th>
				<?php }?>
				<?php if(!$unset_delete || !$unset_edit || !$unset_read || !empty($actions)){?>
				<th abbr="tools" axis="col1"><?php echo $this->l('list_actions'); ?></th>
				<?php }?>
			</tr>
		</thead>
		<tbody>
			<?php foreach($list as $num_row => $row){ ?>
			<tr>
				<?php foreach($columns as $column){?>
				<td><?php echo $row->{$column->field_name} != '' ? $row->{$column->field_name} : '&nbsp;' ; ?></td>
				<?php }?>
				<?php if(!$unset_delete || !$unset_edit || !$unset_read || !empty($actions)){?>
				<td class="td-action" >
					<?php if(!empty($row->action_urls)){ foreach($row->action_urls as $action_unique_id => $action_url){ $action = $actions[$action_unique_id]; ?>
					<a href="<?php echo $action_url; ?>" class="<?php echo $action->css_class; ?> crud-action" title="<?php echo $action->label?>"><i class="<?php echo $action->image_url ?>"></i>&nbsp;<?php echo $action->label; ?></a>
					<?php }	} ?>

					<?php if(!$unset_read){?>
					<a href='<?php echo $row->read_url?>' title='<?php echo $this->l('list_view')?> <?php echo $subject?>' class="edit_button btn btn-default"><i class='fa fa-list'></i>&nbsp;Detail</a>
					<?php }?>

					<?php if(!$unset_edit){?>
					<a href='<?php echo $row->edit_url?>' title='<?php echo $this->l('list_edit')?> <?php echo $subject?>' class="edit_button btn btn-primary"><i class='fa fa-pencil'></i>&nbsp;Edit</a>
					<?php }?>
					<?php if (!$unset_delete):?>
						<a href='<?php echo $row->delete_url?>' title='<?php echo $this->l('list_delete')?> <?php echo $subject?>' class="delete-row btn btn-danger"><i class='fa fa-trash'></i>&nbsp;Delete</a>					
					<?php endif ?>
				</td>
				<?php }?>
			</tr>
			<?php } ?>
		</tbody>
	</table>
</div>
<?php }else{?>
<br/>
<?php echo $this->l('list_no_items'); ?>
<br/>
<br/>
<?php }?>
