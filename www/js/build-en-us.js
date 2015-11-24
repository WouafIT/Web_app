/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/***/ function(module, exports, __webpack_require__) {

	(function($) {
		//Slidebars
		var slidebars = __webpack_require__(/*! ./class/singleton/slidebars.js */ 4);
		//Load CSS
		__webpack_require__(/*! ../less/index.less */ 15);
		//i18n
		var i18n = __webpack_require__(/*! ./class/singleton/i18n.js */ 11);
		//Map
		var map = __webpack_require__(/*! ./class/singleton/map.js */ 22);
		//User
		var user = __webpack_require__(/*! ./class/singleton/user.js */ 23);
		//user.set('uid', 'toto');
		//user.set('token', 'test');
		//Data
		var data = __webpack_require__(/*! ./class/singleton/data.js */ 14);
		//data.set('foo', 'bar');
	
		//Toast
		var toast = __webpack_require__(/*! ./class/singleton/toast.js */ 24);
	
		//Query
		var query = __webpack_require__(/*! ./class/query.js */ 25)();
	
		var $document = $(document);
		$document.ready(function() {
			//logout event : reset all user infos
			$document.on('app.logout', function() {
				user.set('uid', null);
				user.set('token', null);
				user.set('favorites', null);
				user.set('today_publications', 0);
				/*if (Ti.Facebook.loggedIn) {
					//disconnect facebook login in case of error
					Ti.Facebook.logout();
				}*/
			});
	
			$document.on('app.start', function() {
				//Init Map
				map.init();
				/*var activityIndicator = new activity({
					message: L('initializing')
				});
				activityIndicator.show();*/
	
				//init with server infos
				query.init(function (infos) {
					//update token and favorites if any
					if (infos.token) {
						user.set('token', infos.token);
						user.set('today_publications', infos.today_publications);
						if (infos.favorites) {
							user.set('favorites', infos.favorites);
						}
					} else {
						//logout
						$document.triggerHandler('app.logout');
					}
					//update categories
					if (infos.categories) {
						data.set('categories', infos.categories);
					}
					//hide loader
					//activityIndicator.hide();
					slidebars.init();
	
					//show server message
					if (infos.message) {
						//show message page
						var messageWindow = __webpack_require__(/*! ./class/singleton/window.js */ 26);
						messageWindow.show({
							title: 	infos.message.title,
							text: 	infos.message.msg
						});
					}
					$document.triggerHandler('app.start-end');
				});
			});
	
			$document.on('app.start-end', function() {
				$('#splash').fadeOut('fast', function () {
					toast.show('Chargement terminé !');
					if (true) {
						console.info('all done (dev mode)');
					}
				});
			});
	
			//launch count
			if (!data.get('launchCount')) {
				data.set('launchCount', 1);
			} else {
				data.set('launchCount', data.get('launchCount') + 1);
			}
	
			//Orientation events
			/*Ti.Gesture.addEventListener('orientationchange', function(e) {
				Ti.App.fireEvent('app.orientation', e);
			});*/
			data.set('connectionAlert', 0);
			//show welcome page on first launch
			if (data.get('launchCount') == 1) {
				//init default app vars
				data.set('rules', false);
				data.set('fbPost', true);
				data.set('allowContact', true);
				data.set('postNotif', true);
				data.set('commentNotif', true);
				//Ti.App.Properties.setBool('eventfulSearch', true);
				data.set('unit', 'km');
				data.set('radius', 150);
				data.set('categories', []);
	
				/*//show welcome page
				var welcomeWindow = require('ui/welcome');
				var welcome = new welcomeWindow();
				welcome.addEventListener('close', function () {
					//launch app
					$document.triggerHandler('app.start');
				});
				welcome.open();*/
			} else {
				//launch app
				//$document.triggerHandler('app.start');
			}
	
			//launch app
			$document.triggerHandler('app.start');
		});
	}) (jQuery);

/***/ },
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */
/*!**************************************!*\
  !*** ./class/singleton/slidebars.js ***!
  \**************************************/
/***/ function(module, exports, __webpack_require__) {

	var $ = __webpack_require__(/*! jquery */ 5);
	//Slidebars
	__webpack_require__(/*! ../../../libs/slidebars/0.10.3/dist/slidebars.js */ 6);
	__webpack_require__(/*! ../../../libs/slidebars/0.10.3/dist/slidebars.css */ 7);
	
	module.exports = (function() {
		// private functions
		function init () {
			//i18n
			var i18n = __webpack_require__(/*! ./i18n.js */ 11);
	
			$.slidebars();
			//Dom Events
			$('#when').on({
				'change': showHideCustomDates
			});
			showHideCustomDates();
			//populate categories list
			var data = __webpack_require__(/*! ./data.js */ 14);
	
			//set categories values
			var categories = data.get('categories');
			var $what = $('#what');
			$what.append('<option value="">'+ i18n.t('All events') +'</option>');
			if (categories) {
				for(var i = 0, l = categories.length; i < l; i++) {
					$what.append('<option value="'+ categories[i]['id'] +'">'+ i18n.t(categories[i]['label']) +'</option>');
				}
			}
	
			//$('#what')
			$('#search form').on({
				'submit': function() {
					if(true) {
						console.info('search');
					}
				}
			});
		}
	
		//HTML Dom
		function showHideCustomDates() {
			if ($('#when').val() === 'custom') {
				$('#search .specific-date').show('fast');
			} else {
				$('#search .specific-date').hide('fast');
			}
		}
	
		// API/data for end-user
		return {
			init: init
		}
	})();

/***/ },
/* 5 */
/*!*************************!*\
  !*** external "jQuery" ***!
  \*************************/
/***/ function(module, exports) {

	module.exports = jQuery;

/***/ },
/* 6 */
/*!**************************************************!*\
  !*** ../libs/slidebars/0.10.3/dist/slidebars.js ***!
  \**************************************************/
/***/ function(module, exports) {

	// -----------------------------------
	// Slidebars
	// Version 0.10.3
	// http://plugins.adchsm.me/slidebars/
	//
	// Written by Adam Smith
	// http://www.adchsm.me/
	//
	// Released under MIT License
	// http://plugins.adchsm.me/slidebars/license.txt
	//
	// ---------------------
	// Index of Slidebars.js
	//
	// 001 - Default Settings
	// 002 - Feature Detection
	// 003 - User Agents
	// 004 - Setup
	// 005 - Animation
	// 006 - Operations
	// 007 - API
	// 008 - User Input
	
	;( function ( $ ) {
	
		$.slidebars = function ( options ) {
	
			// ----------------------
			// 001 - Default Settings
	
			var settings = $.extend( {
				siteClose: true, // true or false - Enable closing of Slidebars by clicking on #sb-site.
				scrollLock: false, // true or false - Prevent scrolling of site when a Slidebar is open.
				disableOver: false, // integer or false - Hide Slidebars over a specific width.
				hideControlClasses: false // true or false - Hide controls at same width as disableOver.
			}, options );
	
			// -----------------------
			// 002 - Feature Detection
	
			var test = document.createElement( 'div' ).style, // Create element to test on.
			supportTransition = false, // Variable for testing transitions.
			supportTransform = false; // variable for testing transforms.
	
			// Test for CSS Transitions
			if ( test.MozTransition === '' || test.WebkitTransition === '' || test.OTransition === '' || test.transition === '' ) supportTransition = true;
	
			// Test for CSS Transforms
			if ( test.MozTransform === '' || test.WebkitTransform === '' || test.OTransform === '' || test.transform === '' ) supportTransform = true;
	
			// -----------------
			// 003 - User Agents
	
			var ua = navigator.userAgent, // Get user agent string.
			android = false, // Variable for storing android version.
			iOS = false; // Variable for storing iOS version.
			
			if ( /Android/.test( ua ) ) { // Detect Android in user agent string.
				android = ua.substr( ua.indexOf( 'Android' )+8, 3 ); // Set version of Android.
			} else if ( /(iPhone|iPod|iPad)/.test( ua ) ) { // Detect iOS in user agent string.
				iOS = ua.substr( ua.indexOf( 'OS ' )+3, 3 ).replace( '_', '.' ); // Set version of iOS.
			}
			
			if ( android && android < 3 || iOS && iOS < 5 ) $( 'html' ).addClass( 'sb-static' ); // Add helper class for older versions of Android & iOS.
	
			// -----------
			// 004 - Setup
	
			// Site container
			var $site = $( '#sb-site, .sb-site-container' ); // Cache the selector.
	
			// Left Slidebar	
			if ( $( '.sb-left' ).length ) { // Check if the left Slidebar exists.
				var $left = $( '.sb-left' ), // Cache the selector.
				leftActive = false; // Used to check whether the left Slidebar is open or closed.
			}
	
			// Right Slidebar
			if ( $( '.sb-right' ).length ) { // Check if the right Slidebar exists.
				var $right = $( '.sb-right' ), // Cache the selector.
				rightActive = false; // Used to check whether the right Slidebar is open or closed.
			}
					
			var init = false, // Initialisation variable.
			windowWidth = $( window ).width(), // Get width of window.
			$controls = $( '.sb-toggle-left, .sb-toggle-right, .sb-open-left, .sb-open-right, .sb-close' ), // Cache the control classes.
			$slide = $( '.sb-slide' ); // Cache users elements to animate.
			
			// Initailise Slidebars
			function initialise () {
				if ( ! settings.disableOver || ( typeof settings.disableOver === 'number' && settings.disableOver >= windowWidth ) ) { // False or larger than window size. 
					init = true; // true enabled Slidebars to open.
					$( 'html' ).addClass( 'sb-init' ); // Add helper class.
					if ( settings.hideControlClasses ) $controls.removeClass( 'sb-hide' ); // Remove class just incase Slidebars was originally disabled.
					css(); // Set required inline styles.
				} else if ( typeof settings.disableOver === 'number' && settings.disableOver < windowWidth ) { // Less than window size.
					init = false; // false stop Slidebars from opening.
					$( 'html' ).removeClass( 'sb-init' ); // Remove helper class.
					if ( settings.hideControlClasses ) $controls.addClass( 'sb-hide' ); // Hide controls
					$site.css( 'minHeight', '' ); // Remove minimum height.
					if ( leftActive || rightActive ) close(); // Close Slidebars if open.
				}
			}
			initialise();
			
			// Inline CSS
			function css() {
				// Site container height.
				$site.css( 'minHeight', '' );
				var siteHeight = parseInt( $site.css( 'height' ), 10 ),
				htmlHeight = parseInt( $( 'html' ).css( 'height' ), 10 );
				if ( siteHeight < htmlHeight ) $site.css( 'minHeight', $( 'html' ).css( 'height' ) ); // Test height for vh support..
				
				// Custom Slidebar widths.
				if ( $left && $left.hasClass( 'sb-width-custom' ) ) $left.css( 'width', $left.attr( 'data-sb-width' ) ); // Set user custom width.
				if ( $right && $right.hasClass( 'sb-width-custom' ) ) $right.css( 'width', $right.attr( 'data-sb-width' ) ); // Set user custom width.
				
				// Set off-canvas margins for Slidebars with push and overlay animations.
				if ( $left && ( $left.hasClass( 'sb-style-push' ) || $left.hasClass( 'sb-style-overlay' ) ) ) $left.css( 'marginLeft', '-' + $left.css( 'width' ) );
				if ( $right && ( $right.hasClass( 'sb-style-push' ) || $right.hasClass( 'sb-style-overlay' ) ) ) $right.css( 'marginRight', '-' + $right.css( 'width' ) );
				
				// Site scroll locking.
				if ( settings.scrollLock ) $( 'html' ).addClass( 'sb-scroll-lock' );
			}
			
			// Resize Functions
			$( window ).resize( function () {
				var resizedWindowWidth = $( window ).width(); // Get resized window width.
				if ( windowWidth !== resizedWindowWidth ) { // Slidebars is running and window was actually resized.
					windowWidth = resizedWindowWidth; // Set the new window width.
					initialise(); // Call initalise to see if Slidebars should still be running.
					if ( leftActive ) open( 'left' ); // If left Slidebar is open, calling open will ensure it is the correct size.
					if ( rightActive ) open( 'right' ); // If right Slidebar is open, calling open will ensure it is the correct size.
				}
			} );
			// I may include a height check along side a width check here in future.
	
			// ---------------
			// 005 - Animation
	
			var animation; // Animation type.
	
			// Set animation type.
			if ( supportTransition && supportTransform ) { // Browser supports css transitions and transforms.
				animation = 'translate'; // Translate for browsers that support it.
				if ( android && android < 4.4 ) animation = 'side'; // Android supports both, but can't translate any fixed positions, so use left instead.
			} else {
				animation = 'jQuery'; // Browsers that don't support css transitions and transitions.
			}
	
			// Animate mixin.
			function animate( object, amount, side ) {
				
				// Choose selectors depending on animation style.
				var selector;
				
				if ( object.hasClass( 'sb-style-push' ) ) {
					selector = $site.add( object ).add( $slide ); // Push - Animate site, Slidebar and user elements.
				} else if ( object.hasClass( 'sb-style-overlay' ) ) {
					selector = object; // Overlay - Animate Slidebar only.
				} else {
					selector = $site.add( $slide ); // Reveal - Animate site and user elements.
				}
				
				// Apply animation
				if ( animation === 'translate' ) {
					if ( amount === '0px' ) {
						removeAnimation();
					} else {
						selector.css( 'transform', 'translate( ' + amount + ' )' ); // Apply the animation.
					}
	
				} else if ( animation === 'side' ) {
					if ( amount === '0px' ) {
						removeAnimation();
					} else {
						if ( amount[0] === '-' ) amount = amount.substr( 1 ); // Remove the '-' from the passed amount for side animations.
						selector.css( side, '0px' ); // Add a 0 value so css transition works.
						setTimeout( function () { // Set a timeout to allow the 0 value to be applied above.
							selector.css( side, amount ); // Apply the animation.
						}, 1 );
					}
	
				} else if ( animation === 'jQuery' ) {
					if ( amount[0] === '-' ) amount = amount.substr( 1 ); // Remove the '-' from the passed amount for jQuery animations.
					var properties = {};
					properties[side] = amount;
					selector.stop().animate( properties, 400 ); // Stop any current jQuery animation before starting another.
				}
				
				// Remove animation
				function removeAnimation () {
					selector.removeAttr( 'style' );
					css();
				}
			}
	
			// ----------------
			// 006 - Operations
	
			// Open a Slidebar
			function open( side ) {
				// Check to see if opposite Slidebar is open.
				if ( side === 'left' && $left && rightActive || side === 'right' && $right && leftActive ) { // It's open, close it, then continue.
					close();
					setTimeout( proceed, 400 );
				} else { // Its not open, continue.
					proceed();
				}
	
				// Open
				function proceed() {
					if ( init && side === 'left' && $left ) { // Slidebars is initiated, left is in use and called to open.
						$( 'html' ).addClass( 'sb-active sb-active-left' ); // Add active classes.
						$left.addClass( 'sb-active' );
						animate( $left, $left.css( 'width' ), 'left' ); // Animation
						setTimeout( function () { leftActive = true; }, 400 ); // Set active variables.
					} else if ( init && side === 'right' && $right ) { // Slidebars is initiated, right is in use and called to open.
						$( 'html' ).addClass( 'sb-active sb-active-right' ); // Add active classes.
						$right.addClass( 'sb-active' );
						animate( $right, '-' + $right.css( 'width' ), 'right' ); // Animation
						setTimeout( function () { rightActive = true; }, 400 ); // Set active variables.
					}
				}
			}
				
			// Close either Slidebar
			function close( url, target ) {
				if ( leftActive || rightActive ) { // If a Slidebar is open.
					if ( leftActive ) {
						animate( $left, '0px', 'left' ); // Animation
						leftActive = false;
					}
					if ( rightActive ) {
						animate( $right, '0px', 'right' ); // Animation
						rightActive = false;
					}
				
					setTimeout( function () { // Wait for closing animation to finish.
						$( 'html' ).removeClass( 'sb-active sb-active-left sb-active-right' ); // Remove active classes.
						if ( $left ) $left.removeClass( 'sb-active' );
						if ( $right ) $right.removeClass( 'sb-active' );
						if ( typeof url !== 'undefined' ) { // If a link has been passed to the function, go to it.
							if ( typeof target === undefined ) target = '_self'; // Set to _self if undefined.
							window.open( url, target ); // Open the url.
						}
					}, 400 );
				}
			}
			
			// Toggle either Slidebar
			function toggle( side ) {
				if ( side === 'left' && $left ) { // If left Slidebar is called and in use.
					if ( ! leftActive ) {
						open( 'left' ); // Slidebar is closed, open it.
					} else {
						close(); // Slidebar is open, close it.
					}
				}
				if ( side === 'right' && $right ) { // If right Slidebar is called and in use.
					if ( ! rightActive ) {
						open( 'right' ); // Slidebar is closed, open it.
					} else {
						close(); // Slidebar is open, close it.
					}
				}
			}
	
			// ---------
			// 007 - API
			
			this.slidebars = {
				open: open, // Maps user variable name to the open method.
				close: close, // Maps user variable name to the close method.
				toggle: toggle, // Maps user variable name to the toggle method.
				init: function () { // Returns true or false whether Slidebars are running or not.
					return init; // Returns true or false whether Slidebars are running.
				},
				active: function ( side ) { // Returns true or false whether Slidebar is open or closed.
					if ( side === 'left' && $left ) return leftActive;
					if ( side === 'right' && $right ) return rightActive;
				},
				destroy: function ( side ) { // Removes the Slidebar from the DOM.
					if ( side === 'left' && $left ) {
						if ( leftActive ) close(); // Close if its open.
						setTimeout( function () {
							$left.remove(); // Remove it.
							$left = false; // Set variable to false so it cannot be opened again.
						}, 400 );
					}
					if ( side === 'right' && $right) {
						if ( rightActive ) close(); // Close if its open.
						setTimeout( function () {
							$right.remove(); // Remove it.
							$right = false; // Set variable to false so it cannot be opened again.
						}, 400 );
					}
				}
			};
	
			// ----------------
			// 008 - User Input
			
			function eventHandler( event, selector ) {
				event.stopPropagation(); // Stop event bubbling.
				event.preventDefault(); // Prevent default behaviour.
				if ( event.type === 'touchend' ) selector.off( 'click' ); // If event type was touch, turn off clicks to prevent phantom clicks.
			}
			
			// Toggle left Slidebar
			$( '.sb-toggle-left' ).on( 'touchend click', function ( event ) {
				eventHandler( event, $( this ) ); // Handle the event.
				toggle( 'left' ); // Toggle the left Slidbar.
			} );
			
			// Toggle right Slidebar
			$( '.sb-toggle-right' ).on( 'touchend click', function ( event ) {
				eventHandler( event, $( this ) ); // Handle the event.
				toggle( 'right' ); // Toggle the right Slidbar.
			} );
			
			// Open left Slidebar
			$( '.sb-open-left' ).on( 'touchend click', function ( event ) {
				eventHandler( event, $( this ) ); // Handle the event.
				open( 'left' ); // Open the left Slidebar.
			} );
			
			// Open right Slidebar
			$( '.sb-open-right' ).on( 'touchend click', function ( event ) {
				eventHandler( event, $( this ) ); // Handle the event.
				open( 'right' ); // Open the right Slidebar.
			} );
			
			// Close Slidebar
			$( '.sb-close' ).on( 'touchend click', function ( event ) {
				if ( $( this ).is( 'a' ) || $( this ).children().is( 'a' ) ) { // Is a link or contains a link.
					if ( event.type === 'click' ) { // Make sure the user wanted to follow the link.
						event.stopPropagation(); // Stop events propagating
						event.preventDefault(); // Stop default behaviour
						
						var link = ( $( this ).is( 'a' ) ? $( this ) : $( this ).find( 'a' ) ), // Get the link selector.
						url = link.attr( 'href' ), // Get the link url.
						target = ( link.attr( 'target' ) ? link.attr( 'target' ) : '_self' ); // Set target, default to _self if not provided
						
						close( url, target ); // Close Slidebar and pass link target.
					}
				} else { // Just a normal control class.
					eventHandler( event, $( this ) ); // Handle the event.
					close(); // Close Slidebar.
				}
			} );
			
			// Close Slidebar via site
			$site.on( 'touchend click', function ( event ) {
				if ( settings.siteClose && ( leftActive || rightActive ) ) { // If settings permit closing by site and left or right Slidebar is open.
					eventHandler( event, $( this ) ); // Handle the event.
					close(); // Close it.
				}
			} );
			
		}; // End Slidebars function.
	
	} ) ( jQuery );

/***/ },
/* 7 */
/*!***************************************************!*\
  !*** ../libs/slidebars/0.10.3/dist/slidebars.css ***!
  \***************************************************/
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(/*! !./../../../../../~/css-loader!./../../../../../~/postcss-loader!./slidebars.css */ 8);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(/*! ./../../../../../~/style-loader/addStyles.js */ 10)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../../../node_modules/css-loader/index.js!./../../../../../node_modules/postcss-loader/index.js!./slidebars.css", function() {
				var newContent = require("!!./../../../../../node_modules/css-loader/index.js!./../../../../../node_modules/postcss-loader/index.js!./slidebars.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 8 */
/*!***************************************************************************************************************************!*\
  !*** /mnt/windows/wouafit/~/css-loader!/mnt/windows/wouafit/~/postcss-loader!../libs/slidebars/0.10.3/dist/slidebars.css ***!
  \***************************************************************************************************************************/
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(/*! ./../../../../../~/css-loader/lib/css-base.js */ 9)();
	// imports
	
	
	// module
	exports.push([module.id, "/* -----------------------------------\n * Slidebars\n * Version 0.10.3\n * http://plugins.adchsm.me/slidebars/\n *\n * Written by Adam Smith\n * http://www.adchsm.me/\n *\n * Released under MIT License\n * http://plugins.adchsm.me/slidebars/license.txt\n *\n * -------------------\n * Slidebars CSS Index\n *\n * 001 - Box Model, Html & Body\n * 002 - Site\n * 003 - Slidebars\n * 004 - Animation\n * 005 - Helper Classes\n *\n * ----------------------------\n * 001 - Box Model, Html & Body\n */\n\nhtml, body, #sb-site, .sb-site-container, .sb-slidebar {\n\t/* Set box model to prevent any user added margins or paddings from altering the widths or heights. */\n\tmargin: 0;\n\tpadding: 0;\n\t-webkit-box-sizing: border-box;\n\t   -moz-box-sizing: border-box;\n\t        box-sizing: border-box;\n}\n\nhtml, body {\n\twidth: 100%;\n\toverflow-x: hidden; /* Stops horizontal scrolling. */\n}\n\nhtml {\n\theight: 100%; /* Site is as tall as device. */\n}\n\nbody {\n\tmin-height: 100%;\n\theight: auto;\n\tposition: relative; /* Required for static Slidebars to function properly. */\n}\n\n/* Site scroll locking - prevent site from scrolling when a Slidebar is open, except when static Slidebars are only available. */\nhtml.sb-scroll-lock.sb-active:not(.sb-static) {\n\toverflow: hidden;\n}\n\n/* ----------\n * 002 - Site\n */\n\n#sb-site, .sb-site-container {\n\t/* You may now use class .sb-site-container instead of #sb-site and use your own id. However please make sure you don't set any of the following styles any differently on your id. */\n\twidth: 100%;\n\tmin-height: 100vh;\n\tposition: relative;\n\tz-index: 1; /* Site sits above Slidebars */\n\tbackground-color: #ffffff; /* Default background colour, overwrite this with your own css. I suggest moving your html or body background styling here. Making this transparent will allow the Slidebars beneath to be visible. */\n}\n\n/* Micro clearfix by Nicolas Gallagher, ensures the site container hits the top and bottom of the screen. */\n#sb-site:before, #sb-site:after, .sb-site-container:before, .sb-site-container:after {\n\tcontent: ' ';\n\tdisplay: table;\n}\n\n#sb-site:before, #sb-site:after, .sb-site-container:before, .sb-site-container:after {\n    clear: both;\n}\n\n/* ---------------\n * 003 - Slidebars\n */\n\n.sb-slidebar {\n\theight: 100%;\n\toverflow-y: auto; /* Enable vertical scrolling on Slidebars when needed. */\n\tposition: fixed;\n\ttop: 0;\n\tz-index: 0; /* Slidebars sit behind sb-site. */\n\tdisplay: none; /* Initially hide the Slidebars. Changed from visibility to display to allow -webkit-overflow-scrolling. */\n\tbackground-color: #222222; /* Default Slidebars background colour, overwrite this with your own css. */\n}\n\n.sb-slidebar, .sb-slidebar * {\n\t-webkit-transform: translateZ( 0px ); /* Fixes issues with translated and z-indexed elements on iOS 7. */\n}\n\n.sb-left {\n\tleft: 0; /* Set Slidebar to the left. */\n}\n\n.sb-right {\n\tright: 0; /* Set Slidebar to the right. */\n}\n\nhtml.sb-static .sb-slidebar,\n.sb-slidebar.sb-static {\n\tposition: absolute; /* Makes Slidebars scroll naturally with the site, and unfixes them for Android Browser < 3 and iOS < 5. */\n}\n\n.sb-slidebar.sb-active {\n\tdisplay: block; /* Makes Slidebars visibile when open. Changed from visibility to display to allow -webkit-overflow-scrolling. */\n}\n\n.sb-style-overlay {\n\tz-index: 9999; /* Set z-index high to ensure it overlays any other site elements. */\n}\n\n.sb-momentum-scrolling {\n\t-webkit-overflow-scrolling: touch; /* Adds native momentum scrolling for iOS & Android devices. */\n}\n\n/* Slidebar widths for browsers/devices that don't support media queries. */\n\t.sb-slidebar {\n\t\twidth: 30%;\n\t}\n\t\n\t.sb-width-thin {\n\t\twidth: 15%;\n\t}\n\t\n\t.sb-width-wide {\n\t\twidth: 45%;\n\t}\n\n@media (max-width: 480px) { /* Slidebar widths on extra small screens. */\n\t.sb-slidebar {\n\t\twidth: 70%;\n\t}\n\t\n\t.sb-width-thin {\n\t\twidth: 55%;\n\t}\n\t\n\t.sb-width-wide {\n\t\twidth: 85%;\n\t}\n}\n\n@media (min-width: 481px) { /* Slidebar widths on small screens. */\n\t.sb-slidebar {\n\t\twidth: 55%;\n\t}\n\t\n\t.sb-width-thin {\n\t\twidth: 40%;\n\t}\n\t\n\t.sb-width-wide {\n\t\twidth: 70%;\n\t}\n}\n\n@media (min-width: 768px) { /* Slidebar widths on medium screens. */\n\t.sb-slidebar {\n\t\twidth: 40%;\n\t}\n\t\n\t.sb-width-thin {\n\t\twidth: 25%;\n\t}\n\t\n\t.sb-width-wide {\n\t\twidth: 55%;\n\t}\n}\n\n@media (min-width: 992px) { /* Slidebar widths on large screens. */\n\t.sb-slidebar {\n\t\twidth: 30%;\n\t}\n\t\n\t.sb-width-thin {\n\t\twidth: 15%;\n\t}\n\t\n\t.sb-width-wide {\n\t\twidth: 45%;\n\t}\n}\n\n@media (min-width: 1200px) { /* Slidebar widths on extra large screens. */\n\t.sb-slidebar {\n\t\twidth: 20%;\n\t}\n\t\n\t.sb-width-thin {\n\t\twidth: 5%;\n\t}\n\t\n\t.sb-width-wide {\n\t\twidth: 35%;\n\t}\n}\n\n/* ---------------\n * 004 - Animation\n */\n\n.sb-slide, #sb-site, .sb-site-container, .sb-slidebar {\n\t-webkit-transform: translate( 0px );\n\t   -moz-transform: translate( 0px );\n\t     -o-transform: translate( 0px );\n\t        transform: translate( 0px );\n\t\n\t-webkit-transition: -webkit-transform 400ms ease;\n\t   -moz-transition:    -moz-transform 400ms ease;\n\t     -o-transition:      -o-transform 400ms ease;\n\t        transition:         transform 400ms ease;\n\t\n\t-webkit-transition-property: -webkit-transform, left, right; /* Add left/right for Android < 4.4. */\n\t-webkit-backface-visibility: hidden; /* Prevents flickering. This is non essential, and you may remove it if your having problems with fixed background images in Chrome. */\n}\n\n/* --------------------\n * 005 - Helper Classes\n */\n \n.sb-hide { \n\tdisplay: none; /* Optionally applied to control classes when Slidebars is disabled over a certain width. */\n}", ""]);
	
	// exports


/***/ },
/* 9 */
/*!*********************************************************!*\
  !*** /mnt/windows/wouafit/~/css-loader/lib/css-base.js ***!
  \*********************************************************/
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];
	
		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};
	
		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 10 */
