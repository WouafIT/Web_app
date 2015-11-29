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
		var slidebars = __webpack_require__(/*! ./class/singleton/slidebars.js */ 5);
		//Load CSS
		__webpack_require__(/*! ../less/index.less */ 16);
		//i18n
		var i18n = __webpack_require__(/*! ./class/singleton/i18n.js */ 12);
		//Map
		var map = __webpack_require__(/*! ./class/singleton/map.js */ 23);
		//User
		var user = __webpack_require__(/*! ./class/singleton/user.js */ 29);
		//user.set('uid', 'toto');
		//user.set('token', 'test');
		//Data
		var data = __webpack_require__(/*! ./class/singleton/data.js */ 15);
		//data.set('foo', 'bar');
	
		//Toast
		var toast = __webpack_require__(/*! ./class/singleton/toast.js */ 31);
	
		//Query
		var query = __webpack_require__(/*! ./class/query.js */ 28)();
	
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
						var messageWindow = __webpack_require__(/*! ./class/singleton/window.js */ 32);
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
/* 4 */,
/* 5 */
/*!**************************************!*\
  !*** ./class/singleton/slidebars.js ***!
  \**************************************/
/***/ function(module, exports, __webpack_require__) {

	var $ = __webpack_require__(/*! jquery */ 6);
	//Slidebars
	__webpack_require__(/*! ../../../libs/slidebars/0.10.3/dist/slidebars.js */ 7);
	__webpack_require__(/*! ../../../libs/slidebars/0.10.3/dist/slidebars.css */ 8);
	
	module.exports = (function() {
		// private functions
		function init () {
			//i18n
			var i18n = __webpack_require__(/*! ./i18n.js */ 12);
	
			$.slidebars();
			//Dom Events
			$('#when').on({
				'change': showHideCustomDates
			});
			showHideCustomDates();
			//populate categories list
			var data = __webpack_require__(/*! ./data.js */ 15);
	
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
/* 6 */
/*!*************************!*\
  !*** external "jQuery" ***!
  \*************************/
/***/ function(module, exports) {

	module.exports = jQuery;

/***/ },
/* 7 */
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
/* 8 */
/*!***************************************************!*\
  !*** ../libs/slidebars/0.10.3/dist/slidebars.css ***!
  \***************************************************/
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(/*! !./../../../../../~/css-loader!./../../../../../~/postcss-loader!./slidebars.css */ 9);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(/*! ./../../../../../~/style-loader/addStyles.js */ 11)(content, {});
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
/* 9 */
/*!***************************************************************************************************************************!*\
  !*** /mnt/windows/Web_app/~/css-loader!/mnt/windows/Web_app/~/postcss-loader!../libs/slidebars/0.10.3/dist/slidebars.css ***!
  \***************************************************************************************************************************/
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(/*! ./../../../../../~/css-loader/lib/css-base.js */ 10)();
	// imports
	
	
	// module
	exports.push([module.id, "/* -----------------------------------\n * Slidebars\n * Version 0.10.3\n * http://plugins.adchsm.me/slidebars/\n *\n * Written by Adam Smith\n * http://www.adchsm.me/\n *\n * Released under MIT License\n * http://plugins.adchsm.me/slidebars/license.txt\n *\n * -------------------\n * Slidebars CSS Index\n *\n * 001 - Box Model, Html & Body\n * 002 - Site\n * 003 - Slidebars\n * 004 - Animation\n * 005 - Helper Classes\n *\n * ----------------------------\n * 001 - Box Model, Html & Body\n */\n\nhtml, body, #sb-site, .sb-site-container, .sb-slidebar {\n\t/* Set box model to prevent any user added margins or paddings from altering the widths or heights. */\n\tmargin: 0;\n\tpadding: 0;\n\t-webkit-box-sizing: border-box;\n\t   -moz-box-sizing: border-box;\n\t        box-sizing: border-box;\n}\n\nhtml, body {\n\twidth: 100%;\n\toverflow-x: hidden; /* Stops horizontal scrolling. */\n}\n\nhtml {\n\theight: 100%; /* Site is as tall as device. */\n}\n\nbody {\n\tmin-height: 100%;\n\theight: auto;\n\tposition: relative; /* Required for static Slidebars to function properly. */\n}\n\n/* Site scroll locking - prevent site from scrolling when a Slidebar is open, except when static Slidebars are only available. */\nhtml.sb-scroll-lock.sb-active:not(.sb-static) {\n\toverflow: hidden;\n}\n\n/* ----------\n * 002 - Site\n */\n\n#sb-site, .sb-site-container {\n\t/* You may now use class .sb-site-container instead of #sb-site and use your own id. However please make sure you don't set any of the following styles any differently on your id. */\n\twidth: 100%;\n\tmin-height: 100vh;\n\tposition: relative;\n\tz-index: 1; /* Site sits above Slidebars */\n\tbackground-color: #ffffff; /* Default background colour, overwrite this with your own css. I suggest moving your html or body background styling here. Making this transparent will allow the Slidebars beneath to be visible. */\n}\n\n/* Micro clearfix by Nicolas Gallagher, ensures the site container hits the top and bottom of the screen. */\n#sb-site:before, #sb-site:after, .sb-site-container:before, .sb-site-container:after {\n\tcontent: ' ';\n\tdisplay: table;\n}\n\n#sb-site:before, #sb-site:after, .sb-site-container:before, .sb-site-container:after {\n    clear: both;\n}\n\n/* ---------------\n * 003 - Slidebars\n */\n\n.sb-slidebar {\n\theight: 100%;\n\toverflow-y: auto; /* Enable vertical scrolling on Slidebars when needed. */\n\tposition: fixed;\n\ttop: 0;\n\tz-index: 0; /* Slidebars sit behind sb-site. */\n\tdisplay: none; /* Initially hide the Slidebars. Changed from visibility to display to allow -webkit-overflow-scrolling. */\n\tbackground-color: #222222; /* Default Slidebars background colour, overwrite this with your own css. */\n}\n\n.sb-slidebar, .sb-slidebar * {\n\t-webkit-transform: translateZ( 0px ); /* Fixes issues with translated and z-indexed elements on iOS 7. */\n}\n\n.sb-left {\n\tleft: 0; /* Set Slidebar to the left. */\n}\n\n.sb-right {\n\tright: 0; /* Set Slidebar to the right. */\n}\n\nhtml.sb-static .sb-slidebar,\n.sb-slidebar.sb-static {\n\tposition: absolute; /* Makes Slidebars scroll naturally with the site, and unfixes them for Android Browser < 3 and iOS < 5. */\n}\n\n.sb-slidebar.sb-active {\n\tdisplay: block; /* Makes Slidebars visibile when open. Changed from visibility to display to allow -webkit-overflow-scrolling. */\n}\n\n.sb-style-overlay {\n\tz-index: 9999; /* Set z-index high to ensure it overlays any other site elements. */\n}\n\n.sb-momentum-scrolling {\n\t-webkit-overflow-scrolling: touch; /* Adds native momentum scrolling for iOS & Android devices. */\n}\n\n/* Slidebar widths for browsers/devices that don't support media queries. */\n\t.sb-slidebar {\n\t\twidth: 30%;\n\t}\n\t\n\t.sb-width-thin {\n\t\twidth: 15%;\n\t}\n\t\n\t.sb-width-wide {\n\t\twidth: 45%;\n\t}\n\n@media (max-width: 480px) { /* Slidebar widths on extra small screens. */\n\t.sb-slidebar {\n\t\twidth: 70%;\n\t}\n\t\n\t.sb-width-thin {\n\t\twidth: 55%;\n\t}\n\t\n\t.sb-width-wide {\n\t\twidth: 85%;\n\t}\n}\n\n@media (min-width: 481px) { /* Slidebar widths on small screens. */\n\t.sb-slidebar {\n\t\twidth: 55%;\n\t}\n\t\n\t.sb-width-thin {\n\t\twidth: 40%;\n\t}\n\t\n\t.sb-width-wide {\n\t\twidth: 70%;\n\t}\n}\n\n@media (min-width: 768px) { /* Slidebar widths on medium screens. */\n\t.sb-slidebar {\n\t\twidth: 40%;\n\t}\n\t\n\t.sb-width-thin {\n\t\twidth: 25%;\n\t}\n\t\n\t.sb-width-wide {\n\t\twidth: 55%;\n\t}\n}\n\n@media (min-width: 992px) { /* Slidebar widths on large screens. */\n\t.sb-slidebar {\n\t\twidth: 30%;\n\t}\n\t\n\t.sb-width-thin {\n\t\twidth: 15%;\n\t}\n\t\n\t.sb-width-wide {\n\t\twidth: 45%;\n\t}\n}\n\n@media (min-width: 1200px) { /* Slidebar widths on extra large screens. */\n\t.sb-slidebar {\n\t\twidth: 20%;\n\t}\n\t\n\t.sb-width-thin {\n\t\twidth: 5%;\n\t}\n\t\n\t.sb-width-wide {\n\t\twidth: 35%;\n\t}\n}\n\n/* ---------------\n * 004 - Animation\n */\n\n.sb-slide, #sb-site, .sb-site-container, .sb-slidebar {\n\t-webkit-transform: translate( 0px );\n\t   -moz-transform: translate( 0px );\n\t     -o-transform: translate( 0px );\n\t        transform: translate( 0px );\n\t\n\t-webkit-transition: -webkit-transform 400ms ease;\n\t   -moz-transition:    -moz-transform 400ms ease;\n\t     -o-transition:      -o-transform 400ms ease;\n\t        transition:         transform 400ms ease;\n\t\n\t-webkit-transition-property: -webkit-transform, left, right; /* Add left/right for Android < 4.4. */\n\t-webkit-backface-visibility: hidden; /* Prevents flickering. This is non essential, and you may remove it if your having problems with fixed background images in Chrome. */\n}\n\n/* --------------------\n * 005 - Helper Classes\n */\n \n.sb-hide { \n\tdisplay: none; /* Optionally applied to control classes when Slidebars is disabled over a certain width. */\n}", ""]);
	
	// exports


/***/ },
/* 10 */
/*!*********************************************************!*\
  !*** /mnt/windows/Web_app/~/css-loader/lib/css-base.js ***!
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
/* 11 */
/*!********************************************************!*\
  !*** /mnt/windows/Web_app/~/style-loader/addStyles.js ***!
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
/* 12 */
/*!*********************************!*\
  !*** ./class/singleton/i18n.js ***!
  \*********************************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = (function() {
		var self = {};
		//i18next
		var i18next = __webpack_require__(/*! ../../../libs/i18next/1.10.1/i18next-1.10.1.js */ 13);
		//Init plugin with current language
		i18next.init({ resStore: {dev: {translation: __webpack_require__(/*! ../../../../languages/fr-fr.json */ 14)} } });
	
		self.t = i18next.t;
		return self;
	})();

/***/ },
/* 13 */
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
/* 14 */
/*!*************************************************!*\
  !*** /mnt/windows/Web_app/languages/fr-fr.json ***!
  \*************************************************/
/***/ function(module, exports) {

	module.exports = {
		"languageShort": "fr",
		"Search!": "Recherchez !",
		"Contact": "Contact",
		"About": "A Propos",
		"Twitter": "Twitter",
		"Wouaf IT": "Wouaf IT",
		"The first micro-events network": "Le premier réseau de micro-événements",
		"Menu": "Menu",
		"Login": "Connexion",
		"Create your account": "Créer un compte",
		"My account": "Mon compte",
		"Parameters": "Paramètres",
		"Logout": "Déconnexion",
		"Search": "Rechercher",
		"Your Wouafs": "Vos Wouafs",
		"Where?": "Où ?",
		"Look for a place": "Cherchez un endroit",
		"When?": "Quand ?",
		"Choose a period": "Cherchez une période",
		"Today": "Aujourd'hui",
		"Tomorrow": "Demain",
		"This week": "Cette semaine",
		"This month": "Ce mois ci",
		"Specific dates": "Dates spécifiques",
		"From": "Du",
		"Start": "Début",
		"To": "Au",
		"End": "Fin",
		"What?": "Quoi ?",
		"Choose a category": "Choississez une catégorie",
		"Hashtag": "Hashtag",
		"Specify a hashtag": "Cherchez un hashtag",
		"All events": "Tous les évènements",
		"Events": "Evénements",
		"Out": "Sorties",
		"Purchases / Sales": "Achats / Ventes",
		"Lost / Found": "Perdus / Trouvés",
		"Donations": "Dons",
		"Exchanges": "Echanges",
		"Services": "Services",
		"Others": "Autres"
	}

/***/ },
/* 15 */
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
/* 16 */
/*!**************************!*\
  !*** ../less/index.less ***!
  \**************************/
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(/*! !./../../~/css-loader!./../../~/postcss-loader!./../../~/less-loader!./index.less */ 17);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(/*! ./../../~/style-loader/addStyles.js */ 11)(content, {});
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
/* 17 */
/*!*************************************************************************************************************************************!*\
  !*** /mnt/windows/Web_app/~/css-loader!/mnt/windows/Web_app/~/postcss-loader!/mnt/windows/Web_app/~/less-loader!../less/index.less ***!
  \*************************************************************************************************************************************/
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(/*! ./../../~/css-loader/lib/css-base.js */ 10)();
	// imports
	
	
	// module
	exports.push([module.id, "a,\n.btn-link {\n  color: #2b9d48;\n}\na:focus,\n.btn-link:focus,\na:hover,\n.btn-link:hover,\na:active,\n.btn-link:active {\n  color: #154d23;\n}\n.btn-primary {\n  background-color: #2b9d48;\n  border-color: #2b9d48;\n}\n.btn-primary:hover,\n.btn-primary:active {\n  background-color: #154d23;\n  border-color: #154d23;\n}\n.form-control:focus {\n  border-color: #5cd27a;\n}\n@media (max-width: 480px) {\n  /* Slidebar widths on extra small screens. */\n  .sb-width-wide {\n    width: 85%;\n  }\n}\n@media (min-width: 481px) {\n  /* Slidebar widths on small screens. */\n  .sb-width-wide {\n    width: 400px;\n  }\n}\n@media (min-width: 768px) {\n  /* Slidebar widths on medium screens. */\n  .sb-width-wide {\n    width: 400px;\n  }\n}\n@media (min-width: 992px) {\n  /* Slidebar widths on large screens. */\n  .sb-width-wide {\n    width: 525px;\n  }\n}\n@media (min-width: 1200px) {\n  /* Slidebar widths on extra large screens. */\n  .sb-width-wide {\n    width: 525px;\n  }\n}\n@keyframes uil-ripple {\n  0% {\n    width: 0;\n    height: 0;\n    opacity: 0;\n    margin: 0 0 0 0;\n  }\n  33% {\n    width: 44%;\n    height: 44%;\n    margin: -22% 0 0 -22%;\n    opacity: 1;\n  }\n  100% {\n    width: 88%;\n    height: 88%;\n    margin: -44% 0 0 -44%;\n    opacity: 0;\n  }\n}\n.uil-ripple-css {\n  background: none;\n  position: relative;\n  width: 200px;\n  height: 200px;\n}\n.uil-ripple-css div {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  margin: 0;\n  width: 0;\n  height: 0;\n  opacity: 0;\n  border-radius: 50%;\n  border-width: 20px;\n  border-style: solid;\n  animation: uil-ripple 2s ease-out infinite;\n}\n.uil-ripple-css div:nth-of-type(1) {\n  border-color: #afafb7;\n}\n.uil-ripple-css div:nth-of-type(2) {\n  border-color: #2b9d48;\n  animation-delay: 1s;\n}\n@font-face {\n  font-family: \"harlequinflfregular\";\n  src: url(" + __webpack_require__(/*! ../fonts/harlequinflf-webfont.eot */ 18) + ");\n  src: url(" + __webpack_require__(/*! ../fonts/harlequinflf-webfont.eot */ 18) + "?#iefix) format('embedded-opentype'), url(" + __webpack_require__(/*! ../fonts/harlequinflf-webfont.woff */ 19) + ") format('woff'), url(" + __webpack_require__(/*! ../fonts/harlequinflf-webfont.ttf */ 20) + ") format('truetype'), url(" + __webpack_require__(/*! ../fonts/harlequinflf-webfont.svg */ 21) + "#RanchoRegular) format('svg');\n  font-style: normal;\n  font-weight: 400;\n}\n::selection {\n  background: #5cd27a;\n}\nhtml,\nbody {\n  height: 100%;\n  margin: 0;\n  padding: 0;\n  background-color: #ffffff;\n}\n#sb-site,\n#map {\n  height: 100%;\n}\n#menu {\n  position: absolute;\n  top: 1em;\n  left: 1em;\n  z-index: 100;\n  background-color: rgba(255, 255, 255, 0.6);\n  padding: 0.3em;\n  border: 1px solid #cccccc;\n  border-radius: 0.3em;\n  cursor: pointer;\n}\n#toast {\n  position: absolute;\n  max-width: 100%;\n  width: 100%;\n  top: 80%;\n  z-index: 10000;\n  display: none;\n}\n#toast > div {\n  background-color: #ffffff;\n  border: 0.2em solid #2b9d48;\n  border-radius: 0.5em;\n  text-align: center;\n  margin: 0 auto;\n  padding: 0.3rem;\n}\n#toast > div > p {\n  margin-bottom: 0;\n}\n#modalWindow .modal-header {\n  background-color: #2b9d48;\n  color: #ffffff;\n}\n#loader {\n  position: absolute;\n  bottom: -3rem;\n  right: -3rem;\n  z-index: 10;\n  transform: scale(0.25);\n  display: none;\n}\n.sb-slidebar {\n  background-color: #ffffff;\n  border-right: 0, 125rem solid #cccccc;\n}\n.sb-slidebar .tab-content {\n  padding: 0.3em;\n}\n.sb-slidebar header {\n  color: #ffffff;\n  background-color: #2b9d48;\n  margin-bottom: 0.1rem;\n  border-bottom: 1px solid #26893f;\n}\n.sb-slidebar header h1.logo {\n  font-family: 'harlequinflfregular';\n  text-transform: uppercase;\n  height: 4.6875rem;\n  background: url(" + __webpack_require__(/*! ../img/logo-75.png */ 22) + ") top left no-repeat;\n  padding-left: 4.6875rem;\n  padding-top: 1.25rem;\n  margin-bottom: 0;\n  font-size: 2.3rem;\n}\n.sb-slidebar header nav {\n  position: relative;\n  right: 0.5rem;\n  z-index: 2;\n}\n.sb-slidebar header nav a,\n.sb-slidebar header nav .btn-link {\n  color: #ffffff;\n}\n.sb-slidebar header nav a:focus,\n.sb-slidebar header nav .btn-link:focus,\n.sb-slidebar header nav a:hover,\n.sb-slidebar header nav .btn-link:hover,\n.sb-slidebar header nav a:active,\n.sb-slidebar header nav .btn-link:active {\n  color: #154d23;\n}\n.sb-slidebar header nav .btn-link {\n  padding: 0;\n}\n.sb-slidebar footer {\n  position: fixed;\n  bottom: 0;\n  width: 100%;\n  background-color: #cccccc;\n  color: #2b9d48;\n}\n@media (max-width: 480px) {\n  /* widths on extra small screens. */\n  #toast > div {\n    width: 100%;\n  }\n}\n@media (min-width: 481px) {\n  /* widths on small screens. */\n  #toast > div {\n    width: 20rem;\n  }\n}\n@media (min-width: 768px) {\n  /* widths on medium screens. */\n}\n@media (min-width: 992px) {\n  /* widths on large screens. */\n}\n@media (min-width: 1200px) {\n  /* widths on extra large screens. */\n}\n", ""]);
	
	// exports


