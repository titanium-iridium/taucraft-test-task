/*global jQuery, $ */

// jQuery plugin for drag'n'drop operations
// Not really customizable but it works :)

$.fn.extend({

	draggable: function(options) { // makes item ready to be dragged
		options = $.extend({
			handle: null,
			done: null
		}, options);
//		console.log(options);

		this.on('mousedown', options.handle, function(e) {
			if (e.which != 1) return;
//			console.log(arguments);
			var $dragged = $(e.delegateTarget);
			// saving data needed for dragging
			$dragged.data({
				dropTarget: null,
				dragInit: true,
				startPos: {x: e.pageX, y: e.pageY},
				originalPos: {
					top: $dragged.css('top'),
					left: $dragged.css('left'),
					position: $dragged.css('position')
				}
			});

			$(document).on('mousemove.drag-n-drop', {dragged: $dragged}, function(e) {
				// handle mouse movement (with item been dragged)
				var
					mouseOffset,
					$dragged = e.data.dragged,
					dragInit = $dragged.data('dragInit'),
					startPos = $dragged.data('startPos'),
					dropTarget = $dragged.data('dropTarget')
				;

				if (dragInit) { // if drag process should be initialized
					if (Math.abs(startPos.x - e.pageX) < 5 && Math.abs(startPos.y - e.pageY) < 5) {
						e.preventDefault();
						return;
					}

					// calculate mouse offset inside dragged item
					var offset = $dragged.offset();
					mouseOffset = {x: (startPos.x - offset.left), y: (startPos.y - offset.top + 8)};
					$dragged.data('mouseOffset', mouseOffset); // save mouse offset
					$dragged.css('position', 'absolute').css('z-index', 999);

					$dragged.data('dragInit', false); // init done
				} else {
					mouseOffset = $dragged.data('mouseOffset');
				}

				var newTarget = null,
					x = e.pageX,
					y = e.pageY
				;

				// display dragged item in current mouse position
				$dragged.css('top', y - mouseOffset.y + 'px');
				$dragged.css('left', x - mouseOffset.x + 'px');

				$dragged.css('display', 'none'); // hide dragged item to avoid it been determined as drop target
				var target = document.elementFromPoint(x, y);
				$dragged.css('display', ''); // do not use .show() here (we don't need of "display:block")

				// find most nested drop target
				while (target) {
					if ($(target).is('.drag-drop-target')) {
						newTarget = target; // got one
						break;
					}
					target = target.parentNode; // go up thru DOM
				}

				if (dropTarget !== newTarget) { // drop target changed since last check
					if (dropTarget) {
						$(dropTarget).removeClass('drag-drop-target-active');
					}
					if (newTarget) {
						$(newTarget).addClass('drag-drop-target-active');
					}
					$dragged.data('dropTarget', newTarget); // save new drop target
				}

				e.preventDefault();

			}).on('mouseup.drag-n-drop', {dragged: $dragged}, function(e) {
				// mouse button was released (dragged item is dropped)
				var
					$dragged = e.data.dragged,
					dropTarget = $dragged.data('dropTarget'),
					originalPos = $dragged.data('originalPos')
				;

				// revert original styling
				$dragged.css({
					'z-index': '',
					position: '',
					top: '',
					left: ''
				});

				if (dropTarget) {
					// place dragged item to inside the drop target
					$dragged.appendTo($(dropTarget));

					$(dropTarget).removeClass('drag-drop-target-active');
				/*} else {
					return dragged item to it's origin
						$dragged.css({
							position: originalPos.position,
							top: originalPos.top,
							left: originalPos.left
						});*/
				}

				$(document).off('.drag-n-drop');

				if (typeof options.done === 'function') {
					options.done.apply(dropTarget);
				}
//				e.preventDefault();
			});

			e.preventDefault();
//			e.stopPropagation();
		});
	},

	dropTarget: function() { // makes item to serve as drop target for dragged items
		this.addClass('drag-drop-target');
	}
});