/*!********************************************************!*\
  !*** /mnt/windows/wouafit/~/style-loader/addStyles.js ***!
  \********************************************************/
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0;
	
	module.exports = function(list, options) {
		if(true) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}
	
		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();
	
		var styles = listToStyles(list);
		addStylesToDom(styles, options);
	
		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}
	
	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}
	
	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}
	
	function createStyleElement() {
		var styleElement = document.createElement("style");
		var head = getHeadElement();
		styleElement.type = "text/css";
		head.appendChild(styleElement);
		return styleElement;
	}
	
	function createLinkElement() {
		var linkElement = document.createElement("link");
		var head = getHeadElement();
		linkElement.rel = "stylesheet";
		head.appendChild(linkElement);
		return linkElement;
	}
	
	function addStyle(obj, options) {
		var styleElement, update, remove;
	
		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement());
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement();
			update = updateLink.bind(null, styleElement);
			remove = function() {
				styleElement.parentNode.removeChild(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement();
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				styleElement.parentNode.removeChild(styleElement);
			};
		}
	
		update(obj);
	
		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}
	
	var replaceText = (function () {
		var textStore = [];
	
		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();
	
	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;
	
		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}
	
	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;
	
		if(media) {
			styleElement.setAttribute("media", media)
		}
	
		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}
	
	function updateLink(linkElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;
	
		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}
	
		var blob = new Blob([css], { type: "text/css" });
	
		var oldSrc = linkElement.href;
	
		linkElement.href = URL.createObjectURL(blob);
	
		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },
/* 11 */
/*!*********************************!*\
  !*** ./class/singleton/i18n.js ***!
  \*********************************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = (function() {
		var self = {};
		//i18next
		var i18next = __webpack_require__(/*! ../../../libs/i18next/1.10.1/i18next-1.10.1.js */ 12);
		//Init plugin with current language
		i18next.init({ resStore: {dev: {translation: __webpack_require__(/*! ../../../../languages/en-us.json */ 13)} } });
	
		self.t = i18next.t;
		return self;
	})();

/***/ },
/* 12 */
/*!************************************************!*\
  !*** ../libs/i18next/1.10.1/i18next-1.10.1.js ***!
  \************************************************/