/***/ },
/* 18 */
/*!*****************************************!*\
  !*** ../fonts/harlequinflf-webfont.eot ***!
  \*****************************************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "_/fonts/harlequinflf-webfont-7cbc37.eot"

/***/ },
/* 19 */
/*!******************************************!*\
  !*** ../fonts/harlequinflf-webfont.woff ***!
  \******************************************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "_/fonts/harlequinflf-webfont-f6d22e.woff"

/***/ },
/* 20 */
/*!*****************************************!*\
  !*** ../fonts/harlequinflf-webfont.ttf ***!
  \*****************************************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "_/fonts/harlequinflf-webfont-59f502.ttf"

/***/ },
/* 21 */
/*!*****************************************!*\
  !*** ../fonts/harlequinflf-webfont.svg ***!
  \*****************************************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "_/fonts/harlequinflf-webfont-0910ff.svg"

/***/ },
/* 22 */
/*!**************************!*\
  !*** ../img/logo-75.png ***!
  \**************************/
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEsAAABLCAIAAAC3LO29AAALB0lEQVR42s2ceXAT5xXAZUm2ZNmWL1m2fMmWZFnaUzbmMpZPyauV5FDoAD0o0LoEgkvSZIJJmzChg8thWicU25ItycYnnQxToIRJc5QUOnTaQqFNSjvNQDtJJ51p/+jf/SMz9O2ucGTZ1u7KcrTffOPh2G93f/ve9659a5ntXJc96LYHhM1Rt32EnaOCl8RMJNCNBigsyEz4MxJI5iQiZtANdDJ7sBud9KATfDPiQSIUOu3F5nzYjI9ZEhawKmbik157hKoedVaMbKkcabGEuuBfRJ1B9Jz0AJ0MWDmARDPsQSY8xIwfG+iwHdyIHm0hQjQ+50PCFMMZ4Z/4hNcUbG+a8J74zeDEg9nh++PbLu0zjrSgEVrI8iTnhAfoBBAC3qSHGPMYPTa1WiWTyRQKRZFZb+3bQM74gJwXkpjw1gbb9/y878NP7l2/fPXcj4amw5MP/no/8Idxa7ADILH0EiIRDznpLd9cA2yyDHayQyGTV7msZJhGJhNB4hO0aazjy5e++feP/7a9ZzsslMvl8NNQarj5ixtj9yLG0RaQcPoIQxQ+5zfvdjBciidwgCnPgMnc6PpqMuRNCEkjwY5b/3i/r/cZTv7M8gxmbaWh8s9/ub/78tOWsS5sgk4HIejnBQ9+rju3RLtwW7GDg6xoNTumlt+TIMCaYPuzb/ff/f3tgoICOLjcYBgZGfZ6vdwZzpw4+c6jt8yBtvQQIqwALXsbmXuRx+M9oWS4TTsI4qIfjl+6A8FyDt0dffvam9zhp0+devz48cOHD7XaPPjr/n29f/zP/bpAx5qYHH7CsIe44C1By5cVYAwksyetz2yAxxEHCYRVo86B22dvvvcep59Op/PRo0cnBwa4pc/3PXfnX7+zBNrTIUNQ0SmaONWl0qiiNkaWQIoydW42frwNm/GiMZBYhLaG3N2zOz54dGedYx1nZtQqlUIu51a9eeXy4O2zpvQQhihs3lfXt0EBcCvjRQerw8VmPRH0xPkPEGPlcPP5e8H5yWk4RqlUAltmZib8mersvvfJXTzstocpEQ4DTg57PsTO8CoIQd/IuZ4qT92CRUk8uGNqt6HEYl2FW7eFKfD1Dz79oMPZzkFyS2798sZLv/oBqDEh0FuEmecOkQpoCjbrg4leoBkLlyRhhCInfGVklUBCTs7ZeRr8rAvUO06MgHHk/VcBCXSa25Df2X/o1/+8aRp1YkLwwswTR2HXzPnxgAd51Wnr22g/vAkbcuEQdYST01KIJMc8hVU6HjOzRFere+zkfLzJAQzTaOutj28e+vZBOKZMX/anD+9u/1mveawT592BIQr8LT7vx8+4qv32gopi7hnB0ORprAfWs5CUSEJ4Khdo/DVXtlaT2MwsNTn5hkLiPIUujgE4x7j3+uG7d34Lxxzr//6lj65UDTcTkz5ePNBJcow2bkXVOdmLVIYJjWQqlQp9uRVdbOGEEU570eOtXIQlYrDPov7QRkhB0CVitATa3n347p6du99659quawcgmkssQFAE5jyvthXW6LiTZ7Dj86spmNvToeXwpJjURxQhNutFXtySIVB8ixW1bFMNObOMb6wJth2+/tJ/P/33lftXbaFOHg8B8ca8z/Z8szpHndgWZMqV9pedjKOK09VEhOzDsx3aJJIvqqiavBx80IUutjdgVOvD3a1TWz/77H9nbg4ZA60JAm5OerYXmrOyMllZZSR+pqZtOMQb8YrKS2jtXZ8heBPGuY0acBsQx43Ha059yHX7oxv7rj4H8lyRkN0j2A87NbnZvHaO+189UQEJULyi8hDO+yx71snEEy64DexUJ2sA4nOxrpmdjZM99giVOF8rdVTySC+GMKc4l3y9G/KERTEAL6H5aw3JED65arFVTwaXyR6tEMSsjMdcetaHHNkilwkzAlzMqFHjA53oNC2CEPyP6auO5AjZ7cH8qHCaiSlvXGKFJUzq4WByylfaKC7SgFgXPd6OzogivOiv3UEkT8hCwlLLNxrIN55idkiI4o1dYN+C7oCzkQu/LidDNRB2iCas3o4tSCOZwd4iBNmmnQQZYSLJKOdC0BxeErtM0eSwB2KGhVsXSJgNmc3JrrhoMREhGGvHfI+h3SRUVRJywvoiix48G/hlqNCBWcchaJ5mah/IAuo4g+cY9+pZAyMTfFFuz+eV5TuGqfg9vyJhNGRz5+q0IoLSBITsGSAnLLTqjbS9bm9D/Xc3IgPtxLCHBCcG9hYud9EPsZ4OMYjC+7ySsrmWmF4Sna5IyBQvfHW968RejFeXYocqS5VfVlDpqkO+58QGO+u+1aStKExGZdjjLV9vEOPx2fKMsduWSsKFu+GKdDFnhdA3U5WZEaNyYocyQ2E71iImamMJK9ssqSeMEysLHKfMSTjevCIt9po7LkjkJ6xy1a8xYbzVTWYde3tFVr0jzIZsoggtuxtSYEjXerCerOZLKD6/TC0zoS2dorHBLk1+Tgps6RoP8LfY8TYmmw2Ly/EpfMZre3aTSqNeVVizpqrN5aLrqiHKQyJUMrU24qc91gMb5DKpypA1yZanm5ZXUSE1bzsUFGf85ZtrJbohM5jI13xwPYSyaHKEXBXI/kprpiJTmlJkPOGLzVBwSZaQffVLBuj8yiKpiTGagtoN5JRvxaKw0PeHs766/U2K5FOMtUKEH1pjERFiagKrewccphzT/rL11dISI5f45qnJIXd88UL0e3ymouGt79skLaPKEeaqiUEXcoFeHSF7KDFM5ZUViEhMvxh3D5XSI040eUsT+zJ43l8TTfkzpLMPNdoc/HTXMjG3aBkyBUwaO9GhVqulIkbO3e9pYNp6QtTq+mme1DAhfi8wFUvC3rCPuKrLSs76k39/uGzbSfmaJ41CR5YqCz3NFUhTSli7FU87IadBJfVlBJMTpqTrK6Z4Y/mKI/0yZK9e5asn5/xI4hqsaMJZn2WXBAjZgNt6cOOKAfdqtNToQ6RBKLP0NqWYEFJMx4xfh5en3ZZyVy93maFVJHVaCv0u0976gxuUckXaU36OUGctI8a9PL2fomQIL9yL60olUbZhbyC3KA8950ZXikiTidqmoMXUJJOMu88pyENfd6WIkC29Nc4+ZWgySoEw2tNSVogNx/e0JEUI66GQccwJL8qVWZKoZUSze3MpMUanYB9C0EBE6FKiMv1OYrGlKW2qdEwlDEqFVqJmffX9zUoZW8SQSGLI9ZZtQ5bt2U2u1ubM4mptkkl9wWkhR7nEd9VxabRvgC3SSEFLuU1YWFtChOnU9Oozle85v8FZK5V9yDlDvZY4381jSAVbGsoR8eabpZH4LpRnlEr8lTbm9Xg4Fd9bQPtXtF1fUvuwvyU1+5ARI5S9I16d3SAdMQIh2u9MGSHXAcZ28UiiAMVoqTorUYktmS+7oMF6oBP6CdKfWLCWpsReDt2qSMq+XeOa0cJ0QW1J+nMLtlUR7ALOW8IQXfMepXJLtektlkb7Emp0/BGpyH3ogT2N9DvhZV3ag7Viix472cG/A8XZUnD6F/3GHSh7mXQamJyCXPLH7qU98qv/wpJyTPpLGyvT5i2410zZauQo0/iECMQTnh8yX3OM0UXVurSZGa5XfRdBvNEjAk84IdSgkOOtmU8+VkqLe8gpzMWHoCrjEfhhtShCtuv6hc3p8oTRylpjBdQyefLdFQkTf48Px0158GFKW1qYFi2NVmWqi4lR5pNd7r7FfY/P8zsVRt22oBv9SXdxrV6hVKhy1Fka1Rc54YqKLKVWl4+e7rKNd4v7XQ7s71T4P8nmF/tQISOdAAAAAElFTkSuQmCC"

/***/ },
/* 23 */
/*!********************************!*\
  !*** ./class/singleton/map.js ***!
  \********************************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = (function() {
	    var clustermap = 	__webpack_require__(/*! ../clustermap */ 24);
	    //Query
	    var query = __webpack_require__(/*! ../query.js */ 28)();
	    var map;
	    var browserSupportLocation = new Boolean();
	    var initialLocation;
	
	    var updatePins = function(json) {
	        console.info(json);
	    }
	
	    var getPosts = function(params) {
	        var now = new Date();
	        params.searchId = now.getTime();
	        query.posts(params, updatePins);
	    }
	
	
	    var init = function () {
	       map = new google.maps.Map(document.getElementById('map'), {
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
	
	        var marker = new google.maps.Marker({
	            map: map,
	            title: 'Hello World!'
	        });
	
			// Try W3C Geolocation (Preferred)
			if(navigator.geolocation) {
	            browserSupportLocation = true;
				navigator.geolocation.getCurrentPosition(function(position) {
					initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
					map.setCenter(initialLocation);
					myloc.setPosition(initialLocation);
	
	                getPosts({'loc': initialLocation});
				}, function() {
					handleNoGeolocation(browserSupportLocation);
				});
			}
			// Browser doesn't support Geolocation
			else {
	            browserSupportLocation = false;
				handleNoGeolocation(browserSupportLocation);
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
			init:       init,
	        getPosts:   getPosts
		}
	})();

/***/ },
/* 24 */
/*!*****************************!*\
  !*** ./class/clustermap.js ***!
  \*****************************/
