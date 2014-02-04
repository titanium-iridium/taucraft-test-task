/*global jQuery, $ */

var drag = null; // will point to currently dragged item


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
		$td = $('<td' + cellClass + '></td>');

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

//	$table.on('mousedown', function(e) {
//		var $target = $(e.target);
//		if (!$target.is('.handle')) return;
//		// start drag operation
//		drag = $target.closest('.item');
//		console.log(drag);
//		e.preventDefault();
//	}).on('mouseup', function(e) {
//		if (!$(e.target).is('.handle')) return;
//		// finish drag operation
//		drag = null;
//	});



//	$('.item').draggable({handle:'.handle'});


	$('.item').each(function() {
		new Draggable(this, $('.handle', $(this)).get(0));
	});

	$('td').each(function() {
		new DropTarget(this);
	});

	$table.on('click', function(e) {
		var $target = $(e.target);
		if ($target.is('.param')) {
			$('.editable').attr('contenteditable', 'false').removeClass('editable');
			$target.attr('contenteditable', 'true').addClass('editable');
		}
	});


};

$.getJSON('./data.json', populate);