/***/ function(module, exports, __webpack_require__) {

	// i18next, v1.10.1
	// Copyright (c)2015 Jan Mühlemann (jamuhl).
	// Distributed under MIT license
	// http://i18next.com
	
	exports.jQuery = jQuery;
	
	(function(root) {
	
	    // add indexOf to non ECMA-262 standard compliant browsers
	    if (!Array.prototype.indexOf) {
	        Array.prototype.indexOf = function (searchElement /*, fromIndex */ ) {
	            "use strict";
	            if (this == null) {
	                throw new TypeError();
	            }
	            var t = Object(this);
	            var len = t.length >>> 0;
	            if (len === 0) {
	                return -1;
	            }
	            var n = 0;
	            if (arguments.length > 0) {
	                n = Number(arguments[1]);
	                if (n != n) { // shortcut for verifying if it's NaN
	                    n = 0;
	                } else if (n != 0 && n != Infinity && n != -Infinity) {
	                    n = (n > 0 || -1) * Math.floor(Math.abs(n));
	                }
	            }
	            if (n >= len) {
	                return -1;
	            }
	            var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
	            for (; k < len; k++) {
	                if (k in t && t[k] === searchElement) {
	                    return k;
	                }
	            }
	            return -1;
	        }
	    }
	    
	    // add lastIndexOf to non ECMA-262 standard compliant browsers
	    if (!Array.prototype.lastIndexOf) {
	        Array.prototype.lastIndexOf = function(searchElement /*, fromIndex*/) {
	            "use strict";
	            if (this == null) {
	                throw new TypeError();
	            }
	            var t = Object(this);
	            var len = t.length >>> 0;
	            if (len === 0) {
	                return -1;
	            }
	            var n = len;
	            if (arguments.length > 1) {
	                n = Number(arguments[1]);
	                if (n != n) {
	                    n = 0;
	                } else if (n != 0 && n != (1 / 0) && n != -(1 / 0)) {
	                    n = (n > 0 || -1) * Math.floor(Math.abs(n));
	                }
	            }
	            var k = n >= 0 ? Math.min(n, len - 1) : len - Math.abs(n);
	            for (; k >= 0; k--) {
	                if (k in t && t[k] === searchElement) {
	                    return k;
	                }
	            }
	            return -1;
	        };
	    }
	    
	    // Add string trim for IE8.
	    if (typeof String.prototype.trim !== 'function') {
	        String.prototype.trim = function() {
	            return this.replace(/^\s+|\s+$/g, ''); 
	        }
	    }
	
	    var $ = root.jQuery || root.Zepto
	      , i18n = {}
	      , resStore = {}
	      , currentLng
	      , replacementCounter = 0
	      , languages = []
	      , initialized = false
	      , sync = {}
	      , conflictReference = null;
	
	
	
	    // Export the i18next object for **CommonJS**. 
	    // If we're not in CommonJS, add `i18n` to the
	    // global object or to jquery.
	    if (typeof module !== 'undefined' && module.exports) {
	        module.exports = i18n;
	    } else {
	        if ($) {
	            $.i18n = $.i18n || i18n;
	        }
	        
	        if (root.i18n) {
	        	conflictReference = root.i18n;
	        }
	        root.i18n = i18n;
	    }
	    sync = {
	    
	        load: function(lngs, options, cb) {
	            if (options.useLocalStorage) {
	                sync._loadLocal(lngs, options, function(err, store) {
	                    var missingLngs = [];
	                    for (var i = 0, len = lngs.length; i < len; i++) {
	                        if (!store[lngs[i]]) missingLngs.push(lngs[i]);
	                    }
	    
	                    if (missingLngs.length > 0) {
	                        sync._fetch(missingLngs, options, function(err, fetched) {
	                            f.extend(store, fetched);
	                            sync._storeLocal(fetched);
	    
	                            cb(err, store);
	                        });
	                    } else {
	                        cb(err, store);
	                    }
	                });
	            } else {
	                sync._fetch(lngs, options, function(err, store){
	                    cb(err, store);
	                });
	            }
	        },
	    
	        _loadLocal: function(lngs, options, cb) {
	            var store = {}
	              , nowMS = new Date().getTime();
	    
	            if(window.localStorage) {
	    
	                var todo = lngs.length;
	    
	                f.each(lngs, function(key, lng) {
	                    var local = f.localStorage.getItem('res_' + lng);
	    
	                    if (local) {
	                        local = JSON.parse(local);
	    
	                        if (local.i18nStamp && local.i18nStamp + options.localStorageExpirationTime > nowMS) {
	                            store[lng] = local;
	                        }
	                    }
	    
	                    todo--; // wait for all done befor callback
	                    if (todo === 0) cb(null, store);
	                });
	            }
	        },
	    
	        _storeLocal: function(store) {
	            if(window.localStorage) {
	                for (var m in store) {
	                    store[m].i18nStamp = new Date().getTime();
	                    f.localStorage.setItem('res_' + m, JSON.stringify(store[m]));
	                }
	            }
	            return;
	        },
	    
	        _fetch: function(lngs, options, cb) {
	            var ns = options.ns
	              , store = {};
	            
	            if (!options.dynamicLoad) {
	                var todo = ns.namespaces.length * lngs.length
	                  , errors;
	    
	                // load each file individual
	                f.each(ns.namespaces, function(nsIndex, nsValue) {
	                    f.each(lngs, function(lngIndex, lngValue) {
	                        
	                        // Call this once our translation has returned.
	                        var loadComplete = function(err, data) {
	                            if (err) {
	                                errors = errors || [];
	                                errors.push(err);
	                            }
	                            store[lngValue] = store[lngValue] || {};
	                            store[lngValue][nsValue] = data;
	    
	                            todo--; // wait for all done befor callback
	                            if (todo === 0) cb(errors, store);
	                        };
	                        
	                        if(typeof options.customLoad == 'function'){
	                            // Use the specified custom callback.
	                            options.customLoad(lngValue, nsValue, options, loadComplete);
	                        } else {
	                            //~ // Use our inbuilt sync.
	                            sync._fetchOne(lngValue, nsValue, options, loadComplete);
	                        }
	                    });
	                });
	            } else {
	                // Call this once our translation has returned.
	                var loadComplete = function(err, data) {
	                    cb(err, data);
	                };
	    
	                if(typeof options.customLoad == 'function'){
	                    // Use the specified custom callback.
	                    options.customLoad(lngs, ns.namespaces, options, loadComplete);
	                } else {
	                    var url = applyReplacement(options.resGetPath, { lng: lngs.join('+'), ns: ns.namespaces.join('+') });
	                    // load all needed stuff once
	                    f.ajax({
	                        url: url,
	                        cache: options.cache,
	                        success: function(data, status, xhr) {
	                            f.log('loaded: ' + url);
	                            loadComplete(null, data);
	                        },
	                        error : function(xhr, status, error) {
	                            f.log('failed loading: ' + url);
	                            loadComplete('failed loading resource.json error: ' + error);
	                        },
	                        dataType: "json",
	                        async : options.getAsync,
	                        timeout: options.ajaxTimeout
	                    });
	                }    
	            }
	        },
	    
	        _fetchOne: function(lng, ns, options, done) {
	            var url = applyReplacement(options.resGetPath, { lng: lng, ns: ns });
	            f.ajax({
	                url: url,
	                cache: options.cache,
	                success: function(data, status, xhr) {
	                    f.log('loaded: ' + url);
	                    done(null, data);
	                },
	                error : function(xhr, status, error) {
	                    if ((status && status == 200) || (xhr && xhr.status && xhr.status == 200)) {
	                        // file loaded but invalid json, stop waste time !
	                        f.error('There is a typo in: ' + url);
	                    } else if ((status && status == 404) || (xhr && xhr.status && xhr.status == 404)) {
	                        f.log('Does not exist: ' + url);
	                    } else {
	                        var theStatus = status ? status : ((xhr && xhr.status) ? xhr.status : null);
	                        f.log(theStatus + ' when loading ' + url);
	                    }
	                    
	                    done(error, {});
	                },
	                dataType: "json",
	                async : options.getAsync,
	                timeout: options.ajaxTimeout
	            });
	        },
	    
	        postMissing: function(lng, ns, key, defaultValue, lngs) {
	            var payload = {};
	            payload[key] = defaultValue;
	    
	            var urls = [];
	    
	            if (o.sendMissingTo === 'fallback' && o.fallbackLng[0] !== false) {
	                for (var i = 0; i < o.fallbackLng.length; i++) {
	                    urls.push({lng: o.fallbackLng[i], url: applyReplacement(o.resPostPath, { lng: o.fallbackLng[i], ns: ns })});
	                }
	            } else if (o.sendMissingTo === 'current' || (o.sendMissingTo === 'fallback' && o.fallbackLng[0] === false) ) {
	                urls.push({lng: lng, url: applyReplacement(o.resPostPath, { lng: lng, ns: ns })});
	            } else if (o.sendMissingTo === 'all') {
	                for (var i = 0, l = lngs.length; i < l; i++) {
	                    urls.push({lng: lngs[i], url: applyReplacement(o.resPostPath, { lng: lngs[i], ns: ns })});
	                }
	            }
	    
	            for (var y = 0, len = urls.length; y < len; y++) {
	                var item = urls[y];
	                f.ajax({
	                    url: item.url,
	                    type: o.sendType,
	                    data: payload,
	                    success: function(data, status, xhr) {
	                        f.log('posted missing key \'' + key + '\' to: ' + item.url);
	    
	                        // add key to resStore
	                        var keys = key.split('.');
	                        var x = 0;
	                        var value = resStore[item.lng][ns];
	                        while (keys[x]) {
	                            if (x === keys.length - 1) {
	                                value = value[keys[x]] = defaultValue;
	                            } else {
	                                value = value[keys[x]] = value[keys[x]] || {};
	                            }
	                            x++;
	                        }
	                    },
	                    error : function(xhr, status, error) {
	                        f.log('failed posting missing key \'' + key + '\' to: ' + item.url);
	                    },
	                    dataType: "json",
	                    async : o.postAsync,
	                    timeout: o.ajaxTimeout
	                });
	            }
	        },
	    
	        reload: reload
	    };
	    // defaults
	    var o = {
	        lng: undefined,
	        load: 'all',
	        preload: [],
	        lowerCaseLng: false,
	        returnObjectTrees: false,
	        fallbackLng: ['dev'],
	        fallbackNS: [],
	        detectLngQS: 'setLng',
	        detectLngFromLocalStorage: false,
	        ns: {
	            namespaces: ['translation'],
	            defaultNs: 'translation'
	        },
	        fallbackOnNull: true,
	        fallbackOnEmpty: false,
	        fallbackToDefaultNS: false,
	        showKeyIfEmpty: false,
	        nsseparator: ':',
	        keyseparator: '.',
	        selectorAttr: 'data-i18n',
	        debug: false,
	    
	        resGetPath: 'locales/__lng__/__ns__.json',
	        resPostPath: 'locales/add/__lng__/__ns__',
	    
	        getAsync: true,
	        postAsync: true,
	    
	        resStore: undefined,
	        useLocalStorage: false,
	        localStorageExpirationTime: 7*24*60*60*1000,
	    
	        dynamicLoad: false,
	        sendMissing: false,
	        sendMissingTo: 'fallback', // current | all
	        sendType: 'POST',
	    
	        interpolationPrefix: '__',
	        interpolationSuffix: '__',
	        defaultVariables: false,
	        reusePrefix: '$t(',
	        reuseSuffix: ')',
	        pluralSuffix: '_plural',
	        pluralNotFound: ['plural_not_found', Math.random()].join(''),
	        contextNotFound: ['context_not_found', Math.random()].join(''),
	        escapeInterpolation: false,
	        indefiniteSuffix: '_indefinite',
	        indefiniteNotFound: ['indefinite_not_found', Math.random()].join(''),
	    
	        setJqueryExt: true,
	        defaultValueFromContent: true,
	        useDataAttrOptions: false,
	        cookieExpirationTime: undefined,
	        useCookie: true,
	        cookieName: 'i18next',
	        cookieDomain: undefined,
	    
	        objectTreeKeyHandler: undefined,
	        postProcess: undefined,
	        parseMissingKey: undefined,
	        missingKeyHandler: sync.postMissing,
	        ajaxTimeout: 0,
	    
	        shortcutFunction: 'sprintf' // or: defaultValue
	    };
	    function _extend(target, source) {
	        if (!source || typeof source === 'function') {
	            return target;
	        }
	    
	        for (var attr in source) { target[attr] = source[attr]; }
	        return target;
	    }
	    
	    function _deepExtend(target, source) {
	        for (var prop in source)
	            if (prop in target)
	                _deepExtend(target[prop], source[prop]);
	            else
	                target[prop] = source[prop];
	        return target;
	    }
	    
	    function _each(object, callback, args) {
	        var name, i = 0,
	            length = object.length,
	            isObj = length === undefined || Object.prototype.toString.apply(object) !== '[object Array]' || typeof object === "function";
	    
	        if (args) {
	            if (isObj) {
	                for (name in object) {
	                    if (callback.apply(object[name], args) === false) {
	                        break;
	                    }
	                }
	            } else {
	                for ( ; i < length; ) {
	                    if (callback.apply(object[i++], args) === false) {
	                        break;
	                    }
	                }
	            }
	    
	        // A special, fast, case for the most common use of each
	        } else {
	            if (isObj) {
	                for (name in object) {
	                    if (callback.call(object[name], name, object[name]) === false) {
	                        break;
	                    }
	                }
	            } else {
	                for ( ; i < length; ) {
	                    if (callback.call(object[i], i, object[i++]) === false) {
	                        break;
	                    }
	                }
	            }
	        }
	    
	        return object;
	    }
	    
	    var _entityMap = {
	        "&": "&amp;",
	        "<": "&lt;",
	        ">": "&gt;",
	        '"': '&quot;',
	        "'": '&#39;',
	        "/": '&#x2F;'
	    };
	    
	    function _escape(data) {
	        if (typeof data === 'string') {
	            return data.replace(/[&<>"'\/]/g, function (s) {
	                return _entityMap[s];
	            });
	        }else{
	            return data;
	        }
	    }
	    
	    function _ajax(options) {
	    
	        // v0.5.0 of https://github.com/goloroden/http.js
	        var getXhr = function (callback) {
	            // Use the native XHR object if the browser supports it.
	            if (window.XMLHttpRequest) {
	                return callback(null, new XMLHttpRequest());
	            } else if (window.ActiveXObject) {
	                // In Internet Explorer check for ActiveX versions of the XHR object.
	                try {
	                    return callback(null, new ActiveXObject("Msxml2.XMLHTTP"));
	                } catch (e) {
	                    return callback(null, new ActiveXObject("Microsoft.XMLHTTP"));
	                }
	            }
	    
	            // If no XHR support was found, throw an error.
	            return callback(new Error());
	        };
	    
	        var encodeUsingUrlEncoding = function (data) {
	            if(typeof data === 'string') {
	                return data;
	            }
	    
	            var result = [];
	            for(var dataItem in data) {
	                if(data.hasOwnProperty(dataItem)) {
	                    result.push(encodeURIComponent(dataItem) + '=' + encodeURIComponent(data[dataItem]));
	                }
	            }
	    
	            return result.join('&');
	        };
	    
	        var utf8 = function (text) {
	            text = text.replace(/\r\n/g, '\n');
	            var result = '';
	    
	            for(var i = 0; i < text.length; i++) {
	                var c = text.charCodeAt(i);
	    
	                if(c < 128) {
	                        result += String.fromCharCode(c);
	                } else if((c > 127) && (c < 2048)) {
	                        result += String.fromCharCode((c >> 6) | 192);
	                        result += String.fromCharCode((c & 63) | 128);
	                } else {
	                        result += String.fromCharCode((c >> 12) | 224);
	                        result += String.fromCharCode(((c >> 6) & 63) | 128);
	                        result += String.fromCharCode((c & 63) | 128);
	                }
	            }
	    
	            return result;
	        };
	    
	        var base64 = function (text) {
	            var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
	    
	            text = utf8(text);
	            var result = '',
	                    chr1, chr2, chr3,
	                    enc1, enc2, enc3, enc4,
	                    i = 0;
	    
	            do {
	                chr1 = text.charCodeAt(i++);
	                chr2 = text.charCodeAt(i++);
	                chr3 = text.charCodeAt(i++);
	    
	                enc1 = chr1 >> 2;
	                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
	                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
	                enc4 = chr3 & 63;
	    
	                if(isNaN(chr2)) {
	                    enc3 = enc4 = 64;
	                } else if(isNaN(chr3)) {
	                    enc4 = 64;
	                }
	    
	                result +=
	                    keyStr.charAt(enc1) +
	                    keyStr.charAt(enc2) +
	                    keyStr.charAt(enc3) +
	                    keyStr.charAt(enc4);
	                chr1 = chr2 = chr3 = '';
	                enc1 = enc2 = enc3 = enc4 = '';
	            } while(i < text.length);
	    
	            return result;
	        };
	    
	        var mergeHeaders = function () {
	            // Use the first header object as base.
	            var result = arguments[0];
	    
	            // Iterate through the remaining header objects and add them.
	            for(var i = 1; i < arguments.length; i++) {
	                var currentHeaders = arguments[i];
	                for(var header in currentHeaders) {
	                    if(currentHeaders.hasOwnProperty(header)) {
	                        result[header] = currentHeaders[header];
	                    }
	                }
	            }
	    
	            // Return the merged headers.
	            return result;
	        };
	    
	        var ajax = function (method, url, options, callback) {
	            // Adjust parameters.
	            if(typeof options === 'function') {
	                callback = options;
	                options = {};
	            }
	    
	            // Set default parameter values.
	            options.cache = options.cache || false;
	            options.data = options.data || {};
	            options.headers = options.headers || {};
	            options.jsonp = options.jsonp || false;
	            options.async = options.async === undefined ? true : options.async;
	    
	            // Merge the various header objects.
	            var headers = mergeHeaders({
	                'accept': '*/*',
	                'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
	            }, ajax.headers, options.headers);
	    
	            // Encode the data according to the content-type.
	            var payload;
	            if (headers['content-type'] === 'application/json') {
	                payload = JSON.stringify(options.data);
	            } else {
	                payload = encodeUsingUrlEncoding(options.data);
	            }
	    
	            // Specially prepare GET requests: Setup the query string, handle caching and make a JSONP call
	            // if neccessary.
	            if(method === 'GET') {
	                // Setup the query string.
	                var queryString = [];
	                if(payload) {
	                    queryString.push(payload);
	                    payload = null;
	                }
	    
	                // Handle caching.
	                if(!options.cache) {
	                    queryString.push('_=' + (new Date()).getTime());
	                }
	    
	                // If neccessary prepare the query string for a JSONP call.
	                if(options.jsonp) {
	                    queryString.push('callback=' + options.jsonp);
	                    queryString.push('jsonp=' + options.jsonp);
	                }
	    
	                // Merge the query string and attach it to the url.
	                queryString = queryString.join('&');
	                if (queryString.length > 1) {
	                    if (url.indexOf('?') > -1) {
	                        url += '&' + queryString;
	                    } else {
	                        url += '?' + queryString;
	                    }
	                }
	    
	                // Make a JSONP call if neccessary.
	                if(options.jsonp) {
	                    var head = document.getElementsByTagName('head')[0];
	                    var script = document.createElement('script');
	                    script.type = 'text/javascript';
	                    script.src = url;
	                    head.appendChild(script);
	                    return;
	                }
	            }
	    
	            // Since we got here, it is no JSONP request, so make a normal XHR request.
	            getXhr(function (err, xhr) {
	                if(err) return callback(err);
	    
	                // Open the request.
	                xhr.open(method, url, options.async);
	    
	                // Set the request headers.
	                for(var header in headers) {
	                    if(headers.hasOwnProperty(header)) {
	                        xhr.setRequestHeader(header, headers[header]);
	                    }
	                }
	    
	                // Handle the request events.
	                xhr.onreadystatechange = function () {
	                    if(xhr.readyState === 4) {
	                        var data = xhr.responseText || '';
	    
	                        // If no callback is given, return.
	                        if(!callback) {
	                            return;
	                        }
	    
	                        // Return an object that provides access to the data as text and JSON.
	                        callback(xhr.status, {
	                            text: function () {
	                                return data;
	                            },
	    
	                            json: function () {
	                                try {
	                                    return JSON.parse(data)
	                                } catch (e) {
	                                    f.error('Can not parse JSON. URL: ' + url);
	                                    return {};
	                                }
	                            }
	                        });
	                    }
	                };
	    
	                // Actually send the XHR request.
	                xhr.send(payload);
	            });
	        };
	    
	        // Define the external interface.
	        var http = {
	            authBasic: function (username, password) {
	                ajax.headers['Authorization'] = 'Basic ' + base64(username + ':' + password);
	            },
	    
	            connect: function (url, options, callback) {
	                return ajax('CONNECT', url, options, callback);
	            },
	    
	            del: function (url, options, callback) {
	                return ajax('DELETE', url, options, callback);
	            },
	    
	            get: function (url, options, callback) {
	                return ajax('GET', url, options, callback);
	            },
	    
	            head: function (url, options, callback) {
	                return ajax('HEAD', url, options, callback);
	            },
	    
	            headers: function (headers) {
	                ajax.headers = headers || {};
	            },
	    
	            isAllowed: function (url, verb, callback) {
	                this.options(url, function (status, data) {
	                    callback(data.text().indexOf(verb) !== -1);
	                });
	            },
	    
	            options: function (url, options, callback) {
	                return ajax('OPTIONS', url, options, callback);
	            },
	    
	            patch: function (url, options, callback) {
	                return ajax('PATCH', url, options, callback);
	            },
	    
	            post: function (url, options, callback) {
	                return ajax('POST', url, options, callback);
	            },
	    
	            put: function (url, options, callback) {
	                return ajax('PUT', url, options, callback);
	            },
	    
	            trace: function (url, options, callback) {
	                return ajax('TRACE', url, options, callback);
	            }
	        };
	    
	    
	        var methode = options.type ? options.type.toLowerCase() : 'get';
	    
	        http[methode](options.url, options, function (status, data) {
	            // file: protocol always gives status code 0, so check for data
	            if (status === 200 || (status === 0 && data.text())) {
	                options.success(data.json(), status, null);
	            } else {
	                options.error(data.text(), status, null);
	            }
	        });
	    }
	    
	    var _cookie = {
	        create: function(name,value,minutes,domain) {
	            var expires;
	            if (minutes) {
	                var date = new Date();
	                date.setTime(date.getTime()+(minutes*60*1000));
	                expires = "; expires="+date.toGMTString();
	            }
	            else expires = "";
	            domain = (domain)? "domain="+domain+";" : "";
	            document.cookie = name+"="+value+expires+";"+domain+"path=/";
	        },
	    
	        read: function(name) {
	            var nameEQ = name + "=";
	            var ca = document.cookie.split(';');
	            for(var i=0;i < ca.length;i++) {
	                var c = ca[i];
	                while (c.charAt(0)==' ') c = c.substring(1,c.length);
	                if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length,c.length);
	            }
	            return null;
	        },
	    
	        remove: function(name) {
	            this.create(name,"",-1);
	        }
	    };
	    
	    var cookie_noop = {
	        create: function(name,value,minutes,domain) {},
	        read: function(name) { return null; },
	        remove: function(name) {}
	    };
	    
	    
	    
	    // move dependent functions to a container so that
	    // they can be overriden easier in no jquery environment (node.js)
	    var f = {
	        extend: $ ? $.extend : _extend,
	        deepExtend: _deepExtend,
	        each: $ ? $.each : _each,
	        ajax: $ ? $.ajax : (typeof document !== 'undefined' ? _ajax : function() {}),
	        cookie: typeof document !== 'undefined' ? _cookie : cookie_noop,
	        detectLanguage: detectLanguage,
	        escape: _escape,
	        log: function(str) {
	            if (o.debug && typeof console !== "undefined") console.log(str);
	        },
	        error: function(str) {
	            if (typeof console !== "undefined") console.error(str);
	        },
	        getCountyIndexOfLng: function(lng) {
	            var lng_index = 0;
	            if (lng === 'nb-NO' || lng === 'nn-NO' || lng === 'nb-no' || lng === 'nn-no') lng_index = 1;
	            return lng_index;
	        },
	        toLanguages: function(lng, fallbackLng) {
	            var log = this.log;
	    
	            fallbackLng = fallbackLng || o.fallbackLng;
	            if (typeof fallbackLng === 'string')
	                fallbackLng = [fallbackLng];
	    
	            function applyCase(l) {
	                var ret = l;
	    
	                if (typeof l === 'string' && l.indexOf('-') > -1) {
	                    var parts = l.split('-');
	    
	                    ret = o.lowerCaseLng ?
	                        parts[0].toLowerCase() +  '-' + parts[1].toLowerCase() :
	                        parts[0].toLowerCase() +  '-' + parts[1].toUpperCase();
	                } else {
	                    ret = o.lowerCaseLng ? l.toLowerCase() : l;
	                }
	    
	                return ret;
	            }
	    
	            var languages = [];
	            var whitelist = o.lngWhitelist || false;
	            var addLanguage = function(language){
	              //reject langs not whitelisted
	              if(!whitelist || whitelist.indexOf(language) > -1){
	                languages.push(language);
	              }else{
	                log('rejecting non-whitelisted language: ' + language);
	              }
	            };
	            if (typeof lng === 'string' && lng.indexOf('-') > -1) {
	                var parts = lng.split('-');
	    
	                if (o.load !== 'unspecific') addLanguage(applyCase(lng));
	                if (o.load !== 'current') addLanguage(applyCase(parts[this.getCountyIndexOfLng(lng)]));
	            } else {
	                addLanguage(applyCase(lng));
	            }
	    
	            for (var i = 0; i < fallbackLng.length; i++) {
	                if (languages.indexOf(fallbackLng[i]) === -1 && fallbackLng[i]) languages.push(applyCase(fallbackLng[i]));
	            }
	            return languages;
	        },
	        regexEscape: function(str) {
	            return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
	        },
	        regexReplacementEscape: function(strOrFn) {
	            if (typeof strOrFn === 'string') {
	                return strOrFn.replace(/\$/g, "$$$$");
	            } else {
	                return strOrFn;
	            }
	        },
	        localStorage: {
	            setItem: function(key, value) {
	                if (window.localStorage) {
	                    try {
	                        window.localStorage.setItem(key, value);
	                    } catch (e) {
	                        f.log('failed to set value for key "' + key + '" to localStorage.');
	                    }
	                }
	            },
	            getItem: function(key, value) {
	                if (window.localStorage) {
	                    try {
	                        return window.localStorage.getItem(key, value);
	                    } catch (e) {
	                        f.log('failed to get value for key "' + key + '" from localStorage.');
	                        return undefined;
	                    }
	                }
	            }
	        }
	    };
	    function init(options, cb) {
	    
	        if (typeof options === 'function') {
	            cb = options;
	            options = {};
	        }
	        options = options || {};
	    
	        // override defaults with passed in options
	        f.extend(o, options);
	        delete o.fixLng; /* passed in each time */
	    
	        // override functions: .log(), .detectLanguage(), etc
	        if (o.functions) {
	            delete o.functions;
	            f.extend(f, options.functions);
	        }
	    
	        // create namespace object if namespace is passed in as string
	        if (typeof o.ns == 'string') {
	            o.ns = { namespaces: [o.ns], defaultNs: o.ns};
	        }
	    
	        // fallback namespaces
	        if (typeof o.fallbackNS == 'string') {
	            o.fallbackNS = [o.fallbackNS];
	        }
	    
	        // fallback languages
	        if (typeof o.fallbackLng == 'string' || typeof o.fallbackLng == 'boolean') {
	            o.fallbackLng = [o.fallbackLng];
	        }
	    
	        // escape prefix/suffix
	        o.interpolationPrefixEscaped = f.regexEscape(o.interpolationPrefix);
	        o.interpolationSuffixEscaped = f.regexEscape(o.interpolationSuffix);
	    
	        if (!o.lng) o.lng = f.detectLanguage();
	    
	        languages = f.toLanguages(o.lng);
	        currentLng = languages[0];
	        f.log('currentLng set to: ' + currentLng);
	    
	        if (o.useCookie && f.cookie.read(o.cookieName) !== currentLng){ //cookie is unset or invalid
	            f.cookie.create(o.cookieName, currentLng, o.cookieExpirationTime, o.cookieDomain);
	        }
	        if (o.detectLngFromLocalStorage && typeof document !== 'undefined' && window.localStorage) {
	            f.localStorage.setItem('i18next_lng', currentLng);
	        }
	    
	        var lngTranslate = translate;
	        if (options.fixLng) {
	            lngTranslate = function(key, options) {
	                options = options || {};
	                options.lng = options.lng || lngTranslate.lng;
	                return translate(key, options);
	            };
	            lngTranslate.lng = currentLng;
	        }
	    
	        pluralExtensions.setCurrentLng(currentLng);
	    
	        // add JQuery extensions
	        if ($ && o.setJqueryExt) {
	            addJqueryFunct && addJqueryFunct();
	        } else {
	           addJqueryLikeFunctionality && addJqueryLikeFunctionality();
	        }
	    
	        // jQuery deferred
	        var deferred;
	        if ($ && $.Deferred) {
	            deferred = $.Deferred();
	        }
	    
	        // return immidiatly if res are passed in
	        if (o.resStore) {
	            resStore = o.resStore;
	            initialized = true;
	            if (cb) cb(lngTranslate);
	            if (deferred) deferred.resolve(lngTranslate);
	            if (deferred) return deferred.promise();
	            return;
	        }
	    
	        // languages to load
	        var lngsToLoad = f.toLanguages(o.lng);
	        if (typeof o.preload === 'string') o.preload = [o.preload];
	        for (var i = 0, l = o.preload.length; i < l; i++) {
	            var pres = f.toLanguages(o.preload[i]);
	            for (var y = 0, len = pres.length; y < len; y++) {
	                if (lngsToLoad.indexOf(pres[y]) < 0) {
	                    lngsToLoad.push(pres[y]);
	                }
	            }
	        }
	    
	        // else load them
	        i18n.sync.load(lngsToLoad, o, function(err, store) {
	            resStore = store;
	            initialized = true;
	    
	            if (cb) cb(err, lngTranslate);
	            if (deferred) (!err ? deferred.resolve : deferred.reject)(err || lngTranslate);
	        });
	    
	        if (deferred) return deferred.promise();
	    }
	    
	    function isInitialized() {
	        return initialized;
	    }
	    function preload(lngs, cb) {
	        if (typeof lngs === 'string') lngs = [lngs];
	        for (var i = 0, l = lngs.length; i < l; i++) {
	            if (o.preload.indexOf(lngs[i]) < 0) {
	                o.preload.push(lngs[i]);
	            }
	        }
	        return init(cb);
	    }
	    
	    function addResourceBundle(lng, ns, resources, deep) {
	        if (typeof ns !== 'string') {
	            resources = ns;
	            ns = o.ns.defaultNs;
	        } else if (o.ns.namespaces.indexOf(ns) < 0) {
	            o.ns.namespaces.push(ns);
	        }
	    
	        resStore[lng] = resStore[lng] || {};
	        resStore[lng][ns] = resStore[lng][ns] || {};
	    
	        if (deep) {
	            f.deepExtend(resStore[lng][ns], resources);
	        } else {
	            f.extend(resStore[lng][ns], resources);
	        }
	        if (o.useLocalStorage) {
	            sync._storeLocal(resStore);
	        }
	    }
	    
	    function hasResourceBundle(lng, ns) {
	        if (typeof ns !== 'string') {
	            ns = o.ns.defaultNs;
	        }
	    
	        resStore[lng] = resStore[lng] || {};
	        var res = resStore[lng][ns] || {};
	    
	        var hasValues = false;
	        for(var prop in res) {
	            if (res.hasOwnProperty(prop)) {
	                hasValues = true;
	            }
	        }
	    
	        return hasValues;
	    }
	    
	    function getResourceBundle(lng, ns) {
	        if (typeof ns !== 'string') {
	            ns = o.ns.defaultNs;
	        }
	    
	        resStore[lng] = resStore[lng] || {};
	        return f.extend({}, resStore[lng][ns]);
	    }
	    
	    function removeResourceBundle(lng, ns) {
	        if (typeof ns !== 'string') {
	            ns = o.ns.defaultNs;
	        }
	    
	        resStore[lng] = resStore[lng] || {};
	        resStore[lng][ns] = {};
	        if (o.useLocalStorage) {
	            sync._storeLocal(resStore);
	        }
	    }
	    
	    function addResource(lng, ns, key, value) {
	        if (typeof ns !== 'string') {
	            resource = ns;
	            ns = o.ns.defaultNs;
	        } else if (o.ns.namespaces.indexOf(ns) < 0) {
	            o.ns.namespaces.push(ns);
	        }
	    
	        resStore[lng] = resStore[lng] || {};
	        resStore[lng][ns] = resStore[lng][ns] || {};
	    
	        var keys = key.split(o.keyseparator);
	        var x = 0;
	        var node = resStore[lng][ns];
	        var origRef = node;
	    
	        while (keys[x]) {
	            if (x == keys.length - 1)
	                node[keys[x]] = value;
	            else {
	                if (node[keys[x]] == null)
	                    node[keys[x]] = {};
	    
	                node = node[keys[x]];
	            }
	            x++;
	        }
	        if (o.useLocalStorage) {
	            sync._storeLocal(resStore);
	        }
	    }
	    
	    function addResources(lng, ns, resources) {
	        if (typeof ns !== 'string') {
	            resource = ns;
	            ns = o.ns.defaultNs;
	        } else if (o.ns.namespaces.indexOf(ns) < 0) {
	            o.ns.namespaces.push(ns);
	        }
	    
	        for (var m in resources) {
	            if (typeof resources[m] === 'string') addResource(lng, ns, m, resources[m]);
	        }
	    }
	    
	    function setDefaultNamespace(ns) {
	        o.ns.defaultNs = ns;
	    }
	    
	    function loadNamespace(namespace, cb) {
	        loadNamespaces([namespace], cb);
	    }
	    
	    function loadNamespaces(namespaces, cb) {
	        var opts = {
	            dynamicLoad: o.dynamicLoad,
	            resGetPath: o.resGetPath,
	            getAsync: o.getAsync,
	            customLoad: o.customLoad,
	            ns: { namespaces: namespaces, defaultNs: ''} /* new namespaces to load */
	        };
	    
	        // languages to load
	        var lngsToLoad = f.toLanguages(o.lng);
	        if (typeof o.preload === 'string') o.preload = [o.preload];
	        for (var i = 0, l = o.preload.length; i < l; i++) {
	            var pres = f.toLanguages(o.preload[i]);
	            for (var y = 0, len = pres.length; y < len; y++) {
	                if (lngsToLoad.indexOf(pres[y]) < 0) {
	                    lngsToLoad.push(pres[y]);
	                }
	            }
	        }
	    
	        // check if we have to load
	        var lngNeedLoad = [];
	        for (var a = 0, lenA = lngsToLoad.length; a < lenA; a++) {
	            var needLoad = false;
	            var resSet = resStore[lngsToLoad[a]];
	            if (resSet) {
	                for (var b = 0, lenB = namespaces.length; b < lenB; b++) {
	                    if (!resSet[namespaces[b]]) needLoad = true;
	                }
	            } else {
	                needLoad = true;
	            }
	    
	            if (needLoad) lngNeedLoad.push(lngsToLoad[a]);
	        }
	    
	        if (lngNeedLoad.length) {
	            i18n.sync._fetch(lngNeedLoad, opts, function(err, store) {
	                var todo = namespaces.length * lngNeedLoad.length;
	    
	                // load each file individual
	                f.each(namespaces, function(nsIndex, nsValue) {
	    
	                    // append namespace to namespace array
	                    if (o.ns.namespaces.indexOf(nsValue) < 0) {
	                        o.ns.namespaces.push(nsValue);
	                    }
	    
	                    f.each(lngNeedLoad, function(lngIndex, lngValue) {
	                        resStore[lngValue] = resStore[lngValue] || {};
	                        resStore[lngValue][nsValue] = store[lngValue][nsValue];
	    
	                        todo--; // wait for all done befor callback
	                        if (todo === 0 && cb) {
	                            if (o.useLocalStorage) i18n.sync._storeLocal(resStore);
	                            cb();
	                        }
	                    });
	                });
	            });
	        } else {
	            if (cb) cb();
	        }
	    }
	    
	    function setLng(lng, options, cb) {
	        if (typeof options === 'function') {
	            cb = options;
	            options = {};
	        } else if (!options) {
	            options = {};
	        }
	    
	        options.lng = lng;
	        return init(options, cb);
	    }
	    
	    function lng() {
	        return currentLng;
	    }
	    
	    function reload(cb) {
	        resStore = {};
	        setLng(currentLng, cb);
	    }
	    
	    function noConflict() {
	        
	        window.i18next = window.i18n;
	    
	        if (conflictReference) {
	            window.i18n = conflictReference;
	        } else {
	            delete window.i18n;
	        }
	    }
	    function addJqueryFunct() {
	        // $.t shortcut
	        $.t = $.t || translate;
	    
	        function parse(ele, key, options) {
	            if (key.length === 0) return;
	    
	            var attr = 'text';
	    
	            if (key.indexOf('[') === 0) {
	                var parts = key.split(']');
	                key = parts[1];
	                attr = parts[0].substr(1, parts[0].length-1);
	            }
	    
	            if (key.indexOf(';') === key.length-1) {
	                key = key.substr(0, key.length-2);
	            }
	    
	            var optionsToUse;
	            if (attr === 'html') {
	                optionsToUse = o.defaultValueFromContent ? $.extend({ defaultValue: ele.html() }, options) : options;
	                ele.html($.t(key, optionsToUse));
	            } else if (attr === 'text') {
	                optionsToUse = o.defaultValueFromContent ? $.extend({ defaultValue: ele.text() }, options) : options;
	                ele.text($.t(key, optionsToUse));
	            } else if (attr === 'prepend') {
	                optionsToUse = o.defaultValueFromContent ? $.extend({ defaultValue: ele.html() }, options) : options;
	                ele.prepend($.t(key, optionsToUse));
	            } else if (attr === 'append') {
	                optionsToUse = o.defaultValueFromContent ? $.extend({ defaultValue: ele.html() }, options) : options;
	                ele.append($.t(key, optionsToUse));
	            } else if (attr.indexOf("data-") === 0) {
	                var dataAttr = attr.substr(("data-").length);
	                optionsToUse = o.defaultValueFromContent ? $.extend({ defaultValue: ele.data(dataAttr) }, options) : options;
	                var translated = $.t(key, optionsToUse);
	                //we change into the data cache
	                ele.data(dataAttr, translated);
	                //we change into the dom
	                ele.attr(attr, translated);
	            } else {
	                optionsToUse = o.defaultValueFromContent ? $.extend({ defaultValue: ele.attr(attr) }, options) : options;
	                ele.attr(attr, $.t(key, optionsToUse));
	            }
	        }
	    
	        function localize(ele, options) {
	            var key = ele.attr(o.selectorAttr);
	            if (!key && typeof key !== 'undefined' && key !== false) key = ele.text() || ele.val();
	            if (!key) return;
	    
	            var target = ele
	              , targetSelector = ele.data("i18n-target");
	            if (targetSelector) {
	                target = ele.find(targetSelector) || ele;
	            }
	    
	            if (!options && o.useDataAttrOptions === true) {
	                options = ele.data("i18n-options");
	            }
	            options = options || {};
	    
	            if (key.indexOf(';') >= 0) {
	                var keys = key.split(';');
	    
	                $.each(keys, function(m, k) {
	                    if (k !== '') parse(target, k, options);
	                });
	    
	            } else {
	                parse(target, key, options);
	            }
	    
	            if (o.useDataAttrOptions === true) ele.data("i18n-options", options);
	        }
	    
	        // fn
	        $.fn.i18n = function (options) {
	            return this.each(function() {
	                // localize element itself
	                localize($(this), options);
	    
	                // localize childs
	                var elements =  $(this).find('[' + o.selectorAttr + ']');
	                elements.each(function() { 
	                    localize($(this), options);
	                });
	            });
	        };
	    }
	    function addJqueryLikeFunctionality() {
	    
	        function parse(ele, key, options) {
	            if (key.length === 0) return;
	    
	            var attr = 'text';
	    
	            if (key.indexOf('[') === 0) {
	                var parts = key.split(']');
	                key = parts[1];
	                attr = parts[0].substr(1, parts[0].length-1);
	            }
	    
	            if (key.indexOf(';') === key.length-1) {
	                key = key.substr(0, key.length-2);
	            }
	    
	            if (attr === 'html') {
	                ele.innerHTML = translate(key, options);
	            } else if (attr === 'text') {
	                ele.textContent = translate(key, options);
	            } else if (attr === 'prepend') {
	                ele.insertAdjacentHTML(translate(key, options), 'afterbegin');
	            } else if (attr === 'append') {
	                ele.insertAdjacentHTML(translate(key, options), 'beforeend');
	            } else {
	                ele.setAttribute(attr, translate(key, options));
	            }
	        }
	    
	        function localize(ele, options) {
	            var key = ele.getAttribute(o.selectorAttr);
	            if (!key && typeof key !== 'undefined' && key !== false) key = ele.textContent || ele.value;
	            if (!key) return;
	    
	            var target = ele
	              , targetSelector = ele.getAttribute("i18n-target");
	            if (targetSelector) {
	                target = ele.querySelector(targetSelector) || ele;
	            }
	            
	            if (key.indexOf(';') >= 0) {
	                var keys = key.split(';'), index = 0, length = keys.length;
	                
	                for ( ; index < length; index++) {
	                    if (keys[index] !== '') parse(target, keys[index], options);
	                }
	    
	            } else {
	                parse(target, key, options);
	            }
	        }
	    
	        // fn
	        i18n.translateObject = function (object, options) {
	            // localize childs
	            var elements =  object.querySelectorAll('[' + o.selectorAttr + ']');
	            var index = 0, length = elements.length;
	            for ( ; index < length; index++) {
	                localize(elements[index], options);
	            }
	        };
	    }
	    function applyReplacement(str, replacementHash, nestedKey, options) {
	        if (!str) return str;
	    
	        options = options || replacementHash; // first call uses replacement hash combined with options
	        if (str.indexOf(options.interpolationPrefix || o.interpolationPrefix) < 0) return str;
	    
	        var prefix = options.interpolationPrefix ? f.regexEscape(options.interpolationPrefix) : o.interpolationPrefixEscaped
	          , suffix = options.interpolationSuffix ? f.regexEscape(options.interpolationSuffix) : o.interpolationSuffixEscaped
	          , unEscapingSuffix = 'HTML'+suffix;
	    
	        var hash = replacementHash.replace && typeof replacementHash.replace === 'object' ? replacementHash.replace : replacementHash;
	        f.each(hash, function(key, value) {
	            var nextKey = nestedKey ? nestedKey + o.keyseparator + key : key;
	            if (typeof value === 'object' && value !== null) {
	                str = applyReplacement(str, value, nextKey, options);
	            } else {
	                if (options.escapeInterpolation || o.escapeInterpolation) {
	                    str = str.replace(new RegExp([prefix, nextKey, unEscapingSuffix].join(''), 'g'), f.regexReplacementEscape(value));
	                    str = str.replace(new RegExp([prefix, nextKey, suffix].join(''), 'g'), f.regexReplacementEscape(f.escape(value)));
	                } else {
	                    str = str.replace(new RegExp([prefix, nextKey, suffix].join(''), 'g'), f.regexReplacementEscape(value));
	                }
	                // str = options.escapeInterpolation;
	            }
	        });
	        return str;
	    }
	    
	    // append it to functions
	    f.applyReplacement = applyReplacement;
	    
	    function applyReuse(translated, options) {
	        var comma = ',';
	        var options_open = '{';
	        var options_close = '}';
	    
	        var opts = f.extend({}, options);
	        delete opts.postProcess;
	    
	        while (translated.indexOf(o.reusePrefix) != -1) {
	            replacementCounter++;
	            if (replacementCounter > o.maxRecursion) { break; } // safety net for too much recursion
	            var index_of_opening = translated.lastIndexOf(o.reusePrefix);
	            var index_of_end_of_closing = translated.indexOf(o.reuseSuffix, index_of_opening) + o.reuseSuffix.length;
	            var token = translated.substring(index_of_opening, index_of_end_of_closing);
	            var token_without_symbols = token.replace(o.reusePrefix, '').replace(o.reuseSuffix, '');
	    
	            if (index_of_end_of_closing <= index_of_opening) {
	                f.error('there is an missing closing in following translation value', translated);
	                return '';
	            }
	    
	            if (token_without_symbols.indexOf(comma) != -1) {
	                var index_of_token_end_of_closing = token_without_symbols.indexOf(comma);
	                if (token_without_symbols.indexOf(options_open, index_of_token_end_of_closing) != -1 && token_without_symbols.indexOf(options_close, index_of_token_end_of_closing) != -1) {
	                    var index_of_opts_opening = token_without_symbols.indexOf(options_open, index_of_token_end_of_closing);
	                    var index_of_opts_end_of_closing = token_without_symbols.indexOf(options_close, index_of_opts_opening) + options_close.length;
	                    try {
	                        opts = f.extend(opts, JSON.parse(token_without_symbols.substring(index_of_opts_opening, index_of_opts_end_of_closing)));
	                        token_without_symbols = token_without_symbols.substring(0, index_of_token_end_of_closing);
	                    } catch (e) {
	                    }
	                }
	            }
	    
	            var translated_token = _translate(token_without_symbols, opts);
	            translated = translated.replace(token, f.regexReplacementEscape(translated_token));
	        }
	        return translated;
	    }
	    
	    function hasContext(options) {
	        return (options.context && (typeof options.context == 'string' || typeof options.context == 'number'));
	    }
	    
	    function needsPlural(options, lng) {
	        return (options.count !== undefined && typeof options.count != 'string'/* && pluralExtensions.needsPlural(lng, options.count)*/);
	    }
	    
	    function needsIndefiniteArticle(options) {
	        return (options.indefinite_article !== undefined && typeof options.indefinite_article != 'string' && options.indefinite_article);
	    }
	    
	    function exists(key, options) {
	        options = options || {};
	    
	        var notFound = _getDefaultValue(key, options)
	            , found = _find(key, options);
	    
	        return found !== undefined || found === notFound;
	    }
	    
	    function translate(key, options) {
	        options = options || {};
	    
	        if (!initialized) {
	            f.log('i18next not finished initialization. you might have called t function before loading resources finished.')
	            return options.defaultValue || '';
	        };
	        replacementCounter = 0;
	        return _translate.apply(null, arguments);
	    }
	    
	    function _getDefaultValue(key, options) {
	        return (options.defaultValue !== undefined) ? options.defaultValue : key;
	    }
	    
	    function _injectSprintfProcessor() {
	    
	        var values = [];
	    
	        // mh: build array from second argument onwards
	        for (var i = 1; i < arguments.length; i++) {
	            values.push(arguments[i]);
	        }
	    
	        return {
	            postProcess: 'sprintf',
	            sprintf:     values
	        };
	    }
	    
	    function _translate(potentialKeys, options) {
	        if (options && typeof options !== 'object') {
	            if (o.shortcutFunction === 'sprintf') {
	                // mh: gettext like sprintf syntax found, automatically create sprintf processor
	                options = _injectSprintfProcessor.apply(null, arguments);
	            } else if (o.shortcutFunction === 'defaultValue') {
	                options = {
	                    defaultValue: options
	                }
	            }
	        } else {
	            options = options || {};
	        }
	    
	        if (typeof o.defaultVariables === 'object') {
	            options = f.extend({}, o.defaultVariables, options);
	        }
	    
	        if (potentialKeys === undefined || potentialKeys === null || potentialKeys === '') return '';
	    
	        if (typeof potentialKeys === 'number') {
	            potentialKeys = String(potentialKeys);
	        }
	    
	        if (typeof potentialKeys === 'string') {
	            potentialKeys = [potentialKeys];
	        }
	    
	        var key = potentialKeys[0];
	    
	        if (potentialKeys.length > 1) {
	            for (var i = 0; i < potentialKeys.length; i++) {
	                key = potentialKeys[i];
	                if (exists(key, options)) {
	                    break;
	                }
	            }
	        }
	    
	        var notFound = _getDefaultValue(key, options)
	            , found = _find(key, options)
	            , lngs = options.lng ? f.toLanguages(options.lng, options.fallbackLng) : languages
	            , ns = options.ns || o.ns.defaultNs
	            , parts;
	    
	        // split ns and key
	        if (key.indexOf(o.nsseparator) > -1) {
	            parts = key.split(o.nsseparator);
	            ns = parts[0];
	            key = parts[1];
	        }
	    
	        if (found === undefined && o.sendMissing && typeof o.missingKeyHandler === 'function') {
	            if (options.lng) {
	                o.missingKeyHandler(lngs[0], ns, key, notFound, lngs);
	            } else {
	                o.missingKeyHandler(o.lng, ns, key, notFound, lngs);
	            }
	        }
	    
	        var postProcessorsToApply;
	        if (typeof o.postProcess === 'string' && o.postProcess !== '') {
	            postProcessorsToApply = [o.postProcess];
	        } else if (typeof o.postProcess === 'array' || typeof o.postProcess === 'object') {
	            postProcessorsToApply = o.postProcess;
	        } else {
	            postProcessorsToApply = [];
	        }
	    
	        if (typeof options.postProcess === 'string' && options.postProcess !== '') {
	            postProcessorsToApply = postProcessorsToApply.concat([options.postProcess]);
	        } else if (typeof options.postProcess === 'array' || typeof options.postProcess === 'object') {
	            postProcessorsToApply = postProcessorsToApply.concat(options.postProcess);
	        }
	    
	        if (found !== undefined && postProcessorsToApply.length) {
	            postProcessorsToApply.forEach(function(postProcessor) {
	                if (postProcessors[postProcessor]) {
	                    found = postProcessors[postProcessor](found, key, options);
	                }
	            });
	        }
	    
	        // process notFound if function exists
	        var splitNotFound = notFound;
	        if (notFound.indexOf(o.nsseparator) > -1) {
	            parts = notFound.split(o.nsseparator);
	            splitNotFound = parts[1];
	        }
	        if (splitNotFound === key && o.parseMissingKey) {
	            notFound = o.parseMissingKey(notFound);
	        }
	    
	        if (found === undefined) {
	            notFound = applyReplacement(notFound, options);
	            notFound = applyReuse(notFound, options);
	    
	            if (postProcessorsToApply.length) {
	                var val = _getDefaultValue(key, options);
	                postProcessorsToApply.forEach(function(postProcessor) {
	                    if (postProcessors[postProcessor]) {
	                        found = postProcessors[postProcessor](val, key, options);
	                    }
	                });
	            }
	        }
	    
	        return (found !== undefined) ? found : notFound;
	    }
	    
	    function _find(key, options) {
	        options = options || {};
	    
	        var optionWithoutCount, translated
	            , notFound = _getDefaultValue(key, options)
	            , lngs = languages;
	    
	        if (!resStore) { return notFound; } // no resStore to translate from
	    
	        // CI mode
	        if (lngs[0].toLowerCase() === 'cimode') return notFound;
	    
	        // passed in lng
	        if (options.lngs) lngs = options.lngs;
	        if (options.lng) {
	            lngs = f.toLanguages(options.lng, options.fallbackLng);
	    
	            if (!resStore[lngs[0]]) {
	                var oldAsync = o.getAsync;
	                o.getAsync = false;
	    
	                i18n.sync.load(lngs, o, function(err, store) {
	                    f.extend(resStore, store);
	                    o.getAsync = oldAsync;
	                });
	            }
	        }
	    
	        var ns = options.ns || o.ns.defaultNs;
	        if (key.indexOf(o.nsseparator) > -1) {
	            var parts = key.split(o.nsseparator);
	            ns = parts[0];
	            key = parts[1];
	        }
	    
	        if (hasContext(options)) {
	            optionWithoutCount = f.extend({}, options);
	            delete optionWithoutCount.context;
	            optionWithoutCount.defaultValue = o.contextNotFound;
	    
	            var contextKey = ns + o.nsseparator + key + '_' + options.context;
	    
	            translated = translate(contextKey, optionWithoutCount);
	            if (translated != o.contextNotFound) {
	                return applyReplacement(translated, { context: options.context }); // apply replacement for context only
	            } // else continue translation with original/nonContext key
	        }
	    
	        if (needsPlural(options, lngs[0])) {
	            optionWithoutCount = f.extend({ lngs: [lngs[0]]}, options);
	            delete optionWithoutCount.count;
	            optionWithoutCount._origLng = optionWithoutCount._origLng || optionWithoutCount.lng || lngs[0];
	            delete optionWithoutCount.lng;
	            optionWithoutCount.defaultValue = o.pluralNotFound;
	    
	            var pluralKey;
	            if (!pluralExtensions.needsPlural(lngs[0], options.count)) {
	                pluralKey = ns + o.nsseparator + key;
	            } else {
	                pluralKey = ns + o.nsseparator + key + o.pluralSuffix;
	                var pluralExtension = pluralExtensions.get(lngs[0], options.count);
	                if (pluralExtension >= 0) {
	                    pluralKey = pluralKey + '_' + pluralExtension;
	                } else if (pluralExtension === 1) {
	                    pluralKey = ns + o.nsseparator + key; // singular
	                }
	            }
	    
	            translated = translate(pluralKey, optionWithoutCount);
	    
	            if (translated != o.pluralNotFound) {
	                return applyReplacement(translated, {
	                    count: options.count,
	                    interpolationPrefix: options.interpolationPrefix,
	                    interpolationSuffix: options.interpolationSuffix
	                }); // apply replacement for count only
	            } else if (lngs.length > 1) {
	                // remove failed lng
	                var clone = lngs.slice();
	                clone.shift();
	                options = f.extend(options, { lngs: clone });
	                options._origLng = optionWithoutCount._origLng;
	                delete options.lng;
	                // retry with fallbacks
	                translated = translate(ns + o.nsseparator + key, options);
	                if (translated != o.pluralNotFound) return translated;
	            } else {
	                optionWithoutCount.lng = optionWithoutCount._origLng;
	                delete optionWithoutCount._origLng;
	                translated = translate(ns + o.nsseparator + key, optionWithoutCount);
	    
	                return applyReplacement(translated, {
	                    count: options.count,
	                    interpolationPrefix: options.interpolationPrefix,
	                    interpolationSuffix: options.interpolationSuffix
	                });
	            }
	        }
	    
	        if (needsIndefiniteArticle(options)) {
	            var optionsWithoutIndef = f.extend({}, options);
	            delete optionsWithoutIndef.indefinite_article;
	            optionsWithoutIndef.defaultValue = o.indefiniteNotFound;
	            // If we don't have a count, we want the indefinite, if we do have a count, and needsPlural is false
	            var indefiniteKey = ns + o.nsseparator + key + (((options.count && !needsPlural(options, lngs[0])) || !options.count) ? o.indefiniteSuffix : "");
	            translated = translate(indefiniteKey, optionsWithoutIndef);
	            if (translated != o.indefiniteNotFound) {
	                return translated;
	            }
	        }
	    
	        var found;
	        var keys = key.split(o.keyseparator);
	        for (var i = 0, len = lngs.length; i < len; i++ ) {
	            if (found !== undefined) break;
	    
	            var l = lngs[i];
	    
	            var x = 0;
	            var value = resStore[l] && resStore[l][ns];
	            while (keys[x]) {
	                value = value && value[keys[x]];
	                x++;
	            }
	            if (value !== undefined && (!o.showKeyIfEmpty || value !== '')) {
	                var valueType = Object.prototype.toString.apply(value);
	                if (typeof value === 'string') {
	                    value = applyReplacement(value, options);
	                    value = applyReuse(value, options);
	                } else if (valueType === '[object Array]' && !o.returnObjectTrees && !options.returnObjectTrees) {
	                    value = value.join('\n');
	                    value = applyReplacement(value, options);
	                    value = applyReuse(value, options);
	                } else if (value === null && o.fallbackOnNull === true) {
	                    value = undefined;
	                } else if (value !== null) {
	                    if (!o.returnObjectTrees && !options.returnObjectTrees) {
	                        if (o.objectTreeKeyHandler && typeof o.objectTreeKeyHandler == 'function') {
	                            value = o.objectTreeKeyHandler(key, value, l, ns, options);
	                        } else {
	                            value = 'key \'' + ns + ':' + key + ' (' + l + ')\' ' +
	                                'returned an object instead of string.';
	                            f.log(value);
	                        }
	                    } else if (valueType !== '[object Number]' && valueType !== '[object Function]' && valueType !== '[object RegExp]') {
	                        var copy = (valueType === '[object Array]') ? [] : {}; // apply child translation on a copy
	                        f.each(value, function(m) {
	                            copy[m] = _translate(ns + o.nsseparator + key + o.keyseparator + m, options);
	                        });
	                        value = copy;
	                    }
	                }
	    
	                if (typeof value === 'string' && value.trim() === '' && o.fallbackOnEmpty === true)
	                    value = undefined;
	    
	                found = value;
	            }
	        }
	    
	        if (found === undefined && !options.isFallbackLookup && (o.fallbackToDefaultNS === true || (o.fallbackNS && o.fallbackNS.length > 0))) {
	            // set flag for fallback lookup - avoid recursion
	            options.isFallbackLookup = true;
	    
	            if (o.fallbackNS.length) {
	    
	                for (var y = 0, lenY = o.fallbackNS.length; y < lenY; y++) {
	                    found = _find(o.fallbackNS[y] + o.nsseparator + key, options);
	    
	                    if (found || (found==="" && o.fallbackOnEmpty === false)) {
	                        /* compare value without namespace */
	                        var foundValue = found.indexOf(o.nsseparator) > -1 ? found.split(o.nsseparator)[1] : found
	                          , notFoundValue = notFound.indexOf(o.nsseparator) > -1 ? notFound.split(o.nsseparator)[1] : notFound;
	    
	                        if (foundValue !== notFoundValue) break;
	                    }
	                }
	            } else {
	                options.ns = o.ns.defaultNs;
	                found = _find(key, options); // fallback to default NS
	            }
	            options.isFallbackLookup = false;
	        }
	    
	        return found;
	    }
	    function detectLanguage() {
	        var detectedLng;
	        var whitelist = o.lngWhitelist || [];
	        var userLngChoices = [];
	    
	        // get from qs
	        var qsParm = [];
	        if (typeof window !== 'undefined') {
	            (function() {
	                var query = window.location.search.substring(1);
	                var params = query.split('&');
	                for (var i=0; i<params.length; i++) {
	                    var pos = params[i].indexOf('=');
	                    if (pos > 0) {
	                        var key = params[i].substring(0,pos);
	                        if (key == o.detectLngQS) {
	                            userLngChoices.push(params[i].substring(pos+1));
	                        }
	                    }
	                }
	            })();
	        }
	    
	        // get from cookie
	        if (o.useCookie && typeof document !== 'undefined') {
	            var c = f.cookie.read(o.cookieName);
	            if (c) userLngChoices.push(c);
	        }
	    
	        // get from localStorage
	        if (o.detectLngFromLocalStorage && typeof window !== 'undefined' && window.localStorage) {
	            var lang = f.localStorage.getItem('i18next_lng');
	            if (lang) {
	                userLngChoices.push(lang);
	            }
	        }
	    
	        // get from navigator
	        if (typeof navigator !== 'undefined') {
	            if (navigator.languages) { // chrome only; not an array, so can't use .push.apply instead of iterating
	                for (var i=0;i<navigator.languages.length;i++) {
	                    userLngChoices.push(navigator.languages[i]);
	                }
	            }
	            if (navigator.userLanguage) {
	                userLngChoices.push(navigator.userLanguage);
	            }
	            if (navigator.language) {
	                userLngChoices.push(navigator.language);
	            }
	        }
	    
	        (function() {
	            for (var i=0;i<userLngChoices.length;i++) {
	                var lng = userLngChoices[i];
	    
	                if (lng.indexOf('-') > -1) {
	                    var parts = lng.split('-');
	                    lng = o.lowerCaseLng ?
	                        parts[0].toLowerCase() +  '-' + parts[1].toLowerCase() :
	                        parts[0].toLowerCase() +  '-' + parts[1].toUpperCase();
	                }
	    
	                if (whitelist.length === 0 || whitelist.indexOf(lng) > -1) {
	                    detectedLng = lng;
	                    break;
	                }
	            }
	        })();
	    
	        //fallback
	        if (!detectedLng){
	          detectedLng = o.fallbackLng[0];
	        }
	        
	        return detectedLng;
	    }
	    // definition http://translate.sourceforge.net/wiki/l10n/pluralforms
	    
	    /* [code, name, numbers, pluralsType] */
	    var _rules = [
	        ["ach", "Acholi", [1,2], 1],
	        ["af", "Afrikaans",[1,2], 2],
	        ["ak", "Akan", [1,2], 1],
	        ["am", "Amharic", [1,2], 1],
	        ["an", "Aragonese",[1,2], 2],
	        ["ar", "Arabic", [0,1,2,3,11,100],5],
	        ["arn", "Mapudungun",[1,2], 1],
	        ["ast", "Asturian", [1,2], 2],
	        ["ay", "Aymará", [1], 3],
	        ["az", "Azerbaijani",[1,2],2],
	        ["be", "Belarusian",[1,2,5],4],
	        ["bg", "Bulgarian",[1,2], 2],
	        ["bn", "Bengali", [1,2], 2],
	        ["bo", "Tibetan", [1], 3],
	        ["br", "Breton", [1,2], 1],
	        ["bs", "Bosnian", [1,2,5],4],
	        ["ca", "Catalan", [1,2], 2],
	        ["cgg", "Chiga", [1], 3],
	        ["cs", "Czech", [1,2,5],6],
	        ["csb", "Kashubian",[1,2,5],7],
	        ["cy", "Welsh", [1,2,3,8],8],
	        ["da", "Danish", [1,2], 2],
	        ["de", "German", [1,2], 2],
	        ["dev", "Development Fallback", [1,2], 2],
	        ["dz", "Dzongkha", [1], 3],
	        ["el", "Greek", [1,2], 2],
	        ["en", "English", [1,2], 2],
	        ["eo", "Esperanto",[1,2], 2],
	        ["es", "Spanish", [1,2], 2],
	        ["es_ar","Argentinean Spanish", [1,2], 2],
	        ["et", "Estonian", [1,2], 2],
	        ["eu", "Basque", [1,2], 2],
	        ["fa", "Persian", [1], 3],
	        ["fi", "Finnish", [1,2], 2],
	        ["fil", "Filipino", [1,2], 1],
	        ["fo", "Faroese", [1,2], 2],
	        ["fr", "French", [1,2], 9],
	        ["fur", "Friulian", [1,2], 2],
	        ["fy", "Frisian", [1,2], 2],
	        ["ga", "Irish", [1,2,3,7,11],10],
	        ["gd", "Scottish Gaelic",[1,2,3,20],11],
	        ["gl", "Galician", [1,2], 2],
	        ["gu", "Gujarati", [1,2], 2],
	        ["gun", "Gun", [1,2], 1],
	        ["ha", "Hausa", [1,2], 2],
	        ["he", "Hebrew", [1,2], 2],
	        ["hi", "Hindi", [1,2], 2],
	        ["hr", "Croatian", [1,2,5],4],
	        ["hu", "Hungarian",[1,2], 2],
	        ["hy", "Armenian", [1,2], 2],
	        ["ia", "Interlingua",[1,2],2],
	        ["id", "Indonesian",[1], 3],
	        ["is", "Icelandic",[1,2], 12],
	        ["it", "Italian", [1,2], 2],
	        ["ja", "Japanese", [1], 3],
	        ["jbo", "Lojban", [1], 3],
	        ["jv", "Javanese", [0,1], 13],
	        ["ka", "Georgian", [1], 3],
	        ["kk", "Kazakh", [1], 3],
	        ["km", "Khmer", [1], 3],
	        ["kn", "Kannada", [1,2], 2],
	        ["ko", "Korean", [1], 3],
	        ["ku", "Kurdish", [1,2], 2],
	        ["kw", "Cornish", [1,2,3,4],14],
	        ["ky", "Kyrgyz", [1], 3],
	        ["lb", "Letzeburgesch",[1,2],2],
	        ["ln", "Lingala", [1,2], 1],
	        ["lo", "Lao", [1], 3],
	        ["lt", "Lithuanian",[1,2,10],15],
	        ["lv", "Latvian", [1,2,0],16],
	        ["mai", "Maithili", [1,2], 2],
	        ["mfe", "Mauritian Creole",[1,2],1],
	        ["mg", "Malagasy", [1,2], 1],
	        ["mi", "Maori", [1,2], 1],
	        ["mk", "Macedonian",[1,2],17],
	        ["ml", "Malayalam",[1,2], 2],
	        ["mn", "Mongolian",[1,2], 2],
	        ["mnk", "Mandinka", [0,1,2],18],
	        ["mr", "Marathi", [1,2], 2],
	        ["ms", "Malay", [1], 3],
	        ["mt", "Maltese", [1,2,11,20],19],
	        ["nah", "Nahuatl", [1,2], 2],
	        ["nap", "Neapolitan",[1,2], 2],
	        ["nb", "Norwegian Bokmal",[1,2],2],
	        ["ne", "Nepali", [1,2], 2],
	        ["nl", "Dutch", [1,2], 2],
	        ["nn", "Norwegian Nynorsk",[1,2],2],
	        ["no", "Norwegian",[1,2], 2],
	        ["nso", "Northern Sotho",[1,2],2],
	        ["oc", "Occitan", [1,2], 1],
	        ["or", "Oriya", [2,1], 2],
	        ["pa", "Punjabi", [1,2], 2],
	        ["pap", "Papiamento",[1,2], 2],
	        ["pl", "Polish", [1,2,5],7],
	        ["pms", "Piemontese",[1,2], 2],
	        ["ps", "Pashto", [1,2], 2],
	        ["pt", "Portuguese",[1,2], 2],
	        ["pt_br","Brazilian Portuguese",[1,2], 2],
	        ["rm", "Romansh", [1,2], 2],
	        ["ro", "Romanian", [1,2,20],20],
	        ["ru", "Russian", [1,2,5],4],
	        ["sah", "Yakut", [1], 3],
	        ["sco", "Scots", [1,2], 2],
	        ["se", "Northern Sami",[1,2], 2],
	        ["si", "Sinhala", [1,2], 2],
	        ["sk", "Slovak", [1,2,5],6],
	        ["sl", "Slovenian",[5,1,2,3],21],
	        ["so", "Somali", [1,2], 2],
	        ["son", "Songhay", [1,2], 2],
	        ["sq", "Albanian", [1,2], 2],
	        ["sr", "Serbian", [1,2,5],4],
	        ["su", "Sundanese",[1], 3],
	        ["sv", "Swedish", [1,2], 2],
	        ["sw", "Swahili", [1,2], 2],
	        ["ta", "Tamil", [1,2], 2],
	        ["te", "Telugu", [1,2], 2],
	        ["tg", "Tajik", [1,2], 1],
	        ["th", "Thai", [1], 3],
	        ["ti", "Tigrinya", [1,2], 1],
	        ["tk", "Turkmen", [1,2], 2],
	        ["tr", "Turkish", [1,2], 1],
	        ["tt", "Tatar", [1], 3],
	        ["ug", "Uyghur", [1], 3],
	        ["uk", "Ukrainian",[1,2,5],4],
	        ["ur", "Urdu", [1,2], 2],
	        ["uz", "Uzbek", [1,2], 1],
	        ["vi", "Vietnamese",[1], 3],
	        ["wa", "Walloon", [1,2], 1],
	        ["wo", "Wolof", [1], 3],
	        ["yo", "Yoruba", [1,2], 2],
	        ["zh", "Chinese", [1], 3]
	    ];
	    
	    var _rulesPluralsTypes = {
	        1: function(n) {return Number(n > 1);},
	        2: function(n) {return Number(n != 1);},
	        3: function(n) {return 0;},
	        4: function(n) {return Number(n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2);},
	        5: function(n) {return Number(n===0 ? 0 : n==1 ? 1 : n==2 ? 2 : n%100>=3 && n%100<=10 ? 3 : n%100>=11 ? 4 : 5);},
	        6: function(n) {return Number((n==1) ? 0 : (n>=2 && n<=4) ? 1 : 2);},
	        7: function(n) {return Number(n==1 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2);},
	        8: function(n) {return Number((n==1) ? 0 : (n==2) ? 1 : (n != 8 && n != 11) ? 2 : 3);},
	        9: function(n) {return Number(n >= 2);},
	        10: function(n) {return Number(n==1 ? 0 : n==2 ? 1 : n<7 ? 2 : n<11 ? 3 : 4) ;},
	        11: function(n) {return Number((n==1 || n==11) ? 0 : (n==2 || n==12) ? 1 : (n > 2 && n < 20) ? 2 : 3);},
	        12: function(n) {return Number(n%10!=1 || n%100==11);},
	        13: function(n) {return Number(n !== 0);},
	        14: function(n) {return Number((n==1) ? 0 : (n==2) ? 1 : (n == 3) ? 2 : 3);},
	        15: function(n) {return Number(n%10==1 && n%100!=11 ? 0 : n%10>=2 && (n%100<10 || n%100>=20) ? 1 : 2);},
	        16: function(n) {return Number(n%10==1 && n%100!=11 ? 0 : n !== 0 ? 1 : 2);},
	        17: function(n) {return Number(n==1 || n%10==1 ? 0 : 1);},
	        18: function(n) {return Number(0 ? 0 : n==1 ? 1 : 2);},
	        19: function(n) {return Number(n==1 ? 0 : n===0 || ( n%100>1 && n%100<11) ? 1 : (n%100>10 && n%100<20 ) ? 2 : 3);},
	        20: function(n) {return Number(n==1 ? 0 : (n===0 || (n%100 > 0 && n%100 < 20)) ? 1 : 2);},
	        21: function(n) {return Number(n%100==1 ? 1 : n%100==2 ? 2 : n%100==3 || n%100==4 ? 3 : 0); }
	    };
	    
	    var pluralExtensions = {
	    
	        rules: (function () {
	            var l, rules = {};
	            for (l=_rules.length; l-- ;) {
	                rules[_rules[l][0]] = {
	                    name: _rules[l][1],
	                    numbers: _rules[l][2],
	                    plurals: _rulesPluralsTypes[_rules[l][3]]
	                }
	            }
	            return rules;
	        }()),
	    
	        // you can add your own pluralExtensions
	        addRule: function(lng, obj) {
	            pluralExtensions.rules[lng] = obj;
	        },
	    
	        setCurrentLng: function(lng) {
	            if (!pluralExtensions.currentRule || pluralExtensions.currentRule.lng !== lng) {
	                var parts = lng.split('-');
	    
	                pluralExtensions.currentRule = {
	                    lng: lng,
	                    rule: pluralExtensions.rules[parts[0]]
	                };
	            }
	        },
	    
	        needsPlural: function(lng, count) {
	            var parts = lng.split('-');
	    
	            var ext;
	            if (pluralExtensions.currentRule && pluralExtensions.currentRule.lng === lng) {
	                ext = pluralExtensions.currentRule.rule; 
	            } else {
	                ext = pluralExtensions.rules[parts[f.getCountyIndexOfLng(lng)]];
	            }
	    
	            if (ext && ext.numbers.length <= 1) {
	                return false;
	            } else {
	                return this.get(lng, count) !== 1;
	            }
	        },
	    
	        get: function(lng, count) {
	            var parts = lng.split('-');
	    
	            function getResult(l, c) {
	                var ext;
	                if (pluralExtensions.currentRule && pluralExtensions.currentRule.lng === lng) {
	                    ext = pluralExtensions.currentRule.rule; 
	                } else {
	                    ext = pluralExtensions.rules[l];
	                }
	                if (ext) {
	                    var i;
	                    if (ext.noAbs) {
	                        i = ext.plurals(c);
	                    } else {
	                        i = ext.plurals(Math.abs(c));
	                    }
	                    
	                    var number = ext.numbers[i];
	                    if (ext.numbers.length === 2 && ext.numbers[0] === 1) {
	                        if (number === 2) { 
	                            number = -1; // regular plural
	                        } else if (number === 1) {
	                            number = 1; // singular
	                        }
	                    }//console.log(count + '-' + number);
	                    return number;
	                } else {
	                    return c === 1 ? '1' : '-1';
	                }
	            }
	                        
	            return getResult(parts[f.getCountyIndexOfLng(lng)], count);
	        }
	    
	    };
	    var postProcessors = {};
	    var addPostProcessor = function(name, fc) {
	        postProcessors[name] = fc;
	    };
	    // sprintf support
	    var sprintf = (function() {
	        function get_type(variable) {
	            return Object.prototype.toString.call(variable).slice(8, -1).toLowerCase();
	        }
	        function str_repeat(input, multiplier) {
	            for (var output = []; multiplier > 0; output[--multiplier] = input) {/* do nothing */}
	            return output.join('');
	        }
	    
	        var str_format = function() {
	            if (!str_format.cache.hasOwnProperty(arguments[0])) {
	                str_format.cache[arguments[0]] = str_format.parse(arguments[0]);
	            }
	            return str_format.format.call(null, str_format.cache[arguments[0]], arguments);
	        };
	    
	        str_format.format = function(parse_tree, argv) {
	            var cursor = 1, tree_length = parse_tree.length, node_type = '', arg, output = [], i, k, match, pad, pad_character, pad_length;
	            for (i = 0; i < tree_length; i++) {
	                node_type = get_type(parse_tree[i]);
	                if (node_type === 'string') {
	                    output.push(parse_tree[i]);
	                }
	                else if (node_type === 'array') {
	                    match = parse_tree[i]; // convenience purposes only
	                    if (match[2]) { // keyword argument
	                        arg = argv[cursor];
	                        for (k = 0; k < match[2].length; k++) {
	                            if (!arg.hasOwnProperty(match[2][k])) {
	                                throw(sprintf('[sprintf] property "%s" does not exist', match[2][k]));
	                            }
	                            arg = arg[match[2][k]];
	                        }
	                    }
	                    else if (match[1]) { // positional argument (explicit)
	                        arg = argv[match[1]];
	                    }
	                    else { // positional argument (implicit)
	                        arg = argv[cursor++];
	                    }
	    
	                    if (/[^s]/.test(match[8]) && (get_type(arg) != 'number')) {
	                        throw(sprintf('[sprintf] expecting number but found %s', get_type(arg)));
	                    }
	                    switch (match[8]) {
	                        case 'b': arg = arg.toString(2); break;
	                        case 'c': arg = String.fromCharCode(arg); break;
	                        case 'd': arg = parseInt(arg, 10); break;
	                        case 'e': arg = match[7] ? arg.toExponential(match[7]) : arg.toExponential(); break;
	                        case 'f': arg = match[7] ? parseFloat(arg).toFixed(match[7]) : parseFloat(arg); break;
	                        case 'o': arg = arg.toString(8); break;
	                        case 's': arg = ((arg = String(arg)) && match[7] ? arg.substring(0, match[7]) : arg); break;
	                        case 'u': arg = Math.abs(arg); break;
	                        case 'x': arg = arg.toString(16); break;
	                        case 'X': arg = arg.toString(16).toUpperCase(); break;
	                    }
	                    arg = (/[def]/.test(match[8]) && match[3] && arg >= 0 ? '+'+ arg : arg);
	                    pad_character = match[4] ? match[4] == '0' ? '0' : match[4].charAt(1) : ' ';
	                    pad_length = match[6] - String(arg).length;
	                    pad = match[6] ? str_repeat(pad_character, pad_length) : '';
	                    output.push(match[5] ? arg + pad : pad + arg);
	                }
	            }
	            return output.join('');
	        };
	    
	        str_format.cache = {};
	    
	        str_format.parse = function(fmt) {
	            var _fmt = fmt, match = [], parse_tree = [], arg_names = 0;
	            while (_fmt) {
	                if ((match = /^[^\x25]+/.exec(_fmt)) !== null) {
	                    parse_tree.push(match[0]);
	                }
	                else if ((match = /^\x25{2}/.exec(_fmt)) !== null) {
	                    parse_tree.push('%');
	                }
	                else if ((match = /^\x25(?:([1-9]\d*)\$|\(([^\)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fosuxX])/.exec(_fmt)) !== null) {
	                    if (match[2]) {
	                        arg_names |= 1;
	                        var field_list = [], replacement_field = match[2], field_match = [];
	                        if ((field_match = /^([a-z_][a-z_\d]*)/i.exec(replacement_field)) !== null) {
	                            field_list.push(field_match[1]);
	                            while ((replacement_field = replacement_field.substring(field_match[0].length)) !== '') {
	                                if ((field_match = /^\.([a-z_][a-z_\d]*)/i.exec(replacement_field)) !== null) {
	                                    field_list.push(field_match[1]);
	                                }
	                                else if ((field_match = /^\[(\d+)\]/.exec(replacement_field)) !== null) {
	                                    field_list.push(field_match[1]);
	                                }
	                                else {
	                                    throw('[sprintf] huh?');
	                                }
	                            }
	                        }
	                        else {
	                            throw('[sprintf] huh?');
	                        }
	                        match[2] = field_list;
	                    }
	                    else {
	                        arg_names |= 2;
	                    }
	                    if (arg_names === 3) {
	                        throw('[sprintf] mixing positional and named placeholders is not (yet) supported');
	                    }
	                    parse_tree.push(match);
	                }
	                else {
	                    throw('[sprintf] huh?');
	                }
	                _fmt = _fmt.substring(match[0].length);
	            }
	            return parse_tree;
	        };
	    
	        return str_format;
	    })();
	    
	    var vsprintf = function(fmt, argv) {
	        argv.unshift(fmt);
	        return sprintf.apply(null, argv);
	    };
	    
	    addPostProcessor("sprintf", function(val, key, opts) {
	        if (!opts.sprintf) return val;
	    
	        if (Object.prototype.toString.apply(opts.sprintf) === '[object Array]') {
	            return vsprintf(val, opts.sprintf);
	        } else if (typeof opts.sprintf === 'object') {
	            return sprintf(val, opts.sprintf);
	        }
	    
	        return val;
	    });
	    // public api interface
	    i18n.init = init;
	    i18n.isInitialized = isInitialized;
	    i18n.setLng = setLng;
	    i18n.preload = preload;
	    i18n.addResourceBundle = addResourceBundle;
	    i18n.hasResourceBundle = hasResourceBundle;
	    i18n.getResourceBundle = getResourceBundle;
	    i18n.addResource = addResource;
	    i18n.addResources = addResources;
	    i18n.removeResourceBundle = removeResourceBundle;
	    i18n.loadNamespace = loadNamespace;
	    i18n.loadNamespaces = loadNamespaces;
	    i18n.setDefaultNamespace = setDefaultNamespace;
	    i18n.t = translate;
	    i18n.translate = translate;
	    i18n.exists = exists;
	    i18n.detectLanguage = f.detectLanguage;
	    i18n.pluralExtensions = pluralExtensions;
	    i18n.sync = sync;
	    i18n.functions = f;
	    i18n.lng = lng;
	    i18n.addPostProcessor = addPostProcessor;
	    i18n.applyReplacement = f.applyReplacement;
	    i18n.options = o;
	    i18n.noConflict = noConflict;
	
	})( false ? window : exports);

/***/ },
/* 13 */
/*!*************************************************!*\
  !*** /mnt/windows/wouafit/languages/en-us.json ***!
  \*************************************************/
