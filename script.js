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
		var tasks = JSON.parse(data);
//		console.log(tasks);
	});
}