/***/ function(module, exports, __webpack_require__) {

	var figue = __webpack_require__(/*! ../../libs/figue */ 25);
	var utils = __webpack_require__(/*! ./utils */ 26);
	
	var clustermap = function () {
		var _selectedNodes;
		var _displayedMarkers;
		
		function HCMap (params) {
			this._map = params.map ;
			//store initial map position
			this._map._previous = this._map.getRegion();
			this._elements = params.elements;
			this._minDistance = 140 ;
			this._vectors = [];
			this._tags = {};
			var that = this ;
			var indexes = [];
			if (this._elements) {
				// extract the points and convert the lat/lng coordinates to map coordinates
				//for (var i in this._elements) {
	            for (var i = 0, li = this._elements.length; i < li; i++) {
	            	var element = this._elements[i];
					if (element) {
	    				element.latlng = new utils.LatLng(element.loc[0], element.loc[1]);
	    				var projcoord = this._map.fromLatLngToPoint(element.latlng) ;
	    				var vector = [projcoord.x, projcoord.y];
	    				this._vectors.push (vector) ;
	    				indexes.push(i);
	    				for (var j = 0, lj = element.tags.length; j < lj; j++) {
	    					var tag = element.tags[j];
	    					if (this._tags[tag]) {
	    						this._tags[tag]++;
	    					} else {
	    						this._tags[tag] = 1;
	    					}
	    				}
					}
				}
				// cluster the map coordinates
				this._tree = figue.agglomerate (indexes,
	                                       this._vectors,
	                                       figue.EUCLIDIAN_DISTANCE,
	                                       figue.COMPLETE_LINKAGE) ;
				
				this._region_changed_listener = function(e) {
					if (this._timer) {
						clearTimeout(this._timer);
					}
					var map = this;
					var args = arguments;
					var func = function(e) {
						if (this._previous.longitudeDelta != e.longitudeDelta) {
							//zoom changed
							updateNodes(that);
							updateMarkers(that, true);
						} else {
							//bounds changed
							updateMarkers(that, false);
						}
						this._previous = e;
						if (!that._map) {
							return;
						}
					}
					this._timer = setTimeout(function() {
						func.apply(map, args);
					}, 200);
				}
				this._map.addEventListener('regionChanged', this._region_changed_listener);
				updateNodes(that);
				updateMarkers (that, true) ;
			}
		}
	
		// Node Selection Algorithm (ref Hierarchical Clusters in Web Mapping Systems, In Proceedings of the 19th ACM International World Wide Web Conference (WWW'10))
		function selectNodes(node, MCD) {
			var selectedNodes ;
			if (!node) {
				return;
			}
			if (node.isLeaf()) 
				return [node] ;
			else if (node.dist < MCD) 
				return [] ;
			else {
				selectedNodes = new Array() ;
				if (node.left != null) {
					if (node.left.isLeaf()) 
						selectedNodes.push(node.left) ;
					else {
						if (node.left.dist < MCD)
							selectedNodes.push (node.left) ;
						else
							selectedNodes = selectedNodes.concat (selectNodes(node.left, MCD)) ;
					}
				}
				
				if (node.right != null) {
					if (node.right.isLeaf()) 
						selectedNodes.push(node.right) ;
					else {
						if (node.right.dist < MCD)
							selectedNodes.push (node.right) ;
						else
							selectedNodes = selectedNodes.concat (selectNodes(node.right, MCD)) ;
					}
				}
			}
			return selectedNodes ;
		}
		
		function updateMarkers(hcmap, reset) {
			if (! hcmap._selectedNodes || !hcmap._map) {
				return ;
			}
			// remove visible markers
			if (reset) {
				hcmap.removeMarkers();
			}
			// display nodes as markers
			var viewport = hcmap._map.getBounds() ;
			
			var selectedNodes = hcmap._selectedNodes ;
	        
			var current_zoom_level = hcmap._map.getZoom() ;
			var _count = 0;
			for (var i = 0, l = selectedNodes.length ; i < l ; i++) {
				var element;
				var position;
				var description;
				var cat;
				var author;
				if (!selectedNodes[i]) {
	                continue;
				}
				if (selectedNodes[i].isLeaf()) {
					element = hcmap._elements[ selectedNodes[i].index ] ;
					position = element.latlng;
					cat = element.cat;
					author = element.author;
				} else {
					// Convert pixel coordinates to world coordinates
					var projcoord = new utils.Point (selectedNodes[i].centroid[0],
	                                               selectedNodes[i].centroid[1]) ;
					position = hcmap._map.fromPointToLatLng(projcoord) ;
				}
	
				if ((current_zoom_level > 2) && (! viewport.contains(position))) {
					continue;
				}
	            var clusterSize = selectedNodes[i].size ;
				if (clusterSize) {
					var _id = position.lat+'/'+position.lng;
					if (!hcmap._displayedMarkers[_id]) {
						if (clusterSize > 1) {
							/*var marker = Ti.Map.createAnnotation({
								title: '.' + Math.round(Math.random()*1000),
								animate: false,
								image: utils.img + '/maps/group/' + getCLusterPic(clusterSize) + '.png',
								latitude: position.lat,
								longitude: position.lng,
								elements: selectedNodes[i].indexes
							});*/
						} else {
							/*var marker = Ti.Map.createAnnotation({
								title: '~' + Math.round(Math.random()*1000),
								animate: false,
								image: /*(author && author[0] == 'eventful' ? utils.img + '/maps/cat/eventful.png' : * / utils.img + '/maps/cat/' + cat + '.png'/*)* /,
								latitude: position.lat,
								longitude: position.lng,
								elements: [selectedNodes[i].index]
							});*/
						}
						hcmap._map.addAnnotation(marker);
						hcmap._displayedMarkers[_id] = marker ;
						_count++;
					}
				}
			}
		}
		
		function updateNodes(hcmap) {
			if (!hcmap || !hcmap._map) {
				return;
			}
			var MCD = hcmap._minDistance/Math.pow(2, hcmap._map.getZoom());
	
			var selectedNodes = selectNodes (hcmap._tree , MCD) ;
			if (selectedNodes == null) {
				selectedNodes = [];
			}
			if (selectedNodes.length == 0)
				selectedNodes.push(hcmap._tree) ;
			
			hcmap._selectedNodes = selectedNodes ;
		}
		
		function getCLusterPic(size) {
			if (size > 1 && size < 10) {
				return size;
			}
			if (size >= 100) {
				return '100';
			}
			if (size >= 50) {
				return '50';
			}
			return (Math.floor(size/10) * 10);
		}
	
		return {
			HCMap: HCMap
		}
		
	}() ;
		
	
	clustermap.HCMap.prototype.reset = function () {
		if (this._region_changed_listener && this._map) {
			this._map.removeEventListener('regionChange', this._region_changed_listener);
		}
		this.removeMarkers();
		this._map = null ;
		this._positions = new Array () ;
		this._elements = new Array ();
		this._vectors = new Array () ;
		this._selectedNodes = new Array () ;
		this._tree = null;
	}
	clustermap.HCMap.prototype.getTags = function () {
		var _tags = utils.natsort(this._tags);
		var tags = [];
		for (var i in _tags) {
			tags.push('#' + i);
		}
		tags.push(L('every'));
		tags.reverse();
		return tags;
	}
	
	clustermap.HCMap.prototype.removeMarkers = function () {
		this._map.removeAllAnnotations();
		this._displayedMarkers = {} ;
	}
	
	module.exports = clustermap;
	


/***/ },
/* 25 */
/*!************************!*\
  !*** ../libs/figue.js ***!
  \************************/
/***/ function(module, exports) {

	/*!
	 * Figue v1.0.1
	 *
	 * Copyright 2010, Jean-Yves Delort
	 * Licensed under the MIT license.
	 *
	 */
	
	
	var figue = function () {
	
	
		function euclidianDistance (vec1 , vec2) {
			var N = vec1.length ;
			var d = 0 ;
			for (var i = 0 ; i < N ; i++)
				d += Math.pow (vec1[i] - vec2[i], 2)
			d = Math.sqrt (d) ;
			return d ;
		}
	
		function manhattanDistance (vec1 , vec2) {
			var N = vec1.length ;
			var d = 0 ;
			for (var i = 0 ; i < N ; i++)
				d += Math.abs (vec1[i] - vec2[i])
			return d ;
		}
	
		function maxDistance (vec1 , vec2) {
			var N = vec1.length ;
			var d = 0 ;
			for (var i = 0 ; i < N ; i++)
				d = Math.max (d , Math.abs (vec1[i] - vec2[i])) ;
			return d ;
		}
	
		function addVectors (vec1 , vec2) {
			var N = vec1.length ;
			var vec = new Array(N) ;
			for (var i = 0 ; i < N ; i++)
				vec[i] = vec1[i] + vec2[i] ;
			return vec ;
		}	
	
		function multiplyVectorByValue (value , vec) {
			var N = vec.length ;
			var v = new Array(N) ;
			for (var i = 0 ; i < N ; i++)
				v[i] = value * vec[i] ;
			return v ;
		}	
	
	
		function repeatChar(c, n) {
			var str = "";
			for (var i = 0 ; i < n ; i++)
				str += c ;
			return str ;
		}
		
		function calculateCentroid (c1Size , c1Centroid , c2Size , c2Centroid) {
			var newCentroid = new Array(c1Centroid.length) ;
			var newSize = c1Size + c2Size ;
			for (var i = 0, l = c1Centroid.length ; i < l ; i++) 
				newCentroid[i] = (c1Size * c1Centroid[i] + c2Size * c2Centroid[i]) / newSize ;
			return newCentroid ;	
		}
	
	
		function centerString(str, width) {
			var diff = width - str.length ;
			if (diff < 0)
				return ;
	
			var halfdiff = Math.floor(diff / 2) ;
			return repeatChar (" " , halfdiff) + str + repeatChar (" " , diff - halfdiff)  ;
		}
	
		function putString(str, width, index) {
			var diff = width - str.length ;
			if (diff < 0)
				return ;
	
			return repeatChar (" " , index) + str + repeatChar (" " , width - (str.length+index)) ;
		}
	
		function prettyVector(vector) {
			var vals = new Array(vector.length) ;
			var precision = Math.pow(10, figue.PRINT_VECTOR_VALUE_PRECISION) ; 
			for (var i = 0, l = vector.length ; i < l ; i++)
				vals[i] = Math.round(vector[i]*precision)/precision ;
			return vals.join(",")
		}
	
		function prettyValue(value) {
			var precision = Math.pow(10, figue.PRINT_VECTOR_VALUE_PRECISION) ; 
			return String (Math.round(value*precision)/precision) ;
		}
	
		function generateDendogram(tree, sep, balanced, withIndex, withCentroid, withDistance) {
			var lines = new Array ;
			var centroidstr = prettyVector(tree.centroid) ;
			if (tree.isLeaf()) {
				var index = String(tree.index) ;
				var len = 1;
				if (withCentroid) 
					len = Math.max(centroidstr.length , len) ;
				if (withIndex)
					len = Math.max(index.length , len) ;
	
				lines.push (centerString ("|" , len)) ;
				if (withCentroid) 
					lines.push (centerString (centroidstr , len)) ;
				if (withIndex) 
					lines.push (centerString (index , len)) ;
	
			} else {
				var distancestr = prettyValue(tree.dist) ;
				var left_dendo = generateDendogram(tree.left ,sep, balanced,withIndex,withCentroid, withDistance) ;
				var right_dendo = generateDendogram(tree.right, sep, balanced,withIndex,withCentroid,withDistance) ;
				var left_bar_ix = left_dendo[0].indexOf("|") ;
				var right_bar_ix = right_dendo[0].indexOf("|") ;
		
				// calculate nb of chars of each line
				var len = sep + right_dendo[0].length + left_dendo[0].length ;
				if (withCentroid) 
					len = Math.max(centroidstr.length , len) ;
				if (withDistance) 
					len = Math.max(distancestr.length , len) ;
	
	
				// calculate position of new vertical bar
				var bar_ix =  left_bar_ix + Math.floor(( left_dendo[0].length - (left_bar_ix) + sep + (1+right_bar_ix)) / 2) ;
				
				// add line with the new vertical bar 
				lines.push (putString ("|" , len , bar_ix)) ;
				if (withCentroid) {
					lines.push (putString (centroidstr , len , bar_ix - Math.floor (centroidstr.length / 2))) ; //centerString (centroidstr , len)) ;
				}
				if (withDistance) {
					lines.push (putString (distancestr , len , bar_ix - Math.floor (distancestr.length / 2))) ; //centerString (centroidstr , len)) ;
				}
					
				// add horizontal line to connect the vertical bars of the lower level
				var hlineLen = sep + (left_dendo[0].length -left_bar_ix) + right_bar_ix+1 ;
				var hline = repeatChar ("_" , hlineLen) ;
				lines.push (putString(hline, len, left_bar_ix)) ;
		
				// IF: the user want the tree to be balanced: all the leaves have to be at the same level
				// THEN: if the left and right subtrees have not the same depth, add extra vertical bars to the top of the smallest subtree
				if (balanced &&  (left_dendo.length != right_dendo.length)) {
					var shortest ;
					var longest ;
					if (left_dendo.length > right_dendo.length) {
						longest = left_dendo ;
						shortest = right_dendo ;
					} else {
						longest = right_dendo ;
						shortest = left_dendo ;
					}
					// repeat the first line containing the vertical bar
					header = shortest[0] ;
					var toadd = longest.length - shortest.length ;
					for (var i = 0 ; i < toadd ; i++) {
						shortest.splice (0,0,header) ;
					}
				}
			
				// merge the left and right subtrees 
				for (var i = 0, l = Math.max (left_dendo.length , right_dendo.length) ; i < l ; i++) {
					var left = "" ;
					if (i < left_dendo.length)
						left = left_dendo[i] ;
					else
						left = repeatChar (" " , left_dendo[0].length) ;
		
					var right = "" ;
					if (i < right_dendo.length)
						right = right_dendo[i] ;
					else
						right = repeatChar (" " , right_dendo[0].length) ;
					lines.push(left + repeatChar (" " , sep) + right) ;	
					var l = left + repeatChar (" " , sep) + right ;
				}
			}
			
			return lines ;
		}
	
	
	
		function agglomerate (indexes, vectors, distance, linkage) {
			if (indexes.length == 1) {
			    return new Node (indexes[0], null, null, 0, vectors[0]) ;
			}
			var N = vectors.length ;
			var dMin = new Array(N) ;
			var cSize = new Array(N) ;
			var matrixObj = new figue.Matrix(N,N);
			var distMatrix = matrixObj.mtx ;
			var clusters = new Array(N) ;
	
			var c1, c2, c1Cluster, c2Cluster, i, j, p, root , newCentroid ;
	
			if (distance == figue.EUCLIDIAN_DISTANCE)
				distance = euclidianDistance ;
			else if (distance == figue.MANHATTAN_DISTANCE)
				distance = manhattanDistance ;
			else if (distance == figue.MAX_DISTANCE)
				distance = maxDistance ;
	
			// Initialize distance matrix and vector of closest clusters
			for (i = 0 ; i < N ; i++) {
				dMin[i] = 0 ;
				for (j = 0 ; j < N ; j++) {
					if (i == j)
						distMatrix[i][j] = Infinity ;
					else
						distMatrix[i][j] = distance(vectors[i] , vectors[j]) ;
		
					if (distMatrix[i][dMin[i]] > distMatrix[i][j] )
						dMin[i] = j ;
				}
			}
		
			// create leaves of the tree
			for (i = 0 ; i < N ; i++) {
				clusters[i] = [] ;
				clusters[i][0] = new Node (indexes[i], null, null, 0, vectors[i]) ;
				cSize[i] = 1 ;
			}
			
			// Main loop
			for (p = 0 ; p < N-1 ; p++) {
				// find the closest pair of clusters
				c1 = 0 ;
				for (i = 0 ; i < N ; i++) {
					if (distMatrix[i][dMin[i]] < distMatrix[c1][dMin[c1]])
						c1 = i ;
				}
				c2 = dMin[c1] ;
		
				// create node to store cluster info 
				c1Cluster = clusters[c1][0] ;
				c2Cluster = clusters[c2][0] ;
	
				newCentroid = calculateCentroid ( c1Cluster.size , c1Cluster.centroid , c2Cluster.size , c2Cluster.centroid ) ;
				newCluster = new Node (-1, c1Cluster, c2Cluster , distMatrix[c1][c2] , newCentroid) ;
				clusters[c1].splice(0,0, newCluster) ;
				cSize[c1] += cSize[c2] ;
			
				//Â overwriteÂ rowÂ c1Â with respect to the linkage type
				for (j = 0 ; j < N ; j++) {
					if (linkage == figue.SINGLE_LINKAGE) {
						if (distMatrix[c1][j] > distMatrix[c2][j])
							distMatrix[j][c1] = distMatrix[c1][j] = distMatrix[c2][j] ;
					} else if (linkage == figue.COMPLETE_LINKAGE) {
						if (distMatrix[c1][j] < distMatrix[c2][j])
							distMatrix[j][c1] = distMatrix[c1][j] = distMatrix[c2][j] ;
					} else if (linkage == figue.AVERAGE_LINKAGE) {
						var avg = ( cSize[c1] * distMatrix[c1][j] + cSize[c2] * distMatrix[c2][j])  / (cSize[c1] + cSize[j]) 
						distMatrix[j][c1] = distMatrix[c1][j] = avg ;
					}
				}
				distMatrix[c1][c1] = Infinity ;
			
				//Â infinity Â­outÂ oldÂ rowÂ c2Â andÂ columnÂ c2
				for (i = 0 ; i < N ; i++)
					distMatrix[i][c2] = distMatrix[c2][i] = Infinity ;
		
				//Â updateÂ dminÂ andÂ replaceÂ onesÂ thatÂ previousÂ pointedÂ to c2 to point to c1
				for (j = 0; j < N ; j++) {
					if (dMin[j] == c2)
						dMin[j] = c1;
					if (distMatrix[c1][j] < distMatrix[c1][dMin[c1]]) 
						dMin[c1] = j;
				}
		
				// keep track of the last added cluster
				root = newCluster ;
			}
		
			return root ;
		}
	
	
		function kmeans (k, vectors) {
			var n = vectors.length ;
			if ( k > n ) 
				return null ;
	
			// randomly choose k different vectors among n entries
			var centroids = new Array(k) ;
			var tested_indices = new Object ;
			var tested = 0 ;
			var cluster = 0 ;
			var i , vector, select ;
			while (cluster < k) {
				if (tested == n)
					return null ;
	
				var random_index = Math.floor(Math.random()*(n)) ;
				if (random_index in tested_indices)
					continue
				tested_indices[random_index] = 1;
				tested++ ;
				vector = vectors[random_index] ;
				select = true ;
				for (i = 0 ; i < cluster ; i++) {
					if ( utils.compare (vector, centroids[i]) ) {
						select = false ;
						break ;
					}
				}
				if (select) {
					centroids[cluster] = vector ;
					cluster++ ;
				}
			}
		
			var assignments = new Array(n) ;
			var clusterSizes = new Array(k) ;
			var repeat = true ;
			var nb_iters = 0 ;
			while (repeat) {
	
				// assignment step
				for (var j = 0 ; j < k ; j++)
					clusterSizes[j] = 0 ;
				
				for (var i = 0 ; i < n ; i++) {
					var vector = vectors[i] ;
					var mindist = Number.MAX_VALUE ;
					var best ;
					for (var j = 0 ; j < k ; j++) {
						dist = euclidianDistance (centroids[j], vector)
						if (dist < mindist) {
							mindist = dist ;
							best = j ;
						}
					}
					clusterSizes[best]++ ;
					assignments[i] = best ;
				}
				
				// update centroids step
				var newCentroids = new Array(k) ;
				for (var j = 0 ; j < k ; j++)
					newCentroids[j] = null ;
	
				for (var i = 0 ; i < n ; i++) {
					cluster = assignments[i] ;
					if (newCentroids[cluster] == null)
						newCentroids[cluster] = vectors[i] ;
					else
						newCentroids[cluster] = addVectors (newCentroids[cluster] , vectors[i]) ;	
				}
	
				for (var j = 0 ; j < k ; j++) {
					newCentroids[j] = multiplyVectorByValue (1/clusterSizes[j] , newCentroids[j]) ;
				}	
				
				// check convergence
				repeat = false ;
				for (var j = 0 ; j < k ; j++) {
					if (! utils.compare (newCentroids[j], centroids[j])) {
						repeat = true ; 
						break ; 
					}
				}
				centroids = newCentroids ;
				nb_iters++ ;
				if (nb_iters > figue.KMEANS_MAX_ITERATIONS)
					repeat = false ;
				
			}
			return { 'centroids': centroids , 'assignments': assignments} ;
	
		}
	
		function Matrix (rows,cols) 
		{
			this.rows = rows ;
			this.cols = cols ;
			this.mtx = new Array(rows) ; 
	
			for (var i = 0 ; i < rows ; i++)
			{
				var row = new Array(cols) ;
				for (var j = 0 ; j < cols ; j++)
					row[j] = 0;
				this.mtx[i] = row ;
			}
		}
	
		function Node (index,left,right,dist, centroid) 
		{
			this.index = index ;
			this.indexes = [];
			if (index != -1) {
				this.indexes.push(index);
			}
			this.left = left ;
			this.right = right ;
			this.dist = dist ;
			this.centroid = centroid ;
			if (left == null && right == null) {
				this.size = 1 ;
				this.depth = 0 ;
			} else {
				this.size = left.size + right.size ;
				this.depth = 1 + Math.max (left.depth , right.depth ) ;
				this.indexes = this.indexes.concat(left.indexes).concat(right.indexes);
			}
		}
	
	
	
		return { 
			SINGLE_LINKAGE: 0,
			COMPLETE_LINKAGE: 1,
			AVERAGE_LINKAGE:2 ,
			EUCLIDIAN_DISTANCE: 0,
			MANHATTAN_DISTANCE: 1,
			MAX_DISTANCE: 2,
			PRINT_VECTOR_VALUE_PRECISION: 2,
			KMEANS_MAX_ITERATIONS: 10,
	
			Matrix: Matrix,
			Node: Node,
			generateDendogram: generateDendogram,
			agglomerate: agglomerate,
			kmeans: kmeans
		}
	}() ;
	
	
	figue.Matrix.prototype.toString = function() 
	{
		var lines = [] ;
		for (var i = 0 ; i < this.rows ; i++) 
			lines.push (this.mtx[i].join("\t")) ;
		return lines.join ("\n") ;
	}
	
	figue.Node.prototype.isLeaf = function() 
	{
		if ((this.left == null) && (this.right == null))
			return true ;
		else
			return false ;
	}
	
	figue.Node.prototype.buildDendogram = function (sep, balanced,withIndex,withCentroid, withDistance)
	{
		lines = figue.generateDendogram(this, sep, balanced,withIndex,withCentroid, withDistance) ;
		return lines.join ("\n") ;	
	}
	
	module.exports = figue;
	
	
	
	


/***/ },
/* 26 */
/*!************************!*\
  !*** ./class/utils.js ***!
  \************************/