/***/ function(module, exports) {

	module.exports = {
		"languageShort": "en",
		"Search!": "Search!",
		"Contact": "Contact",
		"About": "About",
		"Twitter": "Twitter",
		"Wouaf IT": "Wouaf IT",
		"The first micro-events network": "The first micro-events network",
		"Menu": "Menu",
		"Login": "Login",
		"Create your account": "Create your account",
		"My account": "My account",
		"Parameters": "Parameters",
		"Logout": "Logout",
		"Search": "Search",
		"Your Wouafs": "Your Wouafs",
		"Where?": "Where?",
		"Look for a place": "Look for a place",
		"When?": "When?",
		"Choose a period": "Choose a period",
		"Today": "Today",
		"Tomorrow": "Tomorrow",
		"This week": "This week",
		"This month": "This month",
		"Specific dates": "Specific dates",
		"From": "From",
		"Start": "Start",
		"To": "To",
		"End": "End",
		"What?": "What?",
		"Choose a category": "Choose a category",
		"Hashtag": "Hashtag",
		"Specify a hashtag": "Specify a hashtag",
		"All events": "All events",
		"Events": "Events",
		"Out": "Out",
		"Purchases / Sales": "Purchases / Sales",
		"Lost / Found": "Lost / Found",
		"Donations": "Donations",
		"Exchanges": "Exchanges",
		"Services": "Services",
		"Others": "Others"
	}

/***/ },
/* 14 */
/*!*********************************!*\
  !*** ./class/singleton/data.js ***!
  \*********************************/
