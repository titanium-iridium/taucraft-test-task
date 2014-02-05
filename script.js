/*global jQuery, $ */


// populate task table and prepare it for interaction
var populate = function(data) {
//		console.log(all);
	if (!data || !data.length) return;

	var i, status, k, item,
		cellClass = ' class="first"',
		$table = $('<table></table>'),
		$headRow = $('<tr></tr>'),
		$dataRow = $('<tr></tr>'),
		$td;

	for (i = 0; i < data.length; i++) { // per-status cycle
		status = data[i];
		$('<th' + cellClass + '>' + status.name + '</th>').appendTo($headRow);
		$td = $('<td' + cellClass + '><div class="dummy">&nbsp;</div></td>').addClass('items');

		for (k = 0; k < status.items.length; k++) { // per-task cycle
			item = status.items[k];
//			console.log(item);
			$td.append('<div class="item '+ item.type + '"><div class="handle"></div><div class="content">'
				+ '<div class="param id">' + item.id + '</div>'
				+ '<div class="param name">' + item.name + '</div>'
				+ '</div>'
			);

//				$column.attr('class', item.type);
			$td.appendTo($dataRow);
		}

		cellClass = '';
	}

	$headRow.appendTo($table);
	$dataRow.appendTo($table);
	$table.appendTo('body');

	$('.item').draggable({
		handle: '.handle'
//		onDragSuccess: function() {
//			$(this).find('.dummy').remove();
//			$('td.items').each(function() {
//				var $td = $(this);
//				if (!$('.item', $td).length) $td.html('<div class="dummy">&nbsp;</div>');
//			});
//		}
	});

	$('td.items').dropTarget();


	$table.on('click', function(e) {
		var $target = $(e.target);
		if ($target.is('.param')) {
			$('#editable').attr('contenteditable', '').attr('id', '');
			$target.attr('contenteditable', 'true').attr('id', 'editable');
		}
	});

};

$.getJSON('./data.json', populate);