/***/ function(module, exports, __webpack_require__) {

	//LatLng object
	var LatLng = function (lat, lng) {
		this.lat = parseFloat(lat);
		this.lng = parseFloat(lng);
	}
	module.exports.LatLng = LatLng;
	
	//Point object
	var Point = function (x, y) {
		this.x = x;
		this.y = y;
	}
	module.exports.Point = Point;
	
	//LatLngBounds object
	var LatLngBounds = function (sw, ne) {
		this._sw = sw;
		this._ne = ne;
	}
	LatLngBounds.prototype.extend = function(point) {
		if (point.lat < this._sw.lat && point.lng < this._sw.lng) {
			this._sw = point;
		} else if (point.lat < this._sw.lat) {
			this._sw = new LatLng(point.lat, this._sw.lng);
		} else if (point.lng < this._sw.lng) {
			this._sw = new LatLng(this._sw.lat, point.lng);
		}
		if (point.lat > this._ne.lat && point.lng > this._ne.lng) {
			this._ne = point;
		} else if (point.lat > this._ne.lat) {
			this._ne = new LatLng(point.lat, this._ne.lng);
		} else if (point.lng > this._ne.lng) {
			this._ne = new LatLng(this._ne.lat, point.lng);
		}
		return this;
	};
	LatLngBounds.prototype.getNorthEast = function() {
		return this._ne;
	}
	LatLngBounds.prototype.getSouthWest = function() {
		return this._sw;
	}
	LatLngBounds.prototype.contains = function(point) {
		if (point.lat > this._sw.lat && point.lat < this._ne.lat && point.lng > this._sw.lng && point.lng < this._ne.lng) {
			return true;
		}
		return false;
	}
	module.exports.LatLngBounds = LatLngBounds;
	
	//Binary safe string comparison
	//from http://phpjs.org/functions/strcmp/
	var strcmp = function (str1, str2) {
	    return ((str1 == str2) ? 0 : ((str1 > str2) ? 1 : -1));
	}
	
	//Returns the result of string comparison using 'natural' algorithm
	//from http://phpjs.org/functions/strnatcmp/
	var strnatcmp = function (f_string1, f_string2, f_version) {
	    var i = 0;
	 
	    if (f_version == undefined) {
	        f_version = false;
	    }
	 
	    var __strnatcmp_split = function (f_string) {
	        var result = [];
	        var buffer = '';
	        var chr = '';
	        var i = 0,
	            f_stringl = 0;
	 
	        var text = true;
	 
	        f_stringl = f_string.length;
	        for (i = 0; i < f_stringl; i++) {
	            chr = f_string.substring(i, i + 1);
	            if (chr.match(/\d/)) {
	                if (text) {
	                    if (buffer.length > 0) {
	                        result[result.length] = buffer;
	                        buffer = '';
	                    }
	 
	                    text = false;
	                }
	                buffer += chr;
	            } else if ((text == false) && (chr == '.') && (i < (f_string.length - 1)) && (f_string.substring(i + 1, i + 2).match(/\d/))) {
	                result[result.length] = buffer;
	                buffer = '';
	            } else {
	                if (text == false) {
	                    if (buffer.length > 0) {
	                        result[result.length] = parseInt(buffer, 10);
	                        buffer = '';
	                    }
	                    text = true;
	                }
	                buffer += chr;
	            }
	        }
	 
	        if (buffer.length > 0) {
	            if (text) {
	                result[result.length] = buffer;
	            } else {
	                result[result.length] = parseInt(buffer, 10);
	            }
	        }
	 
	        return result;
	    };
	 
	    var array1 = __strnatcmp_split(f_string1 + '');
	    var array2 = __strnatcmp_split(f_string2 + '');
	 
	    var len = array1.length;
	    var text = true;
	 
	    var result = -1;
	    var r = 0;
	 
	    if (len > array2.length) {
	        len = array2.length;
	        result = 1;
	    }
	 
	    for (i = 0; i < len; i++) {
	        if (isNaN(array1[i])) {
	            if (isNaN(array2[i])) {
	                text = true;
	 
	                if ((r = strcmp(array1[i], array2[i])) != 0) {
	                    return r;
	                }
	            } else if (text) {
	                return 1;
	            } else {
	                return -1;
	            }
	        } else if (isNaN(array2[i])) {
	            if (text) {
	                return -1;
	            } else {
	                return 1;
	            }
	        } else {
	            if (text || f_version) {
	                if ((r = (array1[i] - array2[i])) != 0) {
	                    return r;
	                }
	            } else {
	                if ((r = strcmp(array1[i].toString(), array2[i].toString())) != 0) {
	                    return r;
	                }
	            }
	 
	            text = false;
	        }
	    }
	 
	    return result;
	}
	
	//natsort from : http://phpjs.org/functions/natsort/
	var natsort = function (inputArr) {
	    var valArr = [],
	        k, i, ret, that = this,
	        strictForIn = false,
	        populateArr = {};
	 
	    // BEGIN REDUNDANT
	    this.php_js = this.php_js || {};
	    this.php_js.ini = this.php_js.ini || {};
	    // END REDUNDANT
	    strictForIn = this.php_js.ini['phpjs.strictForIn'] && this.php_js.ini['phpjs.strictForIn'].local_value && this.php_js.ini['phpjs.strictForIn'].local_value !== 'off';
	    populateArr = strictForIn ? inputArr : populateArr;
	 
	    // Get key and value arrays
	    for (k in inputArr) {
	        if (inputArr.hasOwnProperty(k)) {
	            valArr.push([k, inputArr[k]]);
	            if (strictForIn) {
	                delete inputArr[k];
	            }
	        }
	    }
	    valArr.sort(function (a, b) {
	        return strnatcmp(a[1], b[1]);
	    });
	 
	    // Repopulate the old array
	    for (i = 0; i < valArr.length; i++) {
	        populateArr[valArr[i][0]] = valArr[i][1];
	    }
	 
	    return strictForIn || populateArr;
	}
	module.exports.natsort = natsort;
	
	var compare = function (fromArray, testArr) {
	    if (fromArray.length != testArr.length) return false;
	    for (var i = 0, l = testArr.length; i < l; i++) {
	        if (typeof(fromArray[i]) == 'object' && (fromArray[i] instanceof Array)) { 
	            if (!utils.compare(fromArray[i], testArr[i])) return false;
	        }
	        if (fromArray[i] !== testArr[i]) return false;
	    }
	    return true;
	}
	module.exports.compare = compare;
	
	//Strip tags from : http://phpjs.org/functions/strip_tags/
	var strip_tags = function (input, allowed) {
	  allowed = (((allowed || "") + "").toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join(''); // making sure the allowed arg is a string containing only tags in lowercase (<a><b><c>)
	  var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,
	    commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
	  return input.replace(commentsAndPhpTags, '').replace(tags, function ($0, $1) {
	    return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
	  });
	}
	module.exports.strip_tags = strip_tags;
	
	var indexOf = function(r, elt /*, from*/) {
	    r = r || [];
	    var len = r.length >>> 0;
	
	    var from = Number(arguments[1]) || 0;
	    from = (from < 0)
	         ? Math.ceil(from)
	         : Math.floor(from);
	    if (from < 0)
	      from += len;
	
	    for (; from < len; from++) {
	      if (from in r &&
	          r[from] === elt)
	        return from;
	    }
	    return -1;
	};
	module.exports.indexOf = indexOf;
	
	//Mobile web formating functions
	var formatDate = function(date, format) {
	    format = format || 'short';
	
	    var locale = Ti.Platform.getLocale().getCurrentLocale().substr(0, 2).toLowerCase();
	    if (format == 'short') {
	        if (locale == 'fr') {
	            return (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) +'/'+ ((date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)) +'/'+ date.getFullYear();
	        } else {
	            return ((date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)) +'/'+ (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) +'/'+ date.getFullYear();
	        }
	    } else {
	        var months = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
	        if (locale == 'fr') {
	            return date.getDate() +' '+ L(months[date.getMonth()]) +' '+ date.getFullYear();
	        } else {
	            return L(months[date.getMonth()]) +' '+ date.getDate() +', '+ date.getFullYear();
	        }
	    }
	};
	var formatTime = function(date, format) {
	    format = format || 'short';
	
	    var locale = Ti.Platform.getLocale().getCurrentLocale().substr(0, 2).toLowerCase();
	    if (locale == 'fr') {
	        return  (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) +':'+ (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
	    } else {
	        var hours = date.getHours();
	        if (hours > 12) {
	            return  ((hours - 12) < 10 ? '0' + (hours - 12) : (hours - 12)) +':'+ (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) +' PM';
	        } else {
	            return  (hours < 10 ? '0' + hours : hours) +':'+ (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) +' AM';
	        }
	    }
	};
	//format text for mobile web
	var formatText = function (text) {
	    //replace \n by <br />
	    text = text.replace(/\n*/g, '').replace(/\\n/g, '<br />');
	    //convert links
	    var twitter = __webpack_require__(/*! ../../libs/twitter-text */ 27);
	    var entities = twitter.extractUrlsWithIndices(text);
	    var pos = 0;
	    var textContent = '';
	    for (var i = 0, l = entities.length; i < l; i++) {
	        var url = entities[i].url;
	        var indices = entities[i].indices;
	        //text before entity
	        textContent += text.substr(pos, indices[0] - pos);
	        //entity
	        textContent += '<a href="'+ url +'" target="_blank" style="color:#2B9D48;">' + url + '</a>';
	        pos = indices[1];
	    }
	    if (pos != text.length) {
	        //text after entities
	        textContent += text.substr(pos, text.length - pos);
	    }
	    return textContent;
	}
	module.exports.formatTime = formatTime;
	module.exports.formatDate = formatDate;
	module.exports.formatText = formatText;

/***/ },
/* 27 */
/*!*******************************!*\
  !*** ../libs/twitter-text.js ***!
  \*******************************/
/***/ function(module, exports) {

	if (typeof window === "undefined" || window === null) {
	  window = { twttr: {} };
	}
	if (window.twttr == null) {
	  window.twttr = {};
	}
	if (typeof twttr === "undefined" || twttr === null) {
	  twttr = {};
	}
	
	(function() {
	  twttr.txt = {};
	  twttr.txt.regexen = {};
	
	  var HTML_ENTITIES = {
	    '&': '&amp;',
	    '>': '&gt;',
	    '<': '&lt;',
	    '"': '&quot;',
	    "'": '&#39;'
	  };
	
	  // HTML escaping
	  twttr.txt.htmlEscape = function(text) {
	    return text && text.replace(/[&"'><]/g, function(character) {
	      return HTML_ENTITIES[character];
	    });
	  };
	
	  // Builds a RegExp
	  function regexSupplant(regex, flags) {
	    flags = flags || "";
	    if (typeof regex !== "string") {
	      if (regex.global && flags.indexOf("g") < 0) {
	        flags += "g";
	      }
	      if (regex.ignoreCase && flags.indexOf("i") < 0) {
	        flags += "i";
	      }
	      if (regex.multiline && flags.indexOf("m") < 0) {
	        flags += "m";
	      }
	
	      regex = regex.source;
	    }
	
	    return new RegExp(regex.replace(/#\{(\w+)\}/g, function(match, name) {
	      var newRegex = twttr.txt.regexen[name] || "";
	      if (typeof newRegex !== "string") {
	        newRegex = newRegex.source;
	      }
	      return newRegex;
	    }), flags);
	  }
	
	  twttr.txt.regexSupplant = regexSupplant;
	
	  // simple string interpolation
	  function stringSupplant(str, values) {
	    return str.replace(/#\{(\w+)\}/g, function(match, name) {
	      return values[name] || "";
	    });
	  }
	
	  twttr.txt.stringSupplant = stringSupplant;
	
	  function addCharsToCharClass(charClass, start, end) {
	    var s = String.fromCharCode(start);
	    if (end !== start) {
	      s += "-" + String.fromCharCode(end);
	    }
	    charClass.push(s);
	    return charClass;
	  }
	
	  twttr.txt.addCharsToCharClass = addCharsToCharClass;
	
	  // Space is more than %20, U+3000 for example is the full-width space used with Kanji. Provide a short-hand
	  // to access both the list of characters and a pattern suitible for use with String#split
	  // Taken from: ActiveSupport::Multibyte::Handlers::UTF8Handler::UNICODE_WHITESPACE
	  var fromCode = String.fromCharCode;
	  var UNICODE_SPACES = [
	    fromCode(0x0020), // White_Space # Zs       SPACE
	    fromCode(0x0085), // White_Space # Cc       <control-0085>
	    fromCode(0x00A0), // White_Space # Zs       NO-BREAK SPACE
	    fromCode(0x1680), // White_Space # Zs       OGHAM SPACE MARK
	    fromCode(0x180E), // White_Space # Zs       MONGOLIAN VOWEL SEPARATOR
	    fromCode(0x2028), // White_Space # Zl       LINE SEPARATOR
	    fromCode(0x2029), // White_Space # Zp       PARAGRAPH SEPARATOR
	    fromCode(0x202F), // White_Space # Zs       NARROW NO-BREAK SPACE
	    fromCode(0x205F), // White_Space # Zs       MEDIUM MATHEMATICAL SPACE
	    fromCode(0x3000)  // White_Space # Zs       IDEOGRAPHIC SPACE
	  ];
	  addCharsToCharClass(UNICODE_SPACES, 0x009, 0x00D); // White_Space # Cc   [5] <control-0009>..<control-000D>
	  addCharsToCharClass(UNICODE_SPACES, 0x2000, 0x200A); // White_Space # Zs  [11] EN QUAD..HAIR SPACE
	
	  var INVALID_CHARS = [
	    fromCode(0xFFFE),
	    fromCode(0xFEFF), // BOM
	    fromCode(0xFFFF) // Special
	  ];
	  addCharsToCharClass(INVALID_CHARS, 0x202A, 0x202E); // Directional change
	
	  twttr.txt.regexen.spaces_group = regexSupplant(UNICODE_SPACES.join(""));
	  twttr.txt.regexen.spaces = regexSupplant("[" + UNICODE_SPACES.join("") + "]");
	  twttr.txt.regexen.invalid_chars_group = regexSupplant(INVALID_CHARS.join(""));
	  twttr.txt.regexen.punct = /\!'#%&'\(\)*\+,\\\-\.\/:;<=>\?@\[\]\^_{|}~\$/;
	
	  var nonLatinHashtagChars = [];
	  // Cyrillic
	  addCharsToCharClass(nonLatinHashtagChars, 0x0400, 0x04ff); // Cyrillic
	  addCharsToCharClass(nonLatinHashtagChars, 0x0500, 0x0527); // Cyrillic Supplement
	  addCharsToCharClass(nonLatinHashtagChars, 0x2de0, 0x2dff); // Cyrillic Extended A
	  addCharsToCharClass(nonLatinHashtagChars, 0xa640, 0xa69f); // Cyrillic Extended B
	  // Hebrew
	  addCharsToCharClass(nonLatinHashtagChars, 0x0591, 0x05bf); // Hebrew
	  addCharsToCharClass(nonLatinHashtagChars, 0x05c1, 0x05c2);
	  addCharsToCharClass(nonLatinHashtagChars, 0x05c4, 0x05c5);
	  addCharsToCharClass(nonLatinHashtagChars, 0x05c7, 0x05c7);
	  addCharsToCharClass(nonLatinHashtagChars, 0x05d0, 0x05ea);
	  addCharsToCharClass(nonLatinHashtagChars, 0x05f0, 0x05f4);
	  addCharsToCharClass(nonLatinHashtagChars, 0xfb12, 0xfb28); // Hebrew Presentation Forms
	  addCharsToCharClass(nonLatinHashtagChars, 0xfb2a, 0xfb36);
	  addCharsToCharClass(nonLatinHashtagChars, 0xfb38, 0xfb3c);
	  addCharsToCharClass(nonLatinHashtagChars, 0xfb3e, 0xfb3e);
	  addCharsToCharClass(nonLatinHashtagChars, 0xfb40, 0xfb41);
	  addCharsToCharClass(nonLatinHashtagChars, 0xfb43, 0xfb44);
	  addCharsToCharClass(nonLatinHashtagChars, 0xfb46, 0xfb4f);
	  // Arabic
	  addCharsToCharClass(nonLatinHashtagChars, 0x0610, 0x061a); // Arabic
	  addCharsToCharClass(nonLatinHashtagChars, 0x0620, 0x065f);
	  addCharsToCharClass(nonLatinHashtagChars, 0x066e, 0x06d3);
	  addCharsToCharClass(nonLatinHashtagChars, 0x06d5, 0x06dc);
	  addCharsToCharClass(nonLatinHashtagChars, 0x06de, 0x06e8);
	  addCharsToCharClass(nonLatinHashtagChars, 0x06ea, 0x06ef);
	  addCharsToCharClass(nonLatinHashtagChars, 0x06fa, 0x06fc);
	  addCharsToCharClass(nonLatinHashtagChars, 0x06ff, 0x06ff);
	  addCharsToCharClass(nonLatinHashtagChars, 0x0750, 0x077f); // Arabic Supplement
	  addCharsToCharClass(nonLatinHashtagChars, 0x08a0, 0x08a0); // Arabic Extended A
	  addCharsToCharClass(nonLatinHashtagChars, 0x08a2, 0x08ac);
	  addCharsToCharClass(nonLatinHashtagChars, 0x08e4, 0x08fe);
	  addCharsToCharClass(nonLatinHashtagChars, 0xfb50, 0xfbb1); // Arabic Pres. Forms A
	  addCharsToCharClass(nonLatinHashtagChars, 0xfbd3, 0xfd3d);
	  addCharsToCharClass(nonLatinHashtagChars, 0xfd50, 0xfd8f);
	  addCharsToCharClass(nonLatinHashtagChars, 0xfd92, 0xfdc7);
	  addCharsToCharClass(nonLatinHashtagChars, 0xfdf0, 0xfdfb);
	  addCharsToCharClass(nonLatinHashtagChars, 0xfe70, 0xfe74); // Arabic Pres. Forms B
	  addCharsToCharClass(nonLatinHashtagChars, 0xfe76, 0xfefc);
	  addCharsToCharClass(nonLatinHashtagChars, 0x200c, 0x200c); // Zero-Width Non-Joiner
	  // Thai
	  addCharsToCharClass(nonLatinHashtagChars, 0x0e01, 0x0e3a);
	  addCharsToCharClass(nonLatinHashtagChars, 0x0e40, 0x0e4e);
	  // Hangul (Korean)
	  addCharsToCharClass(nonLatinHashtagChars, 0x1100, 0x11ff); // Hangul Jamo
	  addCharsToCharClass(nonLatinHashtagChars, 0x3130, 0x3185); // Hangul Compatibility Jamo
	  addCharsToCharClass(nonLatinHashtagChars, 0xA960, 0xA97F); // Hangul Jamo Extended-A
	  addCharsToCharClass(nonLatinHashtagChars, 0xAC00, 0xD7AF); // Hangul Syllables
	  addCharsToCharClass(nonLatinHashtagChars, 0xD7B0, 0xD7FF); // Hangul Jamo Extended-B
	  addCharsToCharClass(nonLatinHashtagChars, 0xFFA1, 0xFFDC); // half-width Hangul
	  // Japanese and Chinese
	  addCharsToCharClass(nonLatinHashtagChars, 0x30A1, 0x30FA); // Katakana (full-width)
	  addCharsToCharClass(nonLatinHashtagChars, 0x30FC, 0x30FE); // Katakana Chouon and iteration marks (full-width)
	  addCharsToCharClass(nonLatinHashtagChars, 0xFF66, 0xFF9F); // Katakana (half-width)
	  addCharsToCharClass(nonLatinHashtagChars, 0xFF70, 0xFF70); // Katakana Chouon (half-width)
	  addCharsToCharClass(nonLatinHashtagChars, 0xFF10, 0xFF19); // \
	  addCharsToCharClass(nonLatinHashtagChars, 0xFF21, 0xFF3A); //  - Latin (full-width)
	  addCharsToCharClass(nonLatinHashtagChars, 0xFF41, 0xFF5A); // /
	  addCharsToCharClass(nonLatinHashtagChars, 0x3041, 0x3096); // Hiragana
	  addCharsToCharClass(nonLatinHashtagChars, 0x3099, 0x309E); // Hiragana voicing and iteration mark
	  addCharsToCharClass(nonLatinHashtagChars, 0x3400, 0x4DBF); // Kanji (CJK Extension A)
	  addCharsToCharClass(nonLatinHashtagChars, 0x4E00, 0x9FFF); // Kanji (Unified)
	  // -- Disabled as it breaks the Regex.
	  //addCharsToCharClass(nonLatinHashtagChars, 0x20000, 0x2A6DF); // Kanji (CJK Extension B)
	  addCharsToCharClass(nonLatinHashtagChars, 0x2A700, 0x2B73F); // Kanji (CJK Extension C)
	  addCharsToCharClass(nonLatinHashtagChars, 0x2B740, 0x2B81F); // Kanji (CJK Extension D)
	  addCharsToCharClass(nonLatinHashtagChars, 0x2F800, 0x2FA1F); // Kanji (CJK supplement)
	  addCharsToCharClass(nonLatinHashtagChars, 0x3003, 0x3003); // Kanji iteration mark
	  addCharsToCharClass(nonLatinHashtagChars, 0x3005, 0x3005); // Kanji iteration mark
	  addCharsToCharClass(nonLatinHashtagChars, 0x303B, 0x303B); // Han iteration mark
	
	  twttr.txt.regexen.nonLatinHashtagChars = regexSupplant(nonLatinHashtagChars.join(""));
	
	  var latinAccentChars = [];
	  // Latin accented characters (subtracted 0xD7 from the range, it's a confusable multiplication sign. Looks like "x")
	  addCharsToCharClass(latinAccentChars, 0x00c0, 0x00d6);
	  addCharsToCharClass(latinAccentChars, 0x00d8, 0x00f6);
	  addCharsToCharClass(latinAccentChars, 0x00f8, 0x00ff);
	  // Latin Extended A and B
	  addCharsToCharClass(latinAccentChars, 0x0100, 0x024f);
	  // assorted IPA Extensions
	  addCharsToCharClass(latinAccentChars, 0x0253, 0x0254);
	  addCharsToCharClass(latinAccentChars, 0x0256, 0x0257);
	  addCharsToCharClass(latinAccentChars, 0x0259, 0x0259);
	  addCharsToCharClass(latinAccentChars, 0x025b, 0x025b);
	  addCharsToCharClass(latinAccentChars, 0x0263, 0x0263);
	  addCharsToCharClass(latinAccentChars, 0x0268, 0x0268);
	  addCharsToCharClass(latinAccentChars, 0x026f, 0x026f);
	  addCharsToCharClass(latinAccentChars, 0x0272, 0x0272);
	  addCharsToCharClass(latinAccentChars, 0x0289, 0x0289);
	  addCharsToCharClass(latinAccentChars, 0x028b, 0x028b);
	  // Okina for Hawaiian (it *is* a letter character)
	  addCharsToCharClass(latinAccentChars, 0x02bb, 0x02bb);
	  // Combining diacritics
	  addCharsToCharClass(latinAccentChars, 0x0300, 0x036f);
	  // Latin Extended Additional
	  addCharsToCharClass(latinAccentChars, 0x1e00, 0x1eff);
	  twttr.txt.regexen.latinAccentChars = regexSupplant(latinAccentChars.join(""));
	
	  // A hashtag must contain characters, numbers and underscores, but not all numbers.
	  twttr.txt.regexen.hashSigns = /[#＃]/;
	  twttr.txt.regexen.hashtagAlpha = regexSupplant(/[a-z_#{latinAccentChars}#{nonLatinHashtagChars}]/i);
	  twttr.txt.regexen.hashtagAlphaNumeric = regexSupplant(/[a-z0-9_#{latinAccentChars}#{nonLatinHashtagChars}]/i);
	  twttr.txt.regexen.endHashtagMatch = regexSupplant(/^(?:#{hashSigns}|:\/\/)/);
	  twttr.txt.regexen.hashtagBoundary = regexSupplant(/(?:^|$|[^&a-z0-9_#{latinAccentChars}#{nonLatinHashtagChars}])/);
	  twttr.txt.regexen.validHashtag = regexSupplant(/(#{hashtagBoundary})(#{hashSigns})(#{hashtagAlphaNumeric}*#{hashtagAlpha}#{hashtagAlphaNumeric}*)/gi);
	
	  // Mention related regex collection
	  twttr.txt.regexen.validMentionPrecedingChars = /(?:^|[^a-zA-Z0-9_!#$%&*@＠]|RT:?)/;
	  twttr.txt.regexen.atSigns = /[@＠]/;
	  twttr.txt.regexen.validMentionOrList = regexSupplant(
	    '(#{validMentionPrecedingChars})' +  // $1: Preceding character
	    '(#{atSigns})' +                     // $2: At mark
	    '([a-zA-Z0-9_]{1,20})' +             // $3: Screen name
	    '(\/[a-zA-Z][a-zA-Z0-9_\-]{0,24})?'  // $4: List (optional)
	  , 'g');
	  twttr.txt.regexen.validReply = regexSupplant(/^(?:#{spaces})*#{atSigns}([a-zA-Z0-9_]{1,20})/);
	  twttr.txt.regexen.endMentionMatch = regexSupplant(/^(?:#{atSigns}|[#{latinAccentChars}]|:\/\/)/);
	
	  // URL related regex collection
	  twttr.txt.regexen.validUrlPrecedingChars = regexSupplant(/(?:[^A-Za-z0-9@＠$#＃#{invalid_chars_group}]|^)/);
	  twttr.txt.regexen.invalidUrlWithoutProtocolPrecedingChars = /[-_.\/]$/;
	  twttr.txt.regexen.invalidDomainChars = stringSupplant("#{punct}#{spaces_group}#{invalid_chars_group}", twttr.txt.regexen);
	  twttr.txt.regexen.validDomainChars = regexSupplant(/[^#{invalidDomainChars}]/);
	  twttr.txt.regexen.validSubdomain = regexSupplant(/(?:(?:#{validDomainChars}(?:[_-]|#{validDomainChars})*)?#{validDomainChars}\.)/);
	  twttr.txt.regexen.validDomainName = regexSupplant(/(?:(?:#{validDomainChars}(?:-|#{validDomainChars})*)?#{validDomainChars}\.)/);
	  twttr.txt.regexen.validGTLD = regexSupplant(/(?:(?:aero|asia|biz|cat|com|coop|edu|gov|info|int|jobs|mil|mobi|museum|name|net|org|pro|tel|travel|xxx)(?=[^0-9a-zA-Z]|$))/);
	  twttr.txt.regexen.validCCTLD = regexSupplant(/(?:(?:ac|ad|ae|af|ag|ai|al|am|an|ao|aq|ar|as|at|au|aw|ax|az|ba|bb|bd|be|bf|bg|bh|bi|bj|bm|bn|bo|br|bs|bt|bv|bw|by|bz|ca|cc|cd|cf|cg|ch|ci|ck|cl|cm|cn|co|cr|cs|cu|cv|cx|cy|cz|dd|de|dj|dk|dm|do|dz|ec|ee|eg|eh|er|es|et|eu|fi|fj|fk|fm|fo|fr|ga|gb|gd|ge|gf|gg|gh|gi|gl|gm|gn|gp|gq|gr|gs|gt|gu|gw|gy|hk|hm|hn|hr|ht|hu|id|ie|il|im|in|io|iq|ir|is|it|je|jm|jo|jp|ke|kg|kh|ki|km|kn|kp|kr|kw|ky|kz|la|lb|lc|li|lk|lr|ls|lt|lu|lv|ly|ma|mc|md|me|mg|mh|mk|ml|mm|mn|mo|mp|mq|mr|ms|mt|mu|mv|mw|mx|my|mz|na|nc|ne|nf|ng|ni|nl|no|np|nr|nu|nz|om|pa|pe|pf|pg|ph|pk|pl|pm|pn|pr|ps|pt|pw|py|qa|re|ro|rs|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sj|sk|sl|sm|sn|so|sr|ss|st|su|sv|sy|sz|tc|td|tf|tg|th|tj|tk|tl|tm|tn|to|tp|tr|tt|tv|tw|tz|ua|ug|uk|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|ye|yt|za|zm|zw)(?=[^0-9a-zA-Z]|$))/);
	  twttr.txt.regexen.validPunycode = regexSupplant(/(?:xn--[0-9a-z]+)/);
	  twttr.txt.regexen.validDomain = regexSupplant(/(?:#{validSubdomain}*#{validDomainName}(?:#{validGTLD}|#{validCCTLD}|#{validPunycode}))/);
	  twttr.txt.regexen.validAsciiDomain = regexSupplant(/(?:(?:[a-z0-9#{latinAccentChars}]+)\.)+(?:#{validGTLD}|#{validCCTLD}|#{validPunycode})/gi);
	  twttr.txt.regexen.invalidShortDomain = regexSupplant(/^#{validDomainName}#{validCCTLD}$/);
	
	  twttr.txt.regexen.validPortNumber = regexSupplant(/[0-9]+/);
	
	  twttr.txt.regexen.validGeneralUrlPathChars = regexSupplant(/[a-z0-9!\*';:=\+,\.\$\/%#\[\]\-_~|&#{latinAccentChars}]/i);
	  // Allow URL paths to contain balanced parens
	  //  1. Used in Wikipedia URLs like /Primer_(film)
	  //  2. Used in IIS sessions like /S(dfd346)/
	  twttr.txt.regexen.validUrlBalancedParens = regexSupplant(/\(#{validGeneralUrlPathChars}+\)/i);
	  // Valid end-of-path chracters (so /foo. does not gobble the period).
	  // 1. Allow =&# for empty URL parameters and other URL-join artifacts
	  twttr.txt.regexen.validUrlPathEndingChars = regexSupplant(/[\+\-a-z0-9=_#\/#{latinAccentChars}]|(?:#{validUrlBalancedParens})/i);
	  // Allow @ in a url, but only in the middle. Catch things like http://example.com/@user/
	  twttr.txt.regexen.validUrlPath = regexSupplant('(?:' +
	    '(?:' +
	      '#{validGeneralUrlPathChars}*' +
	        '(?:#{validUrlBalancedParens}#{validGeneralUrlPathChars}*)*' +
	        '#{validUrlPathEndingChars}'+
	      ')|(?:@#{validGeneralUrlPathChars}+\/)'+
	    ')', 'i');
	
	  twttr.txt.regexen.validUrlQueryChars = /[a-z0-9!?\*'\(\);:&=\+\$\/%#\[\]\-_\.,~|]/i;
	  twttr.txt.regexen.validUrlQueryEndingChars = /[a-z0-9_&=#\/]/i;
	  twttr.txt.regexen.extractUrl = regexSupplant(
	    '('                                                            + // $1 total match
	      '(#{validUrlPrecedingChars})'                                + // $2 Preceeding chracter
	      '('                                                          + // $3 URL
	        '(https?:\\/\\/)?'                                         + // $4 Protocol (optional)
	        '(#{validDomain})'                                         + // $5 Domain(s)
	        '(?::(#{validPortNumber}))?'                               + // $6 Port number (optional)
	        '(\\/#{validUrlPath}*)?'                                   + // $7 URL Path
	        '(\\?#{validUrlQueryChars}*#{validUrlQueryEndingChars})?'  + // $8 Query String
	      ')'                                                          +
	    ')'
	  , 'gi');
	
	  twttr.txt.regexen.validTcoUrl = /^https?:\/\/t\.co\/[a-z0-9]+/i;
	
	  // cashtag related regex
	  twttr.txt.regexen.cashtag = /[a-z]{1,6}(?:[._][a-z]{1,2})?/i;
	  twttr.txt.regexen.validCashtag = regexSupplant('(^|#{spaces})(\\$)(#{cashtag})(?=$|\\s|[#{punct}])', 'gi');
	
	  // These URL validation pattern strings are based on the ABNF from RFC 3986
	  twttr.txt.regexen.validateUrlUnreserved = /[a-z0-9\-._~]/i;
	  twttr.txt.regexen.validateUrlPctEncoded = /(?:%[0-9a-f]{2})/i;
	  twttr.txt.regexen.validateUrlSubDelims = /[!$&'()*+,;=]/i;
	  twttr.txt.regexen.validateUrlPchar = regexSupplant('(?:' +
	    '#{validateUrlUnreserved}|' +
	    '#{validateUrlPctEncoded}|' +
	    '#{validateUrlSubDelims}|' +
	    '[:|@]' +
	  ')', 'i');
	
	  twttr.txt.regexen.validateUrlScheme = /(?:[a-z][a-z0-9+\-.]*)/i;
	  twttr.txt.regexen.validateUrlUserinfo = regexSupplant('(?:' +
	    '#{validateUrlUnreserved}|' +
	    '#{validateUrlPctEncoded}|' +
	    '#{validateUrlSubDelims}|' +
	    ':' +
	  ')*', 'i');
	
	  twttr.txt.regexen.validateUrlDecOctet = /(?:[0-9]|(?:[1-9][0-9])|(?:1[0-9]{2})|(?:2[0-4][0-9])|(?:25[0-5]))/i;
	  twttr.txt.regexen.validateUrlIpv4 = regexSupplant(/(?:#{validateUrlDecOctet}(?:\.#{validateUrlDecOctet}){3})/i);
	
	  // Punting on real IPv6 validation for now
	  twttr.txt.regexen.validateUrlIpv6 = /(?:\[[a-f0-9:\.]+\])/i;
	
	  // Also punting on IPvFuture for now
	  twttr.txt.regexen.validateUrlIp = regexSupplant('(?:' +
	    '#{validateUrlIpv4}|' +
	    '#{validateUrlIpv6}' +
	  ')', 'i');
	
	  // This is more strict than the rfc specifies
	  twttr.txt.regexen.validateUrlSubDomainSegment = /(?:[a-z0-9](?:[a-z0-9_\-]*[a-z0-9])?)/i;
	  twttr.txt.regexen.validateUrlDomainSegment = /(?:[a-z0-9](?:[a-z0-9\-]*[a-z0-9])?)/i;
	  twttr.txt.regexen.validateUrlDomainTld = /(?:[a-z](?:[a-z0-9\-]*[a-z0-9])?)/i;
	  twttr.txt.regexen.validateUrlDomain = regexSupplant(/(?:(?:#{validateUrlSubDomainSegment]}\.)*(?:#{validateUrlDomainSegment]}\.)#{validateUrlDomainTld})/i);
	
	  twttr.txt.regexen.validateUrlHost = regexSupplant('(?:' +
	    '#{validateUrlIp}|' +
	    '#{validateUrlDomain}' +
	  ')', 'i');
	
	  // Unencoded internationalized domains - this doesn't check for invalid UTF-8 sequences
	  twttr.txt.regexen.validateUrlUnicodeSubDomainSegment = /(?:(?:[a-z0-9]|[^\u0000-\u007f])(?:(?:[a-z0-9_\-]|[^\u0000-\u007f])*(?:[a-z0-9]|[^\u0000-\u007f]))?)/i;
	  twttr.txt.regexen.validateUrlUnicodeDomainSegment = /(?:(?:[a-z0-9]|[^\u0000-\u007f])(?:(?:[a-z0-9\-]|[^\u0000-\u007f])*(?:[a-z0-9]|[^\u0000-\u007f]))?)/i;
	  twttr.txt.regexen.validateUrlUnicodeDomainTld = /(?:(?:[a-z]|[^\u0000-\u007f])(?:(?:[a-z0-9\-]|[^\u0000-\u007f])*(?:[a-z0-9]|[^\u0000-\u007f]))?)/i;
	  twttr.txt.regexen.validateUrlUnicodeDomain = regexSupplant(/(?:(?:#{validateUrlUnicodeSubDomainSegment}\.)*(?:#{validateUrlUnicodeDomainSegment}\.)#{validateUrlUnicodeDomainTld})/i);
	
	  twttr.txt.regexen.validateUrlUnicodeHost = regexSupplant('(?:' +
	    '#{validateUrlIp}|' +
	    '#{validateUrlUnicodeDomain}' +
	  ')', 'i');
	
	  twttr.txt.regexen.validateUrlPort = /[0-9]{1,5}/;
	
	  twttr.txt.regexen.validateUrlUnicodeAuthority = regexSupplant(
	    '(?:(#{validateUrlUserinfo})@)?'  + // $1 userinfo
	    '(#{validateUrlUnicodeHost})'     + // $2 host
	    '(?::(#{validateUrlPort}))?'        //$3 port
	  , "i");
	
	  twttr.txt.regexen.validateUrlAuthority = regexSupplant(
	    '(?:(#{validateUrlUserinfo})@)?' + // $1 userinfo
	    '(#{validateUrlHost})'           + // $2 host
	    '(?::(#{validateUrlPort}))?'       // $3 port
	  , "i");
	
	  twttr.txt.regexen.validateUrlPath = regexSupplant(/(\/#{validateUrlPchar}*)*/i);
	  twttr.txt.regexen.validateUrlQuery = regexSupplant(/(#{validateUrlPchar}|\/|\?)*/i);
	  twttr.txt.regexen.validateUrlFragment = regexSupplant(/(#{validateUrlPchar}|\/|\?)*/i);
	
	  // Modified version of RFC 3986 Appendix B
	  twttr.txt.regexen.validateUrlUnencoded = regexSupplant(
	    '^'                               + // Full URL
	    '(?:'                             +
	      '([^:/?#]+):\\/\\/'             + // $1 Scheme
	    ')?'                              +
	    '([^/?#]*)'                       + // $2 Authority
	    '([^?#]*)'                        + // $3 Path
	    '(?:'                             +
	      '\\?([^#]*)'                    + // $4 Query
	    ')?'                              +
	    '(?:'                             +
	      '#(.*)'                         + // $5 Fragment
	    ')?$'
	  , "i");
	
	
	  // Default CSS class for auto-linked lists (along with the url class)
	  var DEFAULT_LIST_CLASS = "tweet-url list-slug";
	  // Default CSS class for auto-linked usernames (along with the url class)
	  var DEFAULT_USERNAME_CLASS = "tweet-url username";
	  // Default CSS class for auto-linked hashtags (along with the url class)
	  var DEFAULT_HASHTAG_CLASS = "tweet-url hashtag";
	  // Default CSS class for auto-linked cashtags (along with the url class)
	  var DEFAULT_CASHTAG_CLASS = "tweet-url cashtag";
	  // Options which should not be passed as HTML attributes
	  var OPTIONS_NOT_ATTRIBUTES = {'urlClass':true, 'listClass':true, 'usernameClass':true, 'hashtagClass':true, 'cashtagClass':true,
	                            'usernameUrlBase':true, 'listUrlBase':true, 'hashtagUrlBase':true, 'cashtagUrlBase':true,
	                            'usernameUrlBlock':true, 'listUrlBlock':true, 'hashtagUrlBlock':true, 'linkUrlBlock':true,
	                            'usernameIncludeSymbol':true, 'suppressLists':true, 'suppressNoFollow':true,
	                            'suppressDataScreenName':true, 'urlEntities':true, 'symbolTag':true, 'textWithSymbolTag':true, 'urlTarget':true,
	                            'invisibleTagAttrs':true, 'linkAttributeBlock':true, 'linkTextBlock': true
	                            };
	  var BOOLEAN_ATTRIBUTES = {'disabled':true, 'readonly':true, 'multiple':true, 'checked':true};
	
	  // Simple object cloning function for simple objects
	  function clone(o) {
	    var r = {};
	    for (var k in o) {
	      if (o.hasOwnProperty(k)) {
	        r[k] = o[k];
	      }
	    }
	
	    return r;
	  }
	
	  twttr.txt.tagAttrs = function(attributes) {
	    var htmlAttrs = "";
	    for (var k in attributes) {
	      var v = attributes[k];
	      if (BOOLEAN_ATTRIBUTES[k]) {
	        v = v ? k : null;
	      }
	      if (v == null) continue;
	      htmlAttrs += " " + twttr.txt.htmlEscape(k) + "=\"" + twttr.txt.htmlEscape(v.toString()) + "\"";
	    }
	    return htmlAttrs;
	  };
	
	  twttr.txt.linkToText = function(entity, text, attributes, options) {
	    if (!options.suppressNoFollow) {
	      attributes.rel = "nofollow";
	    }
	    // if linkAttributeBlock is specified, call it to modify the attributes
	    if (options.linkAttributeBlock) {
	      options.linkAttributeBlock(entity, attributes);
	    }
	    // if linkTextBlock is specified, call it to get a new/modified link text
	    if (options.linkTextBlock) {
	      text = options.linkTextBlock(entity, text);
	    }
	    var d = {
	      text: text,
	      attr: twttr.txt.tagAttrs(attributes)
	    };
	    return stringSupplant("<a#{attr}>#{text}</a>", d);
	  };
	
	  twttr.txt.linkToTextWithSymbol = function(entity, symbol, text, attributes, options) {
	    var taggedSymbol = options.symbolTag ? "<" + options.symbolTag + ">" + symbol + "</"+ options.symbolTag + ">" : symbol;
	    text = twttr.txt.htmlEscape(text);
	    var taggedText = options.textWithSymbolTag ? "<" + options.textWithSymbolTag + ">" + text + "</"+ options.textWithSymbolTag + ">" : text;
	
	    if (options.usernameIncludeSymbol || !symbol.match(twttr.txt.regexen.atSigns)) {
	      return twttr.txt.linkToText(entity, taggedSymbol + taggedText, attributes, options);
	    } else {
	      return taggedSymbol + twttr.txt.linkToText(entity, taggedText, attributes, options);
	    }
	  };
	
	  twttr.txt.linkToHashtag = function(entity, text, options) {
	    var hash = text.substring(entity.indices[0], entity.indices[0] + 1);
	    var hashtag = twttr.txt.htmlEscape(entity.hashtag);
	    var attrs = clone(options.htmlAttrs || {});
	    attrs.href = options.hashtagUrlBase + hashtag;
	    attrs.title = "#" + hashtag;
	    attrs["class"] = options.hashtagClass;
	
	    return twttr.txt.linkToTextWithSymbol(entity, hash, hashtag, attrs, options);
	  };
	
	  twttr.txt.linkToCashtag = function(entity, text, options) {
	    var cashtag = twttr.txt.htmlEscape(entity.cashtag);
	    var attrs = clone(options.htmlAttrs || {});
	    attrs.href = options.cashtagUrlBase + cashtag;
	    attrs.title = "$" + cashtag;
	    attrs["class"] =  options.cashtagClass;
	
	    return twttr.txt.linkToTextWithSymbol(entity, "$", cashtag, attrs, options);
	  };
	
	  twttr.txt.linkToMentionAndList = function(entity, text, options) {
	    var at = text.substring(entity.indices[0], entity.indices[0] + 1);
	    var user = twttr.txt.htmlEscape(entity.screenName);
	    var slashListname = twttr.txt.htmlEscape(entity.listSlug);
	    var isList = entity.listSlug && !options.suppressLists;
	    var attrs = clone(options.htmlAttrs || {});
	    attrs["class"] = (isList ? options.listClass : options.usernameClass);
	    attrs.href = isList ? options.listUrlBase + user + slashListname : options.usernameUrlBase + user;
	    if (!isList && !options.suppressDataScreenName) {
	      attrs['data-screen-name'] = user;
	    }
	
	    return twttr.txt.linkToTextWithSymbol(entity, at, isList ? user + slashListname : user, attrs, options);
	  };
	
	  twttr.txt.linkToUrl = function(entity, text, options) {
	    var url = entity.url;
	    var displayUrl = url;
	    var linkText = twttr.txt.htmlEscape(displayUrl);
	
	    // If the caller passed a urlEntities object (provided by a Twitter API
	    // response with include_entities=true), we use that to render the display_url
	    // for each URL instead of it's underlying t.co URL.
	    var urlEntity = (options.urlEntities && options.urlEntities[url]) || entity;
	    if (urlEntity.display_url) {
	      linkText = twttr.txt.linkTextWithEntity(urlEntity, options);
	    }
	
	    var attrs = clone(options.htmlAttrs || {});
	    attrs.href = url;
	
	    // set class only if urlClass is specified.
	    if (options.urlClass) {
	      attrs["class"] = options.urlClass;
	    }
	
	    // set target only if urlTarget is specified.
	    if (options.urlTarget) {
	      attrs.target = options.urlTarget;
	    }
	
	    if (!options.title && urlEntity.display_url) {
	      attrs.title = urlEntity.expanded_url;
	    }
	
	    return twttr.txt.linkToText(entity, linkText, attrs, options);
	  };
	
	  twttr.txt.linkTextWithEntity = function (entity, options) {
	    var displayUrl = entity.display_url;
	    var expandedUrl = entity.expanded_url;
	
	    // Goal: If a user copies and pastes a tweet containing t.co'ed link, the resulting paste
	    // should contain the full original URL (expanded_url), not the display URL.
	    //
	    // Method: Whenever possible, we actually emit HTML that contains expanded_url, and use
	    // font-size:0 to hide those parts that should not be displayed (because they are not part of display_url).
	    // Elements with font-size:0 get copied even though they are not visible.
	    // Note that display:none doesn't work here. Elements with display:none don't get copied.
	    //
	    // Additionally, we want to *display* ellipses, but we don't want them copied.  To make this happen we
	    // wrap the ellipses in a tco-ellipsis class and provide an onCopy handler that sets display:none on
	    // everything with the tco-ellipsis class.
	    //
	    // Exception: pic.twitter.com images, for which expandedUrl = "https://twitter.com/#!/username/status/1234/photo/1
	    // For those URLs, display_url is not a substring of expanded_url, so we don't do anything special to render the elided parts.
	    // For a pic.twitter.com URL, the only elided part will be the "https://", so this is fine.
	
	    var displayUrlSansEllipses = displayUrl.replace(/…/g, ""); // We have to disregard ellipses for matching
	    // Note: we currently only support eliding parts of the URL at the beginning or the end.
	    // Eventually we may want to elide parts of the URL in the *middle*.  If so, this code will
	    // become more complicated.  We will probably want to create a regexp out of display URL,
	    // replacing every ellipsis with a ".*".
	    if (expandedUrl.indexOf(displayUrlSansEllipses) != -1) {
	      var displayUrlIndex = expandedUrl.indexOf(displayUrlSansEllipses);
	      var v = {
	        displayUrlSansEllipses: displayUrlSansEllipses,
	        // Portion of expandedUrl that precedes the displayUrl substring
	        beforeDisplayUrl: expandedUrl.substr(0, displayUrlIndex),
	        // Portion of expandedUrl that comes after displayUrl
	        afterDisplayUrl: expandedUrl.substr(displayUrlIndex + displayUrlSansEllipses.length),
	        precedingEllipsis: displayUrl.match(/^…/) ? "…" : "",
	        followingEllipsis: displayUrl.match(/…$/) ? "…" : ""
	      };
	      for (var k in v) {
	        if (v.hasOwnProperty(k)) {
	          v[k] = twttr.txt.htmlEscape(v[k]);
	        }
	      }
	      // As an example: The user tweets "hi http://longdomainname.com/foo"
	      // This gets shortened to "hi http://t.co/xyzabc", with display_url = "…nname.com/foo"
	      // This will get rendered as:
	      // <span class='tco-ellipsis'> <!-- This stuff should get displayed but not copied -->
	      //   …
	      //   <!-- There's a chance the onCopy event handler might not fire. In case that happens,
	      //        we include an &nbsp; here so that the … doesn't bump up against the URL and ruin it.
	      //        The &nbsp; is inside the tco-ellipsis span so that when the onCopy handler *does*
	      //        fire, it doesn't get copied.  Otherwise the copied text would have two spaces in a row,
	      //        e.g. "hi  http://longdomainname.com/foo".
	      //   <span style='font-size:0'>&nbsp;</span>
	      // </span>
	      // <span style='font-size:0'>  <!-- This stuff should get copied but not displayed -->
	      //   http://longdomai
	      // </span>
	      // <span class='js-display-url'> <!-- This stuff should get displayed *and* copied -->
	      //   nname.com/foo
	      // </span>
	      // <span class='tco-ellipsis'> <!-- This stuff should get displayed but not copied -->
	      //   <span style='font-size:0'>&nbsp;</span>
	      //   …
	      // </span>
	      v['invisible'] = options.invisibleTagAttrs;
	      return stringSupplant("<span class='tco-ellipsis'>#{precedingEllipsis}<span #{invisible}>&nbsp;</span></span><span #{invisible}>#{beforeDisplayUrl}</span><span class='js-display-url'>#{displayUrlSansEllipses}</span><span #{invisible}>#{afterDisplayUrl}</span><span class='tco-ellipsis'><span #{invisible}>&nbsp;</span>#{followingEllipsis}</span>", v);
	    }
	    return displayUrl;
	  };
	
	  twttr.txt.autoLinkEntities = function(text, entities, options) {
	    options = clone(options || {});
	
	    options.hashtagClass = options.hashtagClass || DEFAULT_HASHTAG_CLASS;
	    options.hashtagUrlBase = options.hashtagUrlBase || "https://twitter.com/#!/search?q=%23";
	    options.cashtagClass = options.cashtagClass || DEFAULT_CASHTAG_CLASS;
	    options.cashtagUrlBase = options.cashtagUrlBase || "https://twitter.com/#!/search?q=%24";
	    options.listClass = options.listClass || DEFAULT_LIST_CLASS;
	    options.usernameClass = options.usernameClass || DEFAULT_USERNAME_CLASS;
	    options.usernameUrlBase = options.usernameUrlBase || "https://twitter.com/";
	    options.listUrlBase = options.listUrlBase || "https://twitter.com/";
	    options.htmlAttrs = twttr.txt.extractHtmlAttrsFromOptions(options);
	    options.invisibleTagAttrs = options.invisibleTagAttrs || "style='position:absolute;left:-9999px;'";
	
	    // remap url entities to hash
	    var urlEntities, i, len;
	    if(options.urlEntities) {
	      urlEntities = {};
	      for(i = 0, len = options.urlEntities.length; i < len; i++) {
	        urlEntities[options.urlEntities[i].url] = options.urlEntities[i];
	      }
	      options.urlEntities = urlEntities;
	    }
	
	    var result = "";
	    var beginIndex = 0;
	
	    // sort entities by start index
	    entities.sort(function(a,b){ return a.indices[0] - b.indices[0]; });
	
	    for (var i = 0; i < entities.length; i++) {
	      var entity = entities[i];
	      result += text.substring(beginIndex, entity.indices[0]);
	
	      if (entity.url) {
	        result += twttr.txt.linkToUrl(entity, text, options);
	      } else if (entity.hashtag) {
	        result += twttr.txt.linkToHashtag(entity, text, options);
	      } else if (entity.screenName) {
	        result += twttr.txt.linkToMentionAndList(entity, text, options);
	      } else if (entity.cashtag) {
	        result += twttr.txt.linkToCashtag(entity, text, options);
	      }
	      beginIndex = entity.indices[1];
	    }
	    result += text.substring(beginIndex, text.length);
	    return result;
	  };
	
	  twttr.txt.autoLinkWithJSON = function(text, json, options) {
	    // concatenate all entities
	    var entities = [];
	    for (var key in json) {
	      entities = entities.concat(json[key]);
	    }
	    // map JSON entity to twitter-text entity
	    for (var i = 0; i < entities.length; i++) {
	      entity = entities[i];
	      if (entity.screen_name) {
	        // this is @mention
	        entity.screenName = entity.screen_name;
	      } else if (entity.text) {
	        // this is #hashtag
	        entity.hashtag = entity.text;
	      }
	    }
	    // modify indices to UTF-16
	    twttr.txt.modifyIndicesFromUnicodeToUTF16(text, entities);
	
	    return twttr.txt.autoLinkEntities(text, entities, options);
	  };
	
	  twttr.txt.extractHtmlAttrsFromOptions = function(options) {
	    var htmlAttrs = {};
	    for (var k in options) {
	      var v = options[k];
	      if (OPTIONS_NOT_ATTRIBUTES[k]) continue;
	      if (BOOLEAN_ATTRIBUTES[k]) {
	        v = v ? k : null;
	      }
	      if (v == null) continue;
	      htmlAttrs[k] = v;
	    }
	    return htmlAttrs;
	  };
	
	  twttr.txt.autoLink = function(text, options) {
	    var entities = twttr.txt.extractEntitiesWithIndices(text, {extractUrlWithoutProtocol: false});
	    return twttr.txt.autoLinkEntities(text, entities, options);
	  };
	
	  twttr.txt.autoLinkUsernamesOrLists = function(text, options) {
	    var entities = twttr.txt.extractMentionsOrListsWithIndices(text);
	    return twttr.txt.autoLinkEntities(text, entities, options);
	  };
	
	  twttr.txt.autoLinkHashtags = function(text, options) {
	    var entities = twttr.txt.extractHashtagsWithIndices(text);
	    return twttr.txt.autoLinkEntities(text, entities, options);
	  };
	
	  twttr.txt.autoLinkCashtags = function(text, options) {
	    var entities = twttr.txt.extractCashtagsWithIndices(text);
	    return twttr.txt.autoLinkEntities(text, entities, options);
	  };
	
	  twttr.txt.autoLinkUrlsCustom = function(text, options) {
	    var entities = twttr.txt.extractUrlsWithIndices(text, {extractUrlWithoutProtocol: false});
	    return twttr.txt.autoLinkEntities(text, entities, options);
	  };
	
	  twttr.txt.removeOverlappingEntities = function(entities) {
	    entities.sort(function(a,b){ return a.indices[0] - b.indices[0]; });
	
	    var prev = entities[0];
	    for (var i = 1; i < entities.length; i++) {
	      if (prev.indices[1] > entities[i].indices[0]) {
	        entities.splice(i, 1);
	        i--;
	      } else {
	        prev = entities[i];
	      }
	    }
	  };
	
	  twttr.txt.extractEntitiesWithIndices = function(text, options) {
	    var entities = twttr.txt.extractUrlsWithIndices(text, options)
	                    .concat(twttr.txt.extractMentionsOrListsWithIndices(text))
	                    .concat(twttr.txt.extractHashtagsWithIndices(text, {checkUrlOverlap: false}))
	                    .concat(twttr.txt.extractCashtagsWithIndices(text));
	
	    if (entities.length == 0) {
	      return [];
	    }
	
	    twttr.txt.removeOverlappingEntities(entities);
	    return entities;
	  };
	
	  twttr.txt.extractMentions = function(text) {
	    var screenNamesOnly = [],
	        screenNamesWithIndices = twttr.txt.extractMentionsWithIndices(text);
	
	    for (var i = 0; i < screenNamesWithIndices.length; i++) {
	      var screenName = screenNamesWithIndices[i].screenName;
	      screenNamesOnly.push(screenName);
	    }
	
	    return screenNamesOnly;
	  };
	
	  twttr.txt.extractMentionsWithIndices = function(text) {
	    var mentions = [];
	    var mentionsOrLists = twttr.txt.extractMentionsOrListsWithIndices(text);
	
	    for (var i = 0 ; i < mentionsOrLists.length; i++) {
	      mentionOrList = mentionsOrLists[i];
	      if (mentionOrList.listSlug == '') {
	        mentions.push({
	          screenName: mentionOrList.screenName,
	          indices: mentionOrList.indices
	        });
	      }
	    }
	
	    return mentions;
	  };
	
	  /**
	   * Extract list or user mentions.
	   * (Presence of listSlug indicates a list)
	   */
	  twttr.txt.extractMentionsOrListsWithIndices = function(text) {
	    if (!text || !text.match(twttr.txt.regexen.atSigns)) {
	      return [];
	    }
	
	    var possibleNames = [];
	
	    text.replace(twttr.txt.regexen.validMentionOrList, function(match, before, atSign, screenName, slashListname, offset, chunk) {
	      var after = chunk.slice(offset + match.length);
	      if (!after.match(twttr.txt.regexen.endMentionMatch)) {
	        slashListname = slashListname || '';
	        var startPosition = offset + before.length;
	        var endPosition = startPosition + screenName.length + slashListname.length + 1;
	        possibleNames.push({
	          screenName: screenName,
	          listSlug: slashListname,
	          indices: [startPosition, endPosition]
	        });
	      }
	    });
	
	    return possibleNames;
	  };
	
	
	  twttr.txt.extractReplies = function(text) {
	    if (!text) {
	      return null;
	    }
	
	    var possibleScreenName = text.match(twttr.txt.regexen.validReply);
	    if (!possibleScreenName ||
	        RegExp.rightContext.match(twttr.txt.regexen.endMentionMatch)) {
	      return null;
	    }
	
	    return possibleScreenName[1];
	  };
	
	  twttr.txt.extractUrls = function(text, options) {
	    var urlsOnly = [],
	        urlsWithIndices = twttr.txt.extractUrlsWithIndices(text, options);
	
	    for (var i = 0; i < urlsWithIndices.length; i++) {
	      urlsOnly.push(urlsWithIndices[i].url);
	    }
	
	    return urlsOnly;
	  };
	
	  twttr.txt.extractUrlsWithIndices = function(text, options) {
	    if (!options) {
	      options = {extractUrlsWithoutProtocol: true};
	    }
	
	    if (!text || (options.extractUrlsWithoutProtocol ? !text.match(/\./) : !text.match(/:/))) {
	      return [];
	    }
	
	    var urls = [];
	
	    while (twttr.txt.regexen.extractUrl.exec(text)) {
	      var before = RegExp.$2, url = RegExp.$3, protocol = RegExp.$4, domain = RegExp.$5, path = RegExp.$7;
	      var endPosition = twttr.txt.regexen.extractUrl.lastIndex,
	          startPosition = endPosition - url.length;
	
	      // if protocol is missing and domain contains non-ASCII characters,
	      // extract ASCII-only domains.
	      if (!protocol) {
	        if (!options.extractUrlsWithoutProtocol
	            || before.match(twttr.txt.regexen.invalidUrlWithoutProtocolPrecedingChars)) {
	          continue;
	        }
	        var lastUrl = null,
	            lastUrlInvalidMatch = false,
	            asciiEndPosition = 0;
	        domain.replace(twttr.txt.regexen.validAsciiDomain, function(asciiDomain) {
	          var asciiStartPosition = domain.indexOf(asciiDomain, asciiEndPosition);
	          asciiEndPosition = asciiStartPosition + asciiDomain.length;
	          lastUrl = {
	            url: asciiDomain,
	            indices: [startPosition + asciiStartPosition, startPosition + asciiEndPosition]
	          };
	          lastUrlInvalidMatch = asciiDomain.match(twttr.txt.regexen.invalidShortDomain);
	          if (!lastUrlInvalidMatch) {
	            urls.push(lastUrl);
	          }
	        });
	
	        // no ASCII-only domain found. Skip the entire URL.
	        if (lastUrl == null) {
	          continue;
	        }
	
	        // lastUrl only contains domain. Need to add path and query if they exist.
	        if (path) {
	          if (lastUrlInvalidMatch) {
	            urls.push(lastUrl);
	          }
	          lastUrl.url = url.replace(domain, lastUrl.url);
	          lastUrl.indices[1] = endPosition;
	        }
	      } else {
	        // In the case of t.co URLs, don't allow additional path characters.
	        if (url.match(twttr.txt.regexen.validTcoUrl)) {
	          url = RegExp.lastMatch;
	          endPosition = startPosition + url.length;
	        }
	        urls.push({
	          url: url,
	          indices: [startPosition, endPosition]
	        });
	      }
	    }
	
	    return urls;
	  };
	
	  twttr.txt.extractHashtags = function(text) {
	    var hashtagsOnly = [],
	        hashtagsWithIndices = twttr.txt.extractHashtagsWithIndices(text);
	
	    for (var i = 0; i < hashtagsWithIndices.length; i++) {
	      hashtagsOnly.push(hashtagsWithIndices[i].hashtag);
	    }
	
	    return hashtagsOnly;
	  };
	
	  twttr.txt.extractHashtagsWithIndices = function(text, options) {
	    if (!options) {
	      options = {checkUrlOverlap: true};
	    }
	
	    if (!text || !text.match(twttr.txt.regexen.hashSigns)) {
	      return [];
	    }
	
	    var tags = [];
	
	    text.replace(twttr.txt.regexen.validHashtag, function(match, before, hash, hashText, offset, chunk) {
	      var after = chunk.slice(offset + match.length);
	      if (after.match(twttr.txt.regexen.endHashtagMatch))
	        return;
	      var startPosition = offset + before.length;
	      var endPosition = startPosition + hashText.length + 1;
	      tags.push({
	        hashtag: hashText,
	        indices: [startPosition, endPosition]
	      });
	    });
	
	    if (options.checkUrlOverlap) {
	      // also extract URL entities
	      var urls = twttr.txt.extractUrlsWithIndices(text);
	      if (urls.length > 0) {
	        var entities = tags.concat(urls);
	        // remove overlap
	        twttr.txt.removeOverlappingEntities(entities);
	        // only push back hashtags
	        tags = [];
	        for (var i = 0; i < entities.length; i++) {
	          if (entities[i].hashtag) {
	            tags.push(entities[i]);
	          }
	        }
	      }
	    }
	
	    return tags;
	  };
	
	  twttr.txt.extractCashtags = function(text) {
	    var cashtagsOnly = [],
	        cashtagsWithIndices = twttr.txt.extractCashtagsWithIndices(text);
	
	    for (var i = 0; i < cashtagsWithIndices.length; i++) {
	      cashtagsOnly.push(cashtagsWithIndices[i].cashtag);
	    }
	
	    return cashtagsOnly;
	  };
	
	  twttr.txt.extractCashtagsWithIndices = function(text) {
	    if (!text || text.indexOf("$") == -1) {
	      return [];
	    }
	
	    var tags = [];
	
	    text.replace(twttr.txt.regexen.validCashtag, function(match, before, dollar, cashtag, offset, chunk) {
	      var startPosition = offset + before.length;
	      var endPosition = startPosition + cashtag.length + 1;
	      tags.push({
	        cashtag: cashtag,
	        indices: [startPosition, endPosition]
	      });
	    });
	
	    return tags;
	  };
	
	  twttr.txt.modifyIndicesFromUnicodeToUTF16 = function(text, entities) {
	    twttr.txt.convertUnicodeIndices(text, entities, false);
	  };
	
	  twttr.txt.modifyIndicesFromUTF16ToUnicode = function(text, entities) {
	    twttr.txt.convertUnicodeIndices(text, entities, true);
	  };
	
	  twttr.txt.convertUnicodeIndices = function(text, entities, indicesInUTF16) {
	    if (entities.length == 0) {
	      return;
	    }
	
	    var charIndex = 0;
	    var codePointIndex = 0;
	
	    // sort entities by start index
	    entities.sort(function(a,b){ return a.indices[0] - b.indices[0]; });
	    var entityIndex = 0;
	    var entity = entities[0];
	
	    while (charIndex < text.length) {
	      if (entity.indices[0] == (indicesInUTF16 ? charIndex : codePointIndex)) {
	        var len = entity.indices[1] - entity.indices[0];
	        entity.indices[0] = indicesInUTF16 ? codePointIndex : charIndex;
	        entity.indices[1] = entity.indices[0] + len;
	
	        entityIndex++;
	        if (entityIndex == entities.length) {
	          // no more entity
	          break;
	        }
	        entity = entities[entityIndex];
	      }
	
	      var c = text.charCodeAt(charIndex);
	      if (0xD800 <= c && c <= 0xDBFF && charIndex < text.length - 1) {
	        // Found high surrogate char
	        c = text.charCodeAt(charIndex + 1);
	        if (0xDC00 <= c && c <= 0xDFFF) {
	          // Found surrogate pair
	          charIndex++;
	        }
	      }
	      codePointIndex++;
	      charIndex++;
	    }
	  };
	
	  // this essentially does text.split(/<|>/)
	  // except that won't work in IE, where empty strings are ommitted
	  // so "<>".split(/<|>/) => [] in IE, but is ["", "", ""] in all others
	  // but "<<".split("<") => ["", "", ""]
	  twttr.txt.splitTags = function(text) {
	    var firstSplits = text.split("<"),
	        secondSplits,
	        allSplits = [],
	        split;
	
	    for (var i = 0; i < firstSplits.length; i += 1) {
	      split = firstSplits[i];
	      if (!split) {
	        allSplits.push("");
	      } else {
	        secondSplits = split.split(">");
	        for (var j = 0; j < secondSplits.length; j += 1) {
	          allSplits.push(secondSplits[j]);
	        }
	      }
	    }
	
	    return allSplits;
	  };
	
	  twttr.txt.hitHighlight = function(text, hits, options) {
	    var defaultHighlightTag = "em";
	
	    hits = hits || [];
	    options = options || {};
	
	    if (hits.length === 0) {
	      return text;
	    }
	
	    var tagName = options.tag || defaultHighlightTag,
	        tags = ["<" + tagName + ">", "</" + tagName + ">"],
	        chunks = twttr.txt.splitTags(text),
	        i,
	        j,
	        result = "",
	        chunkIndex = 0,
	        chunk = chunks[0],
	        prevChunksLen = 0,
	        chunkCursor = 0,
	        startInChunk = false,
	        chunkChars = chunk,
	        flatHits = [],
	        index,
	        hit,
	        tag,
	        placed,
	        hitSpot;
	
	    for (i = 0; i < hits.length; i += 1) {
	      for (j = 0; j < hits[i].length; j += 1) {
	        flatHits.push(hits[i][j]);
	      }
	    }
	
	    for (index = 0; index < flatHits.length; index += 1) {
	      hit = flatHits[index];
	      tag = tags[index % 2];
	      placed = false;
	
	      while (chunk != null && hit >= prevChunksLen + chunk.length) {
	        result += chunkChars.slice(chunkCursor);
	        if (startInChunk && hit === prevChunksLen + chunkChars.length) {
	          result += tag;
	          placed = true;
	        }
	
	        if (chunks[chunkIndex + 1]) {
	          result += "<" + chunks[chunkIndex + 1] + ">";
	        }
	
	        prevChunksLen += chunkChars.length;
	        chunkCursor = 0;
	        chunkIndex += 2;
	        chunk = chunks[chunkIndex];
	        chunkChars = chunk;
	        startInChunk = false;
	      }
	
	      if (!placed && chunk != null) {
	        hitSpot = hit - prevChunksLen;
	        result += chunkChars.slice(chunkCursor, hitSpot) + tag;
	        chunkCursor = hitSpot;
	        if (index % 2 === 0) {
	          startInChunk = true;
	        } else {
	          startInChunk = false;
	        }
	      } else if(!placed) {
	        placed = true;
	        result += tag;
	      }
	    }
	
	    if (chunk != null) {
	      if (chunkCursor < chunkChars.length) {
	        result += chunkChars.slice(chunkCursor);
	      }
	      for (index = chunkIndex + 1; index < chunks.length; index += 1) {
	        result += (index % 2 === 0 ? chunks[index] : "<" + chunks[index] + ">");
	      }
	    }
	
	    return result;
	  };
	  //Start updated for Wouaf IT
	  var MAX_LENGTH = 300;
	  //End updated for Wouaf IT
	  
	  // Characters not allowed in Tweets
	  var INVALID_CHARACTERS = [
	    // BOM
	    fromCode(0xFFFE),
	    fromCode(0xFEFF),
	
	    // Special
	    fromCode(0xFFFF),
	
	    // Directional Change
	    fromCode(0x202A),
	    fromCode(0x202B),
	    fromCode(0x202C),
	    fromCode(0x202D),
	    fromCode(0x202E)
	  ];
	
	  // Returns the length of Tweet text with consideration to t.co URL replacement
	  twttr.txt.getTweetLength = function(text, options) {
	    if (!options) {
	      options = {
	          short_url_length: 20,
	          short_url_length_https: 21
	      };
	    }
	    var textLength = text.length;
	    var urlsWithIndices = twttr.txt.extractUrlsWithIndices(text);
	
	    for (var i = 0; i < urlsWithIndices.length; i++) {
	    	// Subtract the length of the original URL
	      textLength += urlsWithIndices[i].indices[0] - urlsWithIndices[i].indices[1];
	
	      // Add 21 characters for URL starting with https://
	      // Otherwise add 20 characters
	      if (urlsWithIndices[i].url.toLowerCase().match(/^https:\/\//)) {
	         textLength += options.short_url_length_https;
	      } else {
	        textLength += options.short_url_length;
	      }
	    }
	
	    return textLength;
	  };
	
	  // Check the text for any reason that it may not be valid as a Tweet. This is meant as a pre-validation
	  // before posting to api.twitter.com. There are several server-side reasons for Tweets to fail but this pre-validation
	  // will allow quicker feedback.
	  //
	  // Returns false if this text is valid. Otherwise one of the following strings will be returned:
	  //
	  //   "too_long": if the text is too long
	  //   "empty": if the text is nil or empty
	  //   "invalid_characters": if the text contains non-Unicode or any of the disallowed Unicode characters
	  twttr.txt.isInvalidTweet = function(text) {
	    if (!text) {
	      return "empty";
	    }
	
	    // Determine max length independent of URL length
	    if (twttr.txt.getTweetLength(text) > MAX_LENGTH) {
	      return "too_long";
	    }
	
	    for (var i = 0; i < INVALID_CHARACTERS.length; i++) {
	      if (text.indexOf(INVALID_CHARACTERS[i]) >= 0) {
	        return "invalid_characters";
	      }
	    }
	
	    return false;
	  };
	
	  twttr.txt.isValidTweetText = function(text) {
	    return !twttr.txt.isInvalidTweet(text);
	  };
	
	  twttr.txt.isValidUsername = function(username) {
	    if (!username) {
	      return false;
	    }
	
	    var extracted = twttr.txt.extractMentions(username);
	
	    // Should extract the username minus the @ sign, hence the .slice(1)
	    return extracted.length === 1 && extracted[0] === username.slice(1);
	  };
	
	  var VALID_LIST_RE = regexSupplant(/^#{validMentionOrList}$/);
	
	  twttr.txt.isValidList = function(usernameList) {
	    var match = usernameList.match(VALID_LIST_RE);
	
	    // Must have matched and had nothing before or after
	    return !!(match && match[1] == "" && match[4]);
	  };
	
	  twttr.txt.isValidHashtag = function(hashtag) {
	    if (!hashtag) {
	      return false;
	    }
	
	    var extracted = twttr.txt.extractHashtags(hashtag);
	
	    // Should extract the hashtag minus the # sign, hence the .slice(1)
	    return extracted.length === 1 && extracted[0] === hashtag.slice(1);
	  };
	
	  twttr.txt.isValidUrl = function(url, unicodeDomains, requireProtocol) {
	    if (unicodeDomains == null) {
	      unicodeDomains = true;
	    }
	
	    if (requireProtocol == null) {
	      requireProtocol = true;
	    }
	
	    if (!url) {
	      return false;
	    }
	
	    var urlParts = url.match(twttr.txt.regexen.validateUrlUnencoded);
	
	    if (!urlParts || urlParts[0] !== url) {
	      return false;
	    }
	
	    var scheme = urlParts[1],
	        authority = urlParts[2],
	        path = urlParts[3],
	        query = urlParts[4],
	        fragment = urlParts[5];
	
	    if (!(
	      (!requireProtocol || (isValidMatch(scheme, twttr.txt.regexen.validateUrlScheme) && scheme.match(/^https?$/i))) &&
	      isValidMatch(path, twttr.txt.regexen.validateUrlPath) &&
	      isValidMatch(query, twttr.txt.regexen.validateUrlQuery, true) &&
	      isValidMatch(fragment, twttr.txt.regexen.validateUrlFragment, true)
	    )) {
	      return false;
	    }
	
	    return (unicodeDomains && isValidMatch(authority, twttr.txt.regexen.validateUrlUnicodeAuthority)) ||
	           (!unicodeDomains && isValidMatch(authority, twttr.txt.regexen.validateUrlAuthority));
	  };
	
	  function isValidMatch(string, regex, optional) {
	    if (!optional) {
	      // RegExp["$&"] is the text of the last match
	      // blank strings are ok, but are falsy, so we check stringiness instead of truthiness
	      return ((typeof string === "string") && string.match(regex) && RegExp["$&"] === string);
	    }
	
	    // RegExp["$&"] is the text of the last match
	    return (!string || (string.match(regex) && RegExp["$&"] === string));
	  }
	
	  if (typeof module != 'undefined' && module.exports) {
	    module.exports = twttr.txt;
	  }
	
	}());


/***/ },
/* 28 */
/*!************************!*\
  !*** ./class/query.js ***!
  \************************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = function () {
		var user = __webpack_require__(/*! ./singleton/user.js */ 29);
		var loader = __webpack_require__(/*! ./singleton/loader.js */ 30);
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
		$( document ).ajaxStart(function() {
			if (true) {
				console.info('ajax start');
			}
			loader.show();
		}).ajaxStop(function() {
			if (true) {
				console.info('ajax stop');
			}
			loader.hide();
		});
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
	                if (i == 'loc') {
	                    param = params[i].lat()+','+params[i].lng();
	                } else if (i == 'tag') {
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
	                    locale:     ("fr-fr")
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
/* 29 */
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
/* 30 */
/*!***********************************!*\
  !*** ./class/singleton/loader.js ***!
  \***********************************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = (function() {
		var $ = __webpack_require__(/*! jquery */ 6);
		var $loader = $('#loader');
		var self = {};
		self.show = function(text, delay) {
			$loader.show();
		}
		self.hide = function(text, delay) {
			$loader.hide();
		}
		return self;
	})();

/***/ },
/* 31 */
/*!**********************************!*\
  !*** ./class/singleton/toast.js ***!
  \**********************************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = (function() {
		var $ = __webpack_require__(/*! jquery */ 6);
		var $toast = $('#toast > div');
		var self = {};
		self.show = function(text, delay) {
			delay = delay || 2000;
			$toast.html('<p>'+ text +'</p>').parent().fadeIn().delay(delay).fadeOut();
		}
		return self;
	})();

/***/ },
/* 32 */
/*!***********************************!*\
  !*** ./class/singleton/window.js ***!
  \***********************************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = (function() {
		var $ = __webpack_require__(/*! jquery */ 6);
		var i18n = __webpack_require__(/*! ./i18n.js */ 12);
		var $modal = $('#modalWindow');
		var $modalContent = $modal.find('.modal-content');
		var self = {};
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
//# sourceMappingURL=build.js.map