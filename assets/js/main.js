(function($) {

	skel.breakpoints({
		xlarge: '(max-width: 1680px)',
		large: '(max-width: 1280px)',
		medium: '(max-width: 980px)',
		small: '(max-width: 736px)',
		xsmall: '(max-width: 480px)',
		xxsmall: '(max-width: 360px)'
	});

	/**
	 * Applies parallax scrolling to an element's background image.
	 * @return {jQuery} jQuery object.
	 */
	$.fn._parallax = (skel.vars.browser == 'ie' || skel.vars.browser == 'edge' || skel.vars.mobile) ? function() { return $(this) } : function(intensity) {

		var	$window = $(window),
			$this = $(this);

		if (this.length == 0 || intensity === 0)
			return $this;

		if (this.length > 1) {

			for (var i=0; i < this.length; i++)
				$(this[i])._parallax(intensity);

			return $this;

		}

		if (!intensity)
			intensity = 0.25;

		$this.each(function() {

			var $t = $(this),
				on, off;

			on = function() {

				$t.css('background-position', 'center 100%, center 100%, center 0px');

				$window
					.on('scroll._parallax', function() {

						var pos = parseInt($window.scrollTop()) - parseInt($t.position().top);

						$t.css('background-position', 'center ' + (pos * (-1 * intensity)) + 'px');

					});

			};

			off = function() {

				$t
					.css('background-position', '');

				$window
					.off('scroll._parallax');

			};

			skel.on('change', function() {

				if (skel.breakpoint('medium').active)
					(off)();
				else
					(on)();

			});

		});

		$window
			.off('load._parallax resize._parallax')
			.on('load._parallax resize._parallax', function() {
				$window.trigger('scroll');
			});

		return $(this);

	};

	$(function() {

		var	$window = $(window),
			$body = $('body'),
			$wrapper = $('#wrapper'),
			$header = $('#header'),
			$banner = $('#banner');

		// Disable animations/transitions until the page has loaded.
			$body.addClass('is-loading');

			$window.on('load pageshow', function() {
				window.setTimeout(function() {
					$body.removeClass('is-loading');
				}, 100);
			});

		// Clear transitioning state on unload/hide.
			$window.on('unload pagehide', function() {
				window.setTimeout(function() {
					$('.is-transitioning').removeClass('is-transitioning');
				}, 250);
			});

		// Fix: Enable IE-only tweaks.
			if (skel.vars.browser == 'ie' || skel.vars.browser == 'edge')
				$body.addClass('is-ie');

		// Fix: Placeholder polyfill.
			$('form').placeholder();

		// Prioritize "important" elements on medium.
			skel.on('+medium -medium', function() {
				$.prioritize(
					'.important\\28 medium\\29',
					skel.breakpoint('medium').active
				);
			});

		// Scrolly.
			$('.scrolly').scrolly({
				offset: function() {
					return $header.height() - 2;
				}
			});

		// Tiles.
			var $tiles = $('.tiles > article');

			$tiles.each(function() {

				var $this = $(this),
					$image = $this.find('.image'), $img = $image.find('img'),
					$link = $this.find('.link'),
					x;

				// Image.

					// Set image.
						$this.css('background-image', 'url(' + $img.attr('src') + ')');

					// Set position.
						if (x = $img.data('position'))
							$image.css('background-position', x);

					// Hide original.
						$image.hide();

				// Link.
					if ($link.length > 0) {

						$x = $link.clone()
							.text('')
							.addClass('primary')
							.appendTo($this);

						$link = $link.add($x);

						$link.on('click', function(event) {

							var href = $link.attr('href');

							// Prevent default.
								event.stopPropagation();
								event.preventDefault();

							// Start transitioning.
								$this.addClass('is-transitioning');
								$wrapper.addClass('is-transitioning');

							// Redirect.
								window.setTimeout(function() {

									if ($link.attr('target') == '_blank')
										window.open(href);
									else
										location.href = href;

								}, 500);

						});

					}

			});

		// Header.
			if (skel.vars.IEVersion < 9)
				$header.removeClass('alt');

			if ($banner.length > 0
			&&	$header.hasClass('alt')) {

				$window.on('resize', function() {
					$window.trigger('scroll');
				});

				$window.on('load', function() {

					$banner.scrollex({
						bottom:		$header.height() + 10,
						terminate:	function() { $header.removeClass('alt'); },
						enter:		function() { $header.addClass('alt'); },
						leave:		function() { $header.removeClass('alt'); $header.addClass('reveal'); }
					});

					window.setTimeout(function() {
						$window.triggerHandler('scroll');
					}, 100);

				});

			}

		// Banner.
			$banner.each(function() {

				var $this = $(this),
					$image = $this.find('.image'), $img = $image.find('img');

				// Parallax.
					$this._parallax(0.275);

				// Image.
					if ($image.length > 0) {

						// Set image.
							$this.css('background-image', 'url(' + $img.attr('src') + ')');

						// Hide original.
							$image.hide();

					}

			});

		// Menu.
			var $menu = $('#menu'),
				$menuInner;

			$menu.wrapInner('<div class="inner"></div>');
			$menuInner = $menu.children('.inner');
			$menu._locked = false;

			$menu._lock = function() {

				if ($menu._locked)
					return false;

				$menu._locked = true;

				window.setTimeout(function() {
					$menu._locked = false;
				}, 350);

				return true;

			};

			$menu._show = function() {

				if ($menu._lock())
					$body.addClass('is-menu-visible');

			};

			$menu._hide = function() {

				if ($menu._lock())
					$body.removeClass('is-menu-visible');

			};

			$menu._toggle = function() {

				if ($menu._lock())
					$body.toggleClass('is-menu-visible');

			};

			$menuInner
				.on('click', function(event) {
					event.stopPropagation();
				})
				.on('click', 'a', function(event) {

					var href = $(this).attr('href');

					event.preventDefault();
					event.stopPropagation();

					// Hide.
						$menu._hide();

					// Redirect.
						window.setTimeout(function() {
							window.location.href = href;
						}, 250);

				});

			$menu
				.appendTo($body)
				.on('click', function(event) {

					event.stopPropagation();
					event.preventDefault();

					$body.removeClass('is-menu-visible');

				})
				.append('<a class="close" href="#menu">Close</a>');

			$body
				.on('click', 'a[href="#menu"]', function(event) {

					event.stopPropagation();
					event.preventDefault();

					// Toggle.
						$menu._toggle();

				})
				.on('click', function(event) {

					// Hide.
						$menu._hide();

				})
				.on('keydown', function(event) {

					// Hide on escape.
						if (event.keyCode == 27)
							$menu._hide();

				});
				// Gallery.
					$('.gallery')
						.wrapInner('<div class="inner"></div>')
						.prepend(skel.vars.mobile ? '' : '<div class="forward"></div><div class="backward"></div>')
						.scrollex({
							top:		'30vh',
							bottom:		'30vh',
							delay:		50,
							initialize:	function() {
								$(this).addClass('is-inactive');
							},
							terminate:	function() {
								$(this).removeClass('is-inactive');
							},
							enter:		function() {
								$(this).removeClass('is-inactive');
							},
							leave:		function() {

								var $this = $(this);

								if ($this.hasClass('onscroll-bidirectional'))
									$this.addClass('is-inactive');

							}
						})
						.children('.inner')
							//.css('overflow', 'hidden')
							.css('overflow-y', skel.vars.mobile ? 'visible' : 'hidden')
							.css('overflow-x', skel.vars.mobile ? 'scroll' : 'hidden')
							.scrollLeft(0);

					// Style #1.
						// ...

					// Style #2.
						$('.gallery')
							.on('wheel', '.inner', function(event) {

								var	$this = $(this),
									delta = (event.originalEvent.deltaX * 10);

								// Cap delta.
									if (delta > 0)
										delta = Math.min(25, delta);
									else if (delta < 0)
										delta = Math.max(-25, delta);

								// Scroll.
									$this.scrollLeft( $this.scrollLeft() + delta );

							})
							.on('mouseenter', '.forward, .backward', function(event) {

								var $this = $(this),
									$inner = $this.siblings('.inner'),
									direction = ($this.hasClass('forward') ? 1 : -1);

								// Clear move interval.
									clearInterval(this._gallery_moveIntervalId);

								// Start interval.
									this._gallery_moveIntervalId = setInterval(function() {
										$inner.scrollLeft( $inner.scrollLeft() + (5 * direction) );
									}, 10);

							})
							.on('mouseleave', '.forward, .backward', function(event) {

								// Clear move interval.
									clearInterval(this._gallery_moveIntervalId);

							});

					// Lightbox.
						$('.gallery.lightbox')
							.on('click', 'a', function(event) {

								var $a = $(this),
									$gallery = $a.parents('.gallery'),
									$modal = $gallery.children('.modal'),
									$modalImg = $modal.find('img'),
									href = $a.attr('href');

								// Not an image? Bail.
									if (!href.match(/\.(jpg|gif|png|mp4)$/))
										return;

								// Prevent default.
									event.preventDefault();
									event.stopPropagation();

								// Locked? Bail.
									if ($modal[0]._locked)
										return;

								// Lock.
									$modal[0]._locked = true;

								// Set src.
									$modalImg.attr('src', href);

								// Set visible.
									$modal.addClass('visible');

								// Focus.
									$modal.focus();

								// Delay.
									setTimeout(function() {

										// Unlock.
											$modal[0]._locked = false;

									}, 600);

							})
							.on('click', '.modal', function(event) {

								var $modal = $(this),
									$modalImg = $modal.find('img');

								// Locked? Bail.
									if ($modal[0]._locked)
										return;

								// Already hidden? Bail.
									if (!$modal.hasClass('visible'))
										return;

								// Lock.
									$modal[0]._locked = true;

								// Clear visible, loaded.
									$modal
										.removeClass('loaded')

								// Delay.
									setTimeout(function() {

										$modal
											.removeClass('visible')

										setTimeout(function() {

											// Clear src.
												$modalImg.attr('src', '');

											// Unlock.
												$modal[0]._locked = false;

											// Focus.
												$body.focus();

										}, 475);

									}, 125);

							})
							.on('keypress', '.modal', function(event) {

								var $modal = $(this);

								// Escape? Hide modal.
									if (event.keyCode == 27)
										$modal.trigger('click');

							})
							.prepend('<div class="modal" tabIndex="-1"><div class="inner"><img src="" /></div></div>')
								.find('img')
									.on('load', function(event) {

										var $modalImg = $(this),
											$modal = $modalImg.parents('.modal');

										setTimeout(function() {

											// No longer visible? Bail.
												if (!$modal.hasClass('visible'))
													return;

											// Set loaded.
												$modal.addClass('loaded');

										}, 275);

									});


	});

})(jQuery);
