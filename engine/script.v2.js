(function(){

	$('form textarea').each(function(i,el) {
		var mode = 'javascript';
		if($(el).attr('data-type')=='html') {
			mode = 'htmlmixed';
		}
		
		el.form.editor = CodeMirror.fromTextArea(el, { lineNumbers: false, mode: mode, matchBrackets: true });
		//wrap form, insert Run and Reset buttons?
	});

	$("form button[type=button]").each(function(i,el) {
		if($(this).text()=='Reset') {
			$(this).click(function(){
				this.form.reset(); this.form.editor.setValue($('textarea', this.form).val());
			});
		}
	});

	//linkify
	$('pre').each(function(i,el) {
		var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
		$(this).html($(this).html().replace(exp,"<a href='$1' target='_blank'>$1</a>"));
	});

	
	
	//inspired by Learning Advanced JavaScript (http://ejohn.org/apps/learn/) by John Resig
	var stasis = {};
	for ( var item in window ) {
		stasis[item] = true;
	}
	
	jQuery('form').submit(function(e){
		console.clear();

		for ( var item in window ) {
			if ( !stasis[item] ) {
				window[item] = undefined;
				delete window[item];
			}
		}
		
		/*
		//I don't think it's possible to run this in global scope!! For example var a = 5; will always be local one!! (window.a = undefined)
		try {
			//(new Function( jQuery('textarea', this).val() )).call(window);
			//eval(jQuery('textarea', this).val());
			
		} catch(e){
			console.error(e.message);
		}
		*/
		
		//new version
		var oldScript = document.getElementById('scriptContainer');
		var newScript;

		if (oldScript) {
		  oldScript.parentNode.removeChild(oldScript);
		}
		
		window._runtime_error = true;
		
		newScript = document.createElement('script');
		newScript.id = 'scriptContainer';
		
		newScript.text = jQuery('textarea', this).val();
		newScript.text += '_runtime_error=false;';
		
		document.body.appendChild(newScript);
		
		if(window._runtime_error) {
			newScript.parentNode.removeChild(newScript);
		}
		
		/* references in clicks aren't working if I clean right away
		for ( var item in window ) {
			if ( !stasis[item] ) {
				window[item] = undefined;
				delete window[item];
			}
		}
		*/
		
		return false;
	});  
	//


	var slide = 1;
	var length = $('h1,h2,h3').size();
	
	var goto = function(index) {
		
		if(index<1 || index>length) { return; }
		
		var count = 0;
		var end = false;
		
		var children = $('body').children();
		var el, tag, i;
		for(i=0; i<=children.length; i++) {
			
			el = children[i];
			tag = el.nodeName.toLowerCase();
			
			if($(el).hasClass('foot')) break;
			if(['script','style'].indexOf(tag)!=-1) {
				continue;
			}

			if(['h1','h2','h3'].indexOf(tag)!=-1) {
				count++;
			}
			
			//show everything until next H
			if(count == index) {
				$(el).addClass('current-slide');
				
				//refresh editor
				if(tag=='form') {
					//console.log('refresh');
					el.editor.refresh();
				}
				
			} else {
				$(el).removeClass('current-slide');
			}
		}
		
		slide = index;
	};
	
	if($('body').hasClass('slideshow')) {
	    goto(1);
	}
	
	$(document).keydown(function(e) {
	
		if ($(e.target).is('input,textarea')) { return true; }
	
		if(e.which == 78 && e.shiftKey) {
			//shift+n pressed
			$('body').removeClass('slideshow');
			
			//all editors visible, refresh them
			$('form textarea').each(function(i,el) {
				el.form.editor.refresh();
			});			
			//goto(1);
		} else if(e.which == 83 && e.shiftKey) {
			//shift+s pressed
			$('body').addClass('slideshow');
			goto(slide);
		} else if(e.which == 37) {
			//previous arrow
			if(!$('body').hasClass('slideshow')) return;
			goto(slide-1);
		} else if(e.which == 39) {
			//next arrow
			if(!$('body').hasClass('slideshow')) return;
			goto(slide+1);
		}
	});
	
	

}());
