( function () {
	'use strict';

	document.querySelectorAll( '.lf-folder-home' ).forEach( function ( root ) {
		var tabs = Array.prototype.slice.call( root.querySelectorAll( '[role="tab"]' ) );
		var panels = Array.prototype.slice.call( root.querySelectorAll( '[role="tabpanel"]' ) );

		if ( ! tabs.length || ! panels.length ) {
			return;
		}

		function activate( tab, focusTab ) {
			var panelId = tab.getAttribute( 'aria-controls' );

			tabs.forEach( function ( item ) {
				var selected = item === tab;
				item.setAttribute( 'aria-selected', selected ? 'true' : 'false' );
				item.setAttribute( 'tabindex', selected ? '0' : '-1' );
			} );

			panels.forEach( function ( panel ) {
				panel.hidden = panel.id !== panelId;
			} );

			if ( focusTab ) {
				tab.focus();
			}
		}

		tabs.forEach( function ( tab, index ) {
			tab.addEventListener( 'click', function () {
				activate( tab, false );
			} );

			tab.addEventListener( 'keydown', function ( event ) {
				var nextIndex;

				if ( 'ArrowRight' === event.key || 'ArrowDown' === event.key ) {
					nextIndex = ( index + 1 ) % tabs.length;
				} else if ( 'ArrowLeft' === event.key || 'ArrowUp' === event.key ) {
					nextIndex = ( index - 1 + tabs.length ) % tabs.length;
				} else if ( 'Home' === event.key ) {
					nextIndex = 0;
				} else if ( 'End' === event.key ) {
					nextIndex = tabs.length - 1;
				} else {
					return;
				}

				event.preventDefault();
				activate( tabs[ nextIndex ], true );
			} );
		} );
	} );
}() );


( function () {
	'use strict';
	document.querySelectorAll( '.lf-home-resource-toolbar' ).forEach( function ( toolbar ) {
		var panel = toolbar.closest( '.lf-folder-panel' );
		var buttons = Array.prototype.slice.call( toolbar.querySelectorAll( '[data-home-resource-filter]' ) );
		var cards = Array.prototype.slice.call( panel.querySelectorAll( '[data-home-resource-card]' ) );
		var groups = Array.prototype.slice.call( panel.querySelectorAll( '[data-home-resource-group]' ) );
		function applyFilter( value ) {
			cards.forEach( function ( card ) {
				var match = 'all' === value || card.dataset.language === value || card.dataset.type === value || card.dataset.skill === value;
				card.hidden = ! match;
			} );
			groups.forEach( function ( group ) {
				group.hidden = ! group.querySelector( '[data-home-resource-card]:not([hidden])' );
			} );
			buttons.forEach( function ( button ) { button.setAttribute( 'aria-pressed', button.dataset.homeResourceFilter === value ? 'true' : 'false' ); } );
		}
		buttons.forEach( function ( button ) { button.addEventListener( 'click', function () { applyFilter( button.dataset.homeResourceFilter ); } ); } );
	} );
}() );
