(function($) {
	$(document).ready(function() {
		
		// Watch for clicks on view layout buttons
		$('#views li').click(function() {
			
			// Removes selected class from siblings
			$(this).siblings().each(function(){
				$(this).removeClass('selected');
			});
			
			// Adds selected class to button clicked
			$(this).addClass('selected');
			
			// Code for actual view change goes here..
			
			
		});
		
		// Watch mousedown & mouseup for control buttons 
		$('#controls li').mousedown(function() {
			$(this).addClass('down');
		}).mouseup(function() {
			$(this).removeClass('down');
			
			// Determine which button was clicked $(this).attr('class')
			//	will return prev, play or next. Do something with that here.
			
			
		});

		// Watch navigation clicks (Music, Movies, etc..)
		$('#body > nav > ul > li > ul > li').click(function() {
			// changePage() changes the style of the element clicked 
			// it is also called by pageTransition() so that the appropriate page
			// is selected when the specific page is called directly via url
			changePage(this);
			
			
			// Determine which age to load 
			var selected = $(this).children('a').attr('id');
			if (selected!='') { window.location = '#/'+selected; }
			return false;
			
		});
		
		// Setup volume slider
		$('.slider').slider({value: 75, range: 'min'});
		
		// Stop annoying text selection.. (needs fixing)
		// unfortunately, this causes the search field to not be focusable in chrome :(
		$('#frame').disableTextSelect();
		$('#search').enableTextSelect();


		// As mentioned above, this changes the style of a selected navigation element
		function changePage(page) {
			// Remove selected class from siblings
			$(page).siblings().each(function() {
				$(this).removeClass('selected');
			});
			// Remove selected class from cousins :P
			$(page).parents('ul').parents('li').siblings().each(function() {
				$(this).children('ul').each(function() {
					$(this).children().removeClass('selected');
				});
			});
			
			// Selected element has selected class.
			$(page).addClass('selected');
		}

		// Load data into page and bring opacity back to 100%
		// Should move ajax request in here :\
		function pageTransition(data, page) {
			$('#content').html(data);	
			$('#content').animate({opacity: 1.0}, 100);
			changePage($('#'+page).parents('li'));
		}	
	
		// The music page requires javascript to bind & properly
		// color the rows of the album list view. So this is called
		// each time #/music is loaded. This probably isn't the best method. 
		function initMusic() {
			var i = 0;
			// CSS' nth-child(odd) wouldn't work because the ul's are in different parents (they're cousins, not siblings)
			// jQuery allows me to go through all of them together and determine odds myself.
			$('#body > #content > .data > li > ul').each(function(){ i++; if (Math.floor(i/2)<(i/2)) { $(this).addClass('odd'); } })
			
			
			// Detecting row clicks 
			$('#body > #content > .data > li > ul').click(function() {
				// Remove selected class from siblings.
				$(this).siblings().each(function() {
					$(this).removeClass('selected');
				});
				// Again, with the cousins..
				$(this).parents('li').siblings().each(function() {
					$(this).children().each(function() {
						$(this).removeClass('selected');
					});
				});
				
				// Apply selected class to selected row.
				$(this).addClass('selected');
			});		
		}
		
		// <3 Sammy.js
		var app = $.sammy(function() {
			
			
			// This looks like too much code ;(
			this.get('#/music', function() {
				$('#content').animate({opacity: .01}, 100, function() {
					$.ajax({
						url: 'includes/music.html',
						success: function(data) {
							pageTransition(data, 'music');
							initMusic();
						}
					});
				});
			});
			
			this.get('#/movies', function() {
				$('#content').animate({opacity: .01}, 100, function() {
					$.ajax({
						url: 'includes/movies.html',
						success: function(data) {
							pageTransition(data, 'movies');
						}
					});
				});
			});	
					
			this.get('#/tvShows', function() {
				$('#content').animate({opacity: .01}, 100, function() {
					$.ajax({
						url: 'includes/tvshows.html',
						success: function(data) {
							pageTransition(data , 'tvShows');
						}
					});
				});
			});
			
			this.get('#/podcasts', function() {
				$('#content').animate({opacity: .01}, 100, function() {
					$.ajax({
						url: 'includes/podcasts.html',
						success: function(data) {
							pageTransition(data , 'podcasts');
						}
					});
				});
			});						
					
		});
		
		
		app.run('#/music');



	});
	
	
})(jQuery);


// disableTextSelect/enableTextSelect
(function($) {
    if ($.browser.mozilla) {
        $.fn.disableTextSelect = function() {
            return this.each(function() {
                $(this).css({
                    'MozUserSelect' : 'none'
                });
            });
        };
        $.fn.enableTextSelect = function() {
            return this.each(function() {
                $(this).css({
                    'MozUserSelect' : ''
                });
            });
        };
    } else if ($.browser.msie) {
        $.fn.disableTextSelect = function() {
            return this.each(function() {
                $(this).bind('selectstart.disableTextSelect', function() {
                    return false;
                });
            });
        };
        $.fn.enableTextSelect = function() {
            return this.each(function() {
                $(this).unbind('selectstart.disableTextSelect');
            });
        };
    } else {
        $.fn.disableTextSelect = function() {
            return this.each(function() {
                $(this).bind('mousedown.disableTextSelect', function() {
                    return false;
                });
            });
        };
        $.fn.enableTextSelect = function() {
            return this.each(function() {
                $(this).unbind('mousedown.disableTextSelect');
            });
        };
    }
})(jQuery);