/***/ function(module, exports) {

	module.exports = (function() {
		// Reference to "this" that won't get clobbered by some other "this"
		var self = {};
		// Public methods
		self.init = function () {
			//todo: get current data from cookies if any
		}
		self.set = function (key, value) {
			self[key] = value;
		}
		self.get = function (key) {
			return self[key] || null;
		}
		return self;
	})();

/***/ },
/* 15 */
/*!**************************!*\
  !*** ../less/index.less ***!
  \**************************/
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(/*! !./../../~/css-loader!./../../~/postcss-loader!./../../~/less-loader!./index.less */ 16);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(/*! ./../../~/style-loader/addStyles.js */ 10)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/postcss-loader/index.js!./../../node_modules/less-loader/index.js!./index.less", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/postcss-loader/index.js!./../../node_modules/less-loader/index.js!./index.less");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 16 */
/*!*************************************************************************************************************************************!*\
  !*** /mnt/windows/wouafit/~/css-loader!/mnt/windows/wouafit/~/postcss-loader!/mnt/windows/wouafit/~/less-loader!../less/index.less ***!
  \*************************************************************************************************************************************/
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(/*! ./../../~/css-loader/lib/css-base.js */ 9)();
	// imports
	
	
	// module
	exports.push([module.id, "a,\n.btn-link {\n  color: #2b9d48;\n}\na:focus,\n.btn-link:focus,\na:hover,\n.btn-link:hover,\na:active,\n.btn-link:active {\n  color: #154d23;\n}\n.btn-primary {\n  background-color: #2b9d48;\n  border-color: #2b9d48;\n}\n.btn-primary:hover,\n.btn-primary:active {\n  background-color: #154d23;\n  border-color: #154d23;\n}\n.form-control:focus {\n  border-color: #5cd27a;\n}\n@media (max-width: 480px) {\n  /* Slidebar widths on extra small screens. */\n  .sb-width-wide {\n    width: 85%;\n  }\n}\n@media (min-width: 481px) {\n  /* Slidebar widths on small screens. */\n  .sb-width-wide {\n    width: 400px;\n  }\n}\n@media (min-width: 768px) {\n  /* Slidebar widths on medium screens. */\n  .sb-width-wide {\n    width: 400px;\n  }\n}\n@media (min-width: 992px) {\n  /* Slidebar widths on large screens. */\n  .sb-width-wide {\n    width: 525px;\n  }\n}\n@media (min-width: 1200px) {\n  /* Slidebar widths on extra large screens. */\n  .sb-width-wide {\n    width: 525px;\n  }\n}\n@font-face {\n  font-family: \"harlequinflfregular\";\n  src: url(" + __webpack_require__(/*! ../fonts/harlequinflf-webfont.eot */ 17) + ");\n  src: url(" + __webpack_require__(/*! ../fonts/harlequinflf-webfont.eot */ 17) + "?#iefix) format('embedded-opentype'), url(" + __webpack_require__(/*! ../fonts/harlequinflf-webfont.woff */ 18) + ") format('woff'), url(" + __webpack_require__(/*! ../fonts/harlequinflf-webfont.ttf */ 19) + ") format('truetype'), url(" + __webpack_require__(/*! ../fonts/harlequinflf-webfont.svg */ 20) + "#RanchoRegular) format('svg');\n  font-style: normal;\n  font-weight: 400;\n}\n::selection {\n  background: #5cd27a;\n}\nhtml,\nbody {\n  height: 100%;\n  margin: 0;\n  padding: 0;\n  background-color: #ffffff;\n}\n#sb-site,\n#map {\n  height: 100%;\n}\n#menu {\n  position: absolute;\n  top: 1em;\n  left: 1em;\n  z-index: 100;\n  background-color: rgba(255, 255, 255, 0.6);\n  padding: 0.3em;\n  border: 1px solid #cccccc;\n  border-radius: 0.3em;\n  cursor: pointer;\n}\n#toast {\n  position: absolute;\n  max-width: 100%;\n  width: 100%;\n  top: 80%;\n  z-index: 10000;\n  display: none;\n}\n#toast > div {\n  background-color: #ffffff;\n  border: 0.2em solid #2b9d48;\n  border-radius: 0.5em;\n  text-align: center;\n  margin: 0 auto;\n  padding: 0.3rem;\n}\n#toast > div > p {\n  margin-bottom: 0;\n}\n#modalWindow .modal-header {\n  background-color: #2b9d48;\n  color: #ffffff;\n}\n.sb-slidebar {\n  background-color: #ffffff;\n  border-right: 0, 125rem solid #cccccc;\n}\n.sb-slidebar .tab-content {\n  padding: 0.3em;\n}\n.sb-slidebar header {\n  color: #ffffff;\n  background-color: #2b9d48;\n  margin-bottom: 0.1rem;\n  border-bottom: 1px solid #26893f;\n}\n.sb-slidebar header h1.logo {\n  font-family: 'harlequinflfregular';\n  text-transform: uppercase;\n  height: 4.6875rem;\n  background: url(" + __webpack_require__(/*! ../img/logo-75.png */ 21) + ") top left no-repeat;\n  padding-left: 4.6875rem;\n  padding-top: 1.25rem;\n  margin-bottom: 0;\n  font-size: 2.3rem;\n}\n.sb-slidebar header nav {\n  position: relative;\n  right: 0.5rem;\n  z-index: 2;\n}\n.sb-slidebar header nav a,\n.sb-slidebar header nav .btn-link {\n  color: #ffffff;\n}\n.sb-slidebar header nav a:focus,\n.sb-slidebar header nav .btn-link:focus,\n.sb-slidebar header nav a:hover,\n.sb-slidebar header nav .btn-link:hover,\n.sb-slidebar header nav a:active,\n.sb-slidebar header nav .btn-link:active {\n  color: #154d23;\n}\n.sb-slidebar header nav .btn-link {\n  padding: 0;\n}\n.sb-slidebar footer {\n  position: fixed;\n  bottom: 0;\n  width: 100%;\n  background-color: #cccccc;\n  color: #2b9d48;\n}\n@media (max-width: 480px) {\n  /* widths on extra small screens. */\n  #toast > div {\n    width: 100%;\n  }\n}\n@media (min-width: 481px) {\n  /* widths on small screens. */\n  #toast > div {\n    width: 20rem;\n  }\n}\n@media (min-width: 768px) {\n  /* widths on medium screens. */\n}\n@media (min-width: 992px) {\n  /* widths on large screens. */\n}\n@media (min-width: 1200px) {\n  /* widths on extra large screens. */\n}\n", ""]);
	
	// exports


