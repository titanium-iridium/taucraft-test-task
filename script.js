/*global jQuery, $ */

if (!window.File || !window.FileReader) {
	alert("Your browser have no support of file reading API.");
} else {
	var reader = new FileReader();
	reader.onload = function(event) {
		var contents = event.target.result;
		console.log("Содержимое файла: " + contents);
	};

	reader.onerror = function(event) {
		console.error("Файл не может быть прочитан! код " + event.target.error.code);
	};

//	var file = new File("./data.json");
//	reader.readAsText(file);

	$.get('/data.json', function(data) {
		var all = JSON.parse(data);
//		console.log(all);
		if (!all || !all.length) return;
		var i, status, k, item,
			cellClass = ' class="first"',
			$table = $('<table></table>'),
			$headRow = $('<tr></tr>'),
			$dataRow = $('<tr></tr>'),
			$td;
		for (i = 0; i < all.length; i++) {
			status = all[i];
			$('<th' + cellClass + '>' + status.name + '</th>').appendTo($headRow);
			$td = $('<td' + cellClass + '></td>');
			for (k = 0; k < status.items.length; k++) {
				item = status.items[k];
				console.log(item);

				$td.append('<div class="item '+ item.type + '">'
					+ '<div class="id">' + item.id + '</div>'
					+ '<div class="name">' + item.name + '</div>'
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


	});
}