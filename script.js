/*global jQuery, $ */

//localStorage.removeItem('data');
//localStorage.clear();

// saves items data to local storage
function saveData() {
	if (!localStorageSupported()) return;
	console.log('saveData');
	var data = [];
	// convert visual items state into object
	$('tr.head th').each(function() { // iterate thru statuses (table columns)
		var
			$col = $(this),
			status = {name: $col.text(), items: []}
		;

		$('tr.items td').eq($col.index()).find('.item').each(function() { // iterate thru all items of status
			var
				$item = $(this),
				item = {
					id: $('.id', $item).text(),
					name: $('.name', $item).text(),
					type: ($item.is('.bug') ? 'bug' : 'task')
				};
			status.items.push(item);
		});
		data.push(status);
	});

	localStorage.data = JSON.stringify(data);
	$('.clear-data').fadeIn(666);
}

function clearData() {
	if (!localStorageSupported() || !window.confirm('Clear all data in local storage. Are you sure?')) return;
	localStorage.clear();
	$('.clear-data').fadeOut(333);
}


function localStorageSupported() {
	try {
		return 'localStorage' in window && window['localStorage'] !== null;
	} catch (e) {
		return false;
	}
}

//var dragDoneCallback = function() {
//
//};

// populate task table and prepare it for interaction
var populate = function(data) {
//		console.log(all);
	if (!data || !data.length) return;

	var i, status, k, item,
		cellClass = ' class="first"',
		$table = $('<table></table>'),
		$headRow = $('<tr class="head"></tr>'),
		$addRow = $('<tr class="new"></tr>'),
		$itemsRow = $('<tr class="items"></tr>'),
		$td;

	for (i = 0; i < data.length; i++) { // per-status cycle
		status = data[i];
		$('<th' + cellClass + '>' + status.name + '</th>').appendTo($headRow);
		$('<td' + cellClass + '><button class="new task" title="New task">+</button>'
			+ '<button class="new bug" title="New bug">+</button></div></td>').appendTo($addRow);

		$td = $('<td' + cellClass + '><div class="dummy">&nbsp;</div></td>');

		for (k = 0; k < status.items.length; k++) { // per-task cycle
			item = status.items[k];
//			console.log(item);
			$td.append('<div class="item '+ item.type + '">'
				+ '<button class="delete" title="Delete">&times;</button><div class="handle"></div><div class="content">'
				+ '<div class="param id">' + item.id + '</div>'
				+ '<div class="param name">' + item.name + '</div>'
				+ '</div>'
			);

		}
		$td.appendTo($itemsRow);

		cellClass = '';
	}

	$headRow.appendTo($table);
	$addRow.appendTo($table);
	$itemsRow.appendTo($table);
	$table.appendTo('body');

	$('.item').draggable({
		handle: '.handle',
		done: saveData
//		onDragSuccess: function() {
//			$(this).find('.dummy').remove();
//			$('td.items').each(function() {
//				var $td = $(this);
//				if (!$('.item', $td).length) $td.html('<div class="dummy">&nbsp;</div>');
//			});
//		}
	});

	$('tr.items td').dropTarget();


	$table.on('click', '.param', function(e) {
		// activate parameter edit mode
		$('#editable').attr('contenteditable', '').attr('id', '');
		$(this).attr('contenteditable', 'true').attr('id', 'editable');
	}).on('click', 'button.new', function(e) {
		// add new taks/bug
		var
			$btn = $(this),
			itemClass = $btn.is('.bug') ? 'bug' : 'task'
		;

		$('<div class="item '+ itemClass + '">'
			+ '<button class="delete" title="Delete">&times;</button><div class="handle"></div><div class="content">'
			+ '<div class="param id">[id]</div>'
			+ '<div class="param name">[name]</div>'
			+ '</div>')
			.appendTo($('tr.items td').eq($btn.closest('td').index()))
			.draggable({handle: '.handle', done: saveData});
	}).on('click', 'button.delete', function() {
		// delete task/bug
		if (window.confirm('Delete item. Are you sure?')) {
			$(this).closest('.item').remove();
			saveData();
		}
	});


	$('body').on('focus', '#editable', function() {
		var $this = $(this);
		$this.data('prev', $this.html()); // save parameter data for further modification checks
		return $this;
//	}).on('blur keyup paste input', '#editable', function() {
	}).on('blur', '#editable', function() {
		var $this = $(this);
		if ($this.data('prev') !== $this.html()) {
			// parameter value changed, save items state
			$this.data('prev', $this.html());
			saveData();
		}
		return $this;
	});

};


$(document).ready(function() { // execute when DOM ready
	if (localStorageSupported() && 'data' in localStorage) {
		$('.clear-data').show();
		populate(JSON.parse(localStorage.data));
	} else {
		$.getJSON('./data.json', populate);
	}
});