/***/ },
/* 17 */
/*!*****************************************!*\
  !*** ../fonts/harlequinflf-webfont.eot ***!
  \*****************************************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "_/fonts/harlequinflf-webfont-7cbc37.eot"

/***/ },
/* 18 */
/*!******************************************!*\
  !*** ../fonts/harlequinflf-webfont.woff ***!
  \******************************************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "_/fonts/harlequinflf-webfont-f6d22e.woff"

/***/ },
/* 19 */
/*!*****************************************!*\
  !*** ../fonts/harlequinflf-webfont.ttf ***!
  \*****************************************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "_/fonts/harlequinflf-webfont-59f502.ttf"

/***/ },
/* 20 */
/*!*****************************************!*\
  !*** ../fonts/harlequinflf-webfont.svg ***!
  \*****************************************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "_/fonts/harlequinflf-webfont-33186d.svg"

/***/ },
/* 21 */
/*!**************************!*\
  !*** ../img/logo-75.png ***!
  \**************************/
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEsAAABLCAIAAAC3LO29AAALB0lEQVR42s2ceXAT5xXAZUm2ZNmWL1m2fMmWZFnaUzbmMpZPyauV5FDoAD0o0LoEgkvSZIJJmzChg8thWicU25ItycYnnQxToIRJc5QUOnTaQqFNSjvNQDtJJ51p/+jf/SMz9O2ucGTZ1u7KcrTffOPh2G93f/ve9659a5ntXJc96LYHhM1Rt32EnaOCl8RMJNCNBigsyEz4MxJI5iQiZtANdDJ7sBud9KATfDPiQSIUOu3F5nzYjI9ZEhawKmbik157hKoedVaMbKkcabGEuuBfRJ1B9Jz0AJ0MWDmARDPsQSY8xIwfG+iwHdyIHm0hQjQ+50PCFMMZ4Z/4hNcUbG+a8J74zeDEg9nh++PbLu0zjrSgEVrI8iTnhAfoBBAC3qSHGPMYPTa1WiWTyRQKRZFZb+3bQM74gJwXkpjw1gbb9/y878NP7l2/fPXcj4amw5MP/no/8Idxa7ADILH0EiIRDznpLd9cA2yyDHayQyGTV7msZJhGJhNB4hO0aazjy5e++feP/7a9ZzsslMvl8NNQarj5ixtj9yLG0RaQcPoIQxQ+5zfvdjBciidwgCnPgMnc6PpqMuRNCEkjwY5b/3i/r/cZTv7M8gxmbaWh8s9/ub/78tOWsS5sgk4HIejnBQ9+rju3RLtwW7GDg6xoNTumlt+TIMCaYPuzb/ff/f3tgoICOLjcYBgZGfZ6vdwZzpw4+c6jt8yBtvQQIqwALXsbmXuRx+M9oWS4TTsI4qIfjl+6A8FyDt0dffvam9zhp0+devz48cOHD7XaPPjr/n29f/zP/bpAx5qYHH7CsIe44C1By5cVYAwksyetz2yAxxEHCYRVo86B22dvvvcep59Op/PRo0cnBwa4pc/3PXfnX7+zBNrTIUNQ0SmaONWl0qiiNkaWQIoydW42frwNm/GiMZBYhLaG3N2zOz54dGedYx1nZtQqlUIu51a9eeXy4O2zpvQQhihs3lfXt0EBcCvjRQerw8VmPRH0xPkPEGPlcPP5e8H5yWk4RqlUAltmZib8mersvvfJXTzstocpEQ4DTg57PsTO8CoIQd/IuZ4qT92CRUk8uGNqt6HEYl2FW7eFKfD1Dz79oMPZzkFyS2798sZLv/oBqDEh0FuEmecOkQpoCjbrg4leoBkLlyRhhCInfGVklUBCTs7ZeRr8rAvUO06MgHHk/VcBCXSa25Df2X/o1/+8aRp1YkLwwswTR2HXzPnxgAd51Wnr22g/vAkbcuEQdYST01KIJMc8hVU6HjOzRFere+zkfLzJAQzTaOutj28e+vZBOKZMX/anD+9u/1mveawT592BIQr8LT7vx8+4qv32gopi7hnB0ORprAfWs5CUSEJ4Khdo/DVXtlaT2MwsNTn5hkLiPIUujgE4x7j3+uG7d34Lxxzr//6lj65UDTcTkz5ePNBJcow2bkXVOdmLVIYJjWQqlQp9uRVdbOGEEU570eOtXIQlYrDPov7QRkhB0CVitATa3n347p6du99659quawcgmkssQFAE5jyvthXW6LiTZ7Dj86spmNvToeXwpJjURxQhNutFXtySIVB8ixW1bFMNObOMb6wJth2+/tJ/P/33lftXbaFOHg8B8ca8z/Z8szpHndgWZMqV9pedjKOK09VEhOzDsx3aJJIvqqiavBx80IUutjdgVOvD3a1TWz/77H9nbg4ZA60JAm5OerYXmrOyMllZZSR+pqZtOMQb8YrKS2jtXZ8heBPGuY0acBsQx43Ha059yHX7oxv7rj4H8lyRkN0j2A87NbnZvHaO+189UQEJULyi8hDO+yx71snEEy64DexUJ2sA4nOxrpmdjZM99giVOF8rdVTySC+GMKc4l3y9G/KERTEAL6H5aw3JED65arFVTwaXyR6tEMSsjMdcetaHHNkilwkzAlzMqFHjA53oNC2CEPyP6auO5AjZ7cH8qHCaiSlvXGKFJUzq4WByylfaKC7SgFgXPd6OzogivOiv3UEkT8hCwlLLNxrIN55idkiI4o1dYN+C7oCzkQu/LidDNRB2iCas3o4tSCOZwd4iBNmmnQQZYSLJKOdC0BxeErtM0eSwB2KGhVsXSJgNmc3JrrhoMREhGGvHfI+h3SRUVRJywvoiix48G/hlqNCBWcchaJ5mah/IAuo4g+cY9+pZAyMTfFFuz+eV5TuGqfg9vyJhNGRz5+q0IoLSBITsGSAnLLTqjbS9bm9D/Xc3IgPtxLCHBCcG9hYud9EPsZ4OMYjC+7ySsrmWmF4Sna5IyBQvfHW968RejFeXYocqS5VfVlDpqkO+58QGO+u+1aStKExGZdjjLV9vEOPx2fKMsduWSsKFu+GKdDFnhdA3U5WZEaNyYocyQ2E71iImamMJK9ssqSeMEysLHKfMSTjevCIt9po7LkjkJ6xy1a8xYbzVTWYde3tFVr0jzIZsoggtuxtSYEjXerCerOZLKD6/TC0zoS2dorHBLk1+Tgps6RoP8LfY8TYmmw2Ly/EpfMZre3aTSqNeVVizpqrN5aLrqiHKQyJUMrU24qc91gMb5DKpypA1yZanm5ZXUSE1bzsUFGf85ZtrJbohM5jI13xwPYSyaHKEXBXI/kprpiJTmlJkPOGLzVBwSZaQffVLBuj8yiKpiTGagtoN5JRvxaKw0PeHs766/U2K5FOMtUKEH1pjERFiagKrewccphzT/rL11dISI5f45qnJIXd88UL0e3ymouGt79skLaPKEeaqiUEXcoFeHSF7KDFM5ZUViEhMvxh3D5XSI040eUsT+zJ43l8TTfkzpLMPNdoc/HTXMjG3aBkyBUwaO9GhVqulIkbO3e9pYNp6QtTq+mme1DAhfi8wFUvC3rCPuKrLSs76k39/uGzbSfmaJ41CR5YqCz3NFUhTSli7FU87IadBJfVlBJMTpqTrK6Z4Y/mKI/0yZK9e5asn5/xI4hqsaMJZn2WXBAjZgNt6cOOKAfdqtNToQ6RBKLP0NqWYEFJMx4xfh5en3ZZyVy93maFVJHVaCv0u0976gxuUckXaU36OUGctI8a9PL2fomQIL9yL60olUbZhbyC3KA8950ZXikiTidqmoMXUJJOMu88pyENfd6WIkC29Nc4+ZWgySoEw2tNSVogNx/e0JEUI66GQccwJL8qVWZKoZUSze3MpMUanYB9C0EBE6FKiMv1OYrGlKW2qdEwlDEqFVqJmffX9zUoZW8SQSGLI9ZZtQ5bt2U2u1ubM4mptkkl9wWkhR7nEd9VxabRvgC3SSEFLuU1YWFtChOnU9Oozle85v8FZK5V9yDlDvZY4381jSAVbGsoR8eabpZH4LpRnlEr8lTbm9Xg4Fd9bQPtXtF1fUvuwvyU1+5ARI5S9I16d3SAdMQIh2u9MGSHXAcZ28UiiAMVoqTorUYktmS+7oMF6oBP6CdKfWLCWpsReDt2qSMq+XeOa0cJ0QW1J+nMLtlUR7ALOW8IQXfMepXJLtektlkb7Emp0/BGpyH3ogT2N9DvhZV3ag7Viix472cG/A8XZUnD6F/3GHSh7mXQamJyCXPLH7qU98qv/wpJyTPpLGyvT5i2410zZauQo0/iECMQTnh8yX3OM0UXVurSZGa5XfRdBvNEjAk84IdSgkOOtmU8+VkqLe8gpzMWHoCrjEfhhtShCtuv6hc3p8oTRylpjBdQyefLdFQkTf48Px0158GFKW1qYFi2NVmWqi4lR5pNd7r7FfY/P8zsVRt22oBv9SXdxrV6hVKhy1Fka1Rc54YqKLKVWl4+e7rKNd4v7XQ7s71T4P8nmF/tQISOdAAAAAElFTkSuQmCC"

/***/ },
/* 22 */
/*!********************************!*\
  !*** ./class/singleton/map.js ***!
  \********************************/
/***/ function(module, exports) {

	module.exports = (function() {
		var init = function () {
			var initialLocation;
			var siberia = new google.maps.LatLng(60, 105);
			var newyork = new google.maps.LatLng(40.69847032728747, -73.9514422416687);
			var browserSupportFlag = new Boolean();
			var map = new google.maps.Map(document.getElementById('map'), {
				zoom: 9,
				panControl: false,
				streetViewControl: false,
				mapTypeControl: true,
				mapTypeControlOptions: {
					position: google.maps.ControlPosition.TOP_RIGHT
				},
				zoomControl: true,
				zoomControlOptions: {
					position: google.maps.ControlPosition.LEFT_BOTTOM
				},
				mapTypeId: google.maps.MapTypeId.ROADMAP
			});
			var myloc = new google.maps.Marker({
				clickable: false,
				icon: new google.maps.MarkerImage('//maps.gstatic.com/mapfiles/mobile/mobileimgs2.png',
												 new google.maps.Size(22,22),
												 new google.maps.Point(0,18),
												 new google.maps.Point(11,11)),
				shadow: null,
				zIndex: 999,
				map: map
			});
	
			// Try W3C Geolocation (Preferred)
			if(navigator.geolocation) {
				browserSupportFlag = true;
				navigator.geolocation.getCurrentPosition(function(position) {
					initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
					map.setCenter(initialLocation);
					myloc.setPosition(initialLocation);
				}, function() {
					handleNoGeolocation(browserSupportFlag);
				});
			}
			// Browser doesn't support Geolocation
			else {
				browserSupportFlag = false;
				handleNoGeolocation(browserSupportFlag);
			}
		}
	
		function handleNoGeolocation(errorFlag) {
			//TODO: get the last position chosen by cookie or user account
			// 		or ask user for position
			//		or do a geo detection by IP (country / city / ...) => http://dev.maxmind.com/geoip/geoip2/geolite2/
			if (errorFlag === true) {
				alert("Geolocation service failed.");
				initialLocation = newyork;
			} else {
				alert("Your browser doesn't support geolocation. We've placed you in Siberia.");
				initialLocation = siberia;
			}
			map.setCenter(initialLocation);
			myloc.setPosition(initialLocation);
		}
	
		// API/data for end-user
		return {
			init: init
		}
	})();

/***/ },
/* 23 */
/*!*********************************!*\
  !*** ./class/singleton/user.js ***!
  \*********************************/
/***/ function(module, exports) {

	module.exports = (function() {
		// Reference to "this" that won't get clobbered by some other "this"
		var self = {};
		// Public methods
		self.init = function () {
			//todo: get current user from cookies if any
		}
		self.set = function (key, value) {
			self[key] = value;
		}
		self.get = function (key) {
			return self[key] || null;
		}
		return self;
	})();

/***/ },
/* 24 */
/*!**********************************!*\
  !*** ./class/singleton/toast.js ***!
  \**********************************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = (function() {
		var $ = __webpack_require__(/*! jquery */ 5);
		var self = {};
		var $toast = $('#toast > div');
		self.show = function(text, delay) {
			delay = delay || 2000;
			$toast.html('<p>'+ text +'</p>').parent().fadeIn().delay(delay).fadeOut();
		}
	
		return self;
	})();

/***/ },
/* 25 */
/*!************************!*\
  !*** ./class/query.js ***!
  \************************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = function () {
		var user = __webpack_require__(/*! ./singleton/user.js */ 23);
		var xhr;
		//Google geocode usage limits : https://developers.google.com/maps/articles/geocodestrat#client
		//==> illimited from client (browser) requests
		var GOOGLE_BASE_URL = 'https://maps.googleapis.com/maps/api/geocode/json?sensor=false&address=';
		var ENDPOINT 		= ("https://api.wouaf.it");
		if (true) {
			var KEY 			= ("deve0f2d-5c24-4e36-8d1c-bfe9701fcdev");
		} else {
			var KEY 			= API_KEY_PROD;
		}
		//if needed someday : http://ws.geonames.org/search?q=toulouse&maxRows=5&style=LONG
	    //or http://api.geonames.org/postalCodeSearch
	    // Better ====>>> http://open.mapquestapi.com/geocoding/v1/address?location=Toulouse&callback=renderGeocode
		//doc : http://open.mapquestapi.com/geocoding/
		
		//OSM Static maps Images : http://wiki.openstreetmap.org/wiki/Static_map_images
		//see http://wiki.openstreetmap.org/wiki/StaticMap
		// http://ojw.dev.openstreetmap.org/StaticMap/ => PHP code : https://trac.openstreetmap.org/browser/sites/other/StaticMap
		// Better ====>>> http://open.mapquestapi.com/staticmap/
		
		var connectionError = function() {
			//check if last alert append in the last 2 seconds
			/*var now = new Date();
			if (Ti.App.Properties.getInt('connectionAlert') > 0) {
				if (now.getTime() - Ti.App.Properties.getInt('connectionAlert') > 2000) {
					var notification =  require('ui/components/notification');
					new notification(L('error_connecting_to_server_verify_that_your_device_is_properly_connected_and_try_again_later'));
				}
			} else {
				utils.alert(L('error_connecting_to_server_verify_that_your_device_is_properly_connected_and_try_again_later'));
			}
			Ti.App.Properties.setInt('connectionAlert', now.getTime());*/
			alert('connectionError');
		}
	    var query = function (params) {
			for (var i in params.data) {
				if (params.data[i] === null) {
					delete params.data[i];
				}
			}
			var xhr_params = {
				url: params.url,
				type: params.method,
				data: params.data,
				dataType: 'json',
				timeout: 10000,
				cache: false,
				success: params.success,
				error: function() {
					console.info('error', arguments);
					params.error({});//TODO
					//throw new Exception('Query error on'+ this.endpoint + path);
				},
				complete: function() {
					//nothing ?
				}
			}
			if (params.method == 'DELETE') {
				//seems to be a probem with DELETE requests ...
				xhr_params.type = 'POST';
				xhr_params.headers['X-HTTP-Method-Override'] = 'DELETE';
			}
			xhr = $.ajax(xhr_params);
		}
		var geocode = function(address, callback) {
			$.ajax({
				url: GOOGLE_BASE_URL + address,
				type: 'GET',
				data: data,
				done: function(json) {
					if (json.status != 'OK' || !json.results[0]) {
						callback(false);
						return;
					}
					var longitudeDelta = 0.04;
					var latitudeDelta = 0.04;
					if (json.results[0].geometry && json.results[0].geometry.viewport) {
						latitudeDelta = (json.results[0].geometry.viewport.northeast.lat - json.results[0].geometry.viewport.southwest.lat) / 2;
						longitudeDelta = (json.results[0].geometry.viewport.northeast.lng - json.results[0].geometry.viewport.southwest.lng) / 2;
						latitudeDelta = Math.round((latitudeDelta) * 1000000) / 1000000;
						longitudeDelta = Math.round((longitudeDelta) * 1000000) / 1000000;
					}
					callback(new utils.LatLng(
						json.results[0].geometry.location.lat,
						json.results[0].geometry.location.lng
					), latitudeDelta, longitudeDelta);
				},
				fail: function() {
					connectionError();
					callback(false);
				}
			});
		};
		var self = {
			connectionError: connectionError,
			posts: function(params, callback) {
				var searchId = params.searchId;
				var q = '?key=' + KEY;
				for (var i in params) {
					var param = params[i];
					if (i == 'type' || i == 'searchId' || i == 'source' || !param) { //remove event or empty params
					    continue;
					}
					if (i == 'tag') {
						param = params[i][1];
					} else if (i == 'date' && params[i]) {
						param = Math.round(params[i].getTime() / 1000);
					} else if (i == 'cat' && params[i]) {
						//var serverCategories = Ti.App.Properties.getList('categories');
						//param = serverCategories[params[i] - 1]['id'];
					}
					q += '&' + i + '=' + param;
				}
				console.info(ENDPOINT + '/wouaf/' + q);
				query({
					method: 'GET',
					url: 	ENDPOINT + '/wouaf/' + q,
					data:	null,
					success: function(results) {
						results.searchId = searchId;
						results.resultsType = 'wouafit';
						callback(results);
					},
					error:	null
				});
				/*
				if (Ti.Platform.osname != 'mobileweb' && Ti.App.Properties.getString('eventfulKey') && !!Ti.App.Properties.getBool('eventfulSearch')) {
					//duplicate search on eventful	
					var q = 'app_key='+ Ti.App.Properties.getString('eventfulKey') +'&units=km&page_size=100&mature=normal&include=categories&sort_order=popularity';
	                if (!params.date) {
	                    params.date = new Date();
	                }
	                if (!params.duration) {
	                    params.duration = 86400;
	                }
	                for (var i in params) {
						var param = params[i];
						if (i == 'type' || i == 'searchId' || i == 'source' || i == 'tag' || i == 'cat' || !param) { //remove event or empty params
						    continue;
						}
						if (i == 'date') {
							//start
							var year = param.getFullYear();
							var month = param.getMonth() + 1;
							month = month < 10 ? '0' + month : month;
							var day = param.getDate();
							day = day < 10 ? '0' + day : day;
							//end
						    var endDate = new Date();
						    endDate.setTime(param.getTime() + ((params.duration - 86400) * 1000));
						    var endYear = endDate.getFullYear();
	                        var endMonth = endDate.getMonth() + 1;
	                        endMonth = endMonth < 10 ? '0' + endMonth : endMonth;
	                        var endDay = endDate.getDate();
	                        endDay = endDay < 10 ? '0' + endDay : endDay;
	                        
	                        q += '&date=' + year + month + day + '00-' + endYear + endMonth + endDay + '00';
						} else if (i == 'loc') {
							q += '&location=' + param;
						} else if (i == 'radius') {
							q += '&within=' + param;
						}
					}
					console.info(utils.EVENTFUL_API_URL + '/events/search?' + q);
					query({
						method: 'GET',
						url: 	utils.EVENTFUL_API_URL + '/events/search?' + q,
						data:	null,
						success:function(results) {
							var datas = {
								'count': 0,
								'results': [],
								'searchId': searchId,
								'resultsType': 'eventful'
							};
							if (results && results.events && results.events.event) {
								console.info('eventful ok : '+results.events.event.length);
								//reformat datas
								datas.count = results.events.event.length;
								for (var i = 0, l = datas.count; i < l; i++) {
									var result = results.events.event[i];
									var data = {
										'id': result.id,
										'loc': [result.latitude, result.longitude],
										'cat': '',
										'text': result.title,
										'date': [],
										'pics': [],
										'tags': [],
										'author': ['eventful', (result.owner == 'evdb' ? 'Eventful.com' : result.owner)],
										'url': result.url
									};
									//text
									var len = data.text.length;
									if (result.description && len < 200) {
										var desc = utils.strip_tags(result.description.replace(/<br\s*\/?>/mg, "\n").replace(/\&#39;/g, "'").replace(/\&quot;/g, '"'));
										if (desc.length + len > 300) {
											data.text += '\n'+ desc.substr(0, (296 - len)) + ' ...';
										} else {
											data.text += '\n'+ desc;
										}
									}
									//categories
									if (result.categories && result.categories.category && result.categories.category.length) {
										for (var j = 0, lc = result.categories.category.length; j < lc; j++) {
											data.cat += data.cat ? ' / ' : '';
											data.cat += L(result.categories.category[j].id);
										}
									} else if (result.categories && result.categories.category && result.categories.category.id) {
										data.cat = L(result.categories.category.id);
									}
									//pics
									if (result.image && result.image.medium) {
										data.pics.push({'p': result.image.medium.url});
									}
									//timestamp
									var date = new Date();
									if (result.created) {
										date.setFullYear(result.created.substr(0,4));
										date.setMonth(result.created.substr(5,2) - 1);
										date.setDate(result.created.substr(8,2));
										date.setHours(result.created.substr(11,2));
										date.setMinutes(result.created.substr(14,2));
										date.setSeconds(result.created.substr(17,2));
									}
									data.ts = {'sec': Math.round(date.getTime() / 1000), 'usec': 0};
									//date start and stop
									var date = new Date();
									if (result.start_time) {
										date.setFullYear(result.start_time.substr(0,4));
										date.setMonth(result.start_time.substr(5,2) - 1);
										date.setDate(result.start_time.substr(8,2));
										date.setHours(result.start_time.substr(11,2));
										date.setMinutes(result.start_time.substr(14,2));
										date.setSeconds(result.start_time.substr(17,2));
									}
									data.date.push({'sec': Math.round(date.getTime() / 1000), 'usec': 0});
									if (result.stop_time) {
										var date = new Date();
										date.setFullYear(result.stop_time.substr(0,4));
										date.setMonth(result.stop_time.substr(5,2) - 1);
										date.setDate(result.stop_time.substr(8,2));
										date.setHours(result.stop_time.substr(11,2));
										date.setMinutes(result.stop_time.substr(14,2));
										date.setSeconds(result.stop_time.substr(17,2));
										data.date.push({'sec': Math.round(date.getTime() / 1000), 'usec': 0});
									} else {
										data.date.push({'sec': Math.round(date.getTime() / 1000) + 86400, 'usec': 0}); //one day
									}
									datas.results.push(data);
								}
							}
							callback(datas);
						},
						error:	function() {
						    //empty function to avoid double connection error alert
						    console.info('eventful error');
	                        console.info(JSON.stringify(arguments));
	                    }
					});
				}*/
			},
			post: function(id, callback) {
				var q = id + '?key=' + KEY;
				query({
					method: 'GET',
					url: 	ENDPOINT + '/wouaf/' + q,
					data:	null,
					success:callback,
					error:	null
				});
			},
			init: function(callback) {
				query({
					method: 'POST',
					url: 	ENDPOINT + '/init/',
					data:	{
						key: 		KEY,
						uid: 		user.get('uid'),
					    token:      user.get('token'),
	                    locale:     ("en-us")
	                },
					success:callback,
					error:	callback
				});
			},
			login: function(datas, success, error) {
	            query({
	                method: 'POST',
	                url:    ENDPOINT + '/user/login/',
	                data:  {
	                    key:        KEY,
	                    login:      datas.login,
	                    pass:       datas.pass,
	                    did:        'web_app'
	                },
	                success:success,
	                error:  error
	            });
	        },
	        fblogin: function(datas, success, error) {
	            datas.key = KEY;
	            datas.did = 'web_app';
	            query({
	                method: 'POST',
	                url:    ENDPOINT + '/user/fblogin/',
	                data:  datas,
	                success:success,
	                error:  error
	            });
	        },
	        logout: function(callback) {
				query({
					method: 'POST',
					url: 	ENDPOINT + '/user/logout/',
					data:	{
						key: 		KEY,
						uid: 		user.get('uid'),
						token: 		Ti.App.Properties.getString('token')
					},
					success:callback,
					error:	callback
				});
			},
			resetPassword: function(email, callback) {
	            query({
	                method: 'POST',
	                url:    ENDPOINT + '/user/resetPassword/',
	                data:  {
	                    key:        KEY,
	                    email:      email
	                },
	                success:callback,
	                error:  callback
	            });
	        },
			createUser: function(datas, success, error) {
				datas.key = KEY;
				query({
					method: 'PUT',
					url: 	ENDPOINT + '/user/',
					data:	datas,
					success:success,
					error:	error
				});
			},
			updateUser: function(datas, success, error) {
				datas.key = KEY;
				datas.uid = Ti.App.Properties.getString('uid');
				datas.token = Ti.App.Properties.getString('token');
				query({
					method: 'PUT',
					url: 	ENDPOINT + '/user/',
					data:	datas,
					success:success,
					error:	error
				});
			},
			deleteUser: function(callback) {
	            query({
	                method: 'DELETE',
	                url:    ENDPOINT + '/user/',
	                data:  {
	                    key:        KEY,
	                    uid:        user.get('uid'),
	                    token:      Ti.App.Properties.getString('token')
	                },
	                success:callback,
	                error:  callback
	            });
	        },
	        userPosts: function(uid, callback) {
	            var q = '?key=' + KEY + '&uid=' + uid;
	            query({
	                method: 'GET',
	                url:    ENDPOINT + '/user/wouaf/' + q,
	                success:callback,
	                error:  callback
	            });
	        },
	        userFavorites: function(callback) {
	            var q = '?key=' + KEY + '&uid=' + Ti.App.Properties.getString('uid') + '&token=' + Ti.App.Properties.getString('token');
	            query({
	                method: 'GET',
	                url:    ENDPOINT + '/user/favorites/' + q,
	                success:callback,
	                error:  callback
	            });
	        },
	        createPost: function(datas, callback) {
				datas.key = KEY;
				datas.uid = Ti.App.Properties.getString('uid');
				datas.token = Ti.App.Properties.getString('token');
				query({
					method: 'PUT',
					url: 	ENDPOINT + '/wouaf/',
					data:	datas,
					success:callback,
					error:	callback
				});
			},
			addFavorite: function(id, callback) {
				var datas = {
					key: KEY,
					uid: user.get('uid'),
					token: user.get('token'),
					id: id
				};
				query({
					method: 'PUT',
					url: 	ENDPOINT + '/user/favorite/',
					data:	datas,
					success:callback,
					error:	callback
				});
			},
			removeFavorite: function(id, callback) {
				var datas = {
					key: KEY,
					uid: user.get('uid'),
					token: user.get('token'),
					id: id
				};
				query({
					method: 'DELETE',
					url: 	ENDPOINT + '/user/favorite/',
					data:	datas,
					success:callback,
					error:	callback
				});
			},
			getComments: function(id, callback) {
	            var q = '?key=' + KEY + '&id=' + id;
	            query({
	                method: 'GET',
	                url:    ENDPOINT + '/wouaf/comment/' + q,
	                data:  null,
	                success:callback,
	                error:  callback
	            });
	        },
			createComment: function(datas, callback) {
			    datas.key = KEY;
	            datas.uid = Ti.App.Properties.getString('uid');
	            datas.token = Ti.App.Properties.getString('token');
	            query({
	                method: 'PUT',
	                url:    ENDPOINT + '/wouaf/comment/',
	                data:  datas,
	                success:callback,
	                error:  callback
	            });
			},
			deleteComment: function(id, callback) {
	            var datas = {
					key: KEY,
					uid: user.get('uid'),
					token: user.get('token'),
					id: id
				};
	            query({
	                method: 'DELETE',
	                url:    ENDPOINT + '/wouaf/comment/',
	                data:  datas,
	                success:callback,
	                error:  callback
	            });
	       },
	       contact: function(datas, callback) {
	            datas.key = KEY;
	            datas.uid = Ti.App.Properties.getString('uid');
	            datas.token = Ti.App.Properties.getString('token');
	            query({
	                method: 'POST',
	                url:    ENDPOINT + '/user/contact/',
	                data:  datas,
	                success:callback,
	                error:  callback
	            });
	       },
	       deletePost: function(id, callback) {
	            var datas = {
	                key: KEY,
	                uid: user.get('uid'),
	                token: user.get('token'),
	                id: id
	            };
	            query({
	                method: 'DELETE',
	                url:    ENDPOINT + '/wouaf/',
	                data:  datas,
	                success:callback,
	                error:  callback
	            });
	       },
	       reportPost: function(id, callback) {
	            var datas = {
	                key: KEY,
	                uid: user.get('uid'),
	                token: user.get('token'),
	                id: id
	            };
	            query({
	                method: 'POST',
	                url:    ENDPOINT + '/wouaf/abuse/',
	                data:  datas,
	                success:callback,
	                error:  callback
	            });
	       }
		}
		return self;
	}

/***/ },
/* 26 */
/*!***********************************!*\
  !*** ./class/singleton/window.js ***!
  \***********************************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = (function() {
		var $ = __webpack_require__(/*! jquery */ 5);
		var i18n = __webpack_require__(/*! ./i18n.js */ 11);
		var self = {};
		var $modal = $('#modalWindow');
		var $modalContent = $modal.find('.modal-content');
		/*$modal.on('show.bs.modal', function (event) {
	
		});*/
		$modal.on('hidden.bs.modal', function (event) {
			$modalContent.html('');
		});
		self.show = function(options) {
			option = $.extend({
				title:		'',
				text:		'',
				footer:		'',
				open:		null,
				close:		null
			}, options);
			var content =
				'<div class="modal-header">'+
				'	<button type="button" class="close" data-dismiss="modal" aria-label="'+ i18n.t('Close') +'">'+
				'		<span aria-hidden="true">&times;</span>'+
				'		<span class="sr-only">'+ i18n.t('Close') +'</span>'+
				'	</button>'+
				'	<h4 class="modal-title" id="myModalLabel">'+ option.title +'</h4>'+
				' </div>'+
				'<div class="modal-body">'+
					option.text+
				'</div>';
			if (option.footer) {
				content +=
				'<div class="modal-footer">'+
				option.footer+
				'</div>';
			}
			if (option.open) {
				$modal.on('show.bs.modal', function(event) {
					jQuery.proxy(option.open, this , event)();
					$(this).off(event);
				});
			}
			if (option.close) {
				$modal.on('hidden.bs.modal', function(event) {
					jQuery.proxy(option.close, this , event)();
					$(this).off(event);
				});
			}
			$modalContent.html(content);
			$modal.modal('show');
		}
	
		return self;
	})();

/***/ }
/******/ ]);
//# sourceMappingURL=build-en-us.js.map