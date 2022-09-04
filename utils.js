"use strict";

class GSUI {
	static $noop() {}

	// .........................................................................
	static $loadJSFile( src ) {
		return new Promise( resolve => {
			const js = GSUI.$createElement( "script", { src, type: "text/javascript" } );

			js.onload = resolve;
			document.head.append( js );
		} );
	}

	// .........................................................................
	static $findElements( root, graph ) {
		return typeof graph === "string"
			? GSUI.#findElemStr( root, graph )
			: Object.seal( Array.isArray( graph )
				? GSUI.#findElemArr( root, graph )
				: GSUI.#findElemObj( root, graph ) );
	}
	static #findElemArr( root, arr ) {
		return arr.map( sel => GSUI.$findElements( root, sel ) );
	}
	static #findElemObj( root, obj ) {
		if ( obj ) {
			const ent = Object.entries( obj );

			ent.forEach( kv => kv[ 1 ] = GSUI.$findElements( root, kv[ 1 ] ) );
			return Object.fromEntries( ent );
		}
	}
	static #findElemStr( root, sel ) {
		if ( Array.isArray( root ) ) {
			let el;

			Array.prototype.find.call( root, r => el = GSUI.#findElemQuery( r, sel ) );
			return el || null;
		}
		return GSUI.#findElemQuery( root, sel );
	}
	static #findElemQuery( root, sel ) {
		return root.matches( sel )
			? root
			: root.querySelector( sel );
	}

	// .........................................................................
	static #templates = new Map();
	static $setTemplate( tmpId, fn ) {
		GSUI.#templates.set( tmpId, fn );
	}
	static $hasTemplate( tmpId ) {
		return GSUI.#templates.has( tmpId );
	}
	static $getTemplate( tmpId, ...args ) {
		return GSUI.#templates.get( tmpId )( ...args );
	}

	// .........................................................................
	static $createElement( tag, attr, ...children ) {
		return GSUI.#createElement( "http://www.w3.org/1999/xhtml", tag, attr, children );
	}
	static $createElementSVG( tag, attr, ...children ) {
		return GSUI.#createElement( "http://www.w3.org/2000/svg", tag, attr, children );
	}
	static #createElement( ns, tag, attrObj, children ) {
		const el = document.createElementNS( ns, tag );

		GSUI.$setAttribute( el, attrObj );
		el.append( ...children.flat( 1 ).filter( ch => Boolean( ch ) || Number.isFinite( ch ) ) );
		return el;
	}
	static $setAttribute( el, attr, val ) {
		if ( typeof attr === "string" ) {
			GSUI.#setAttribute( el, attr, val );
		} else if ( attr ) {
			Object.entries( attr ).forEach( kv => GSUI.#setAttribute( el, ...kv ) );
		}
	}
	static $setGetAttribute( el, attr, val ) {
		GSUI.#setAttribute( el, attr, val );
		return GSUI.$getAttribute( el, attr );
	}
	static #setAttribute( el, attr, val ) {
		val !== false && val !== null && val !== undefined
			? el.setAttribute( attr, val === true ? "" : val )
			: el.removeAttribute( attr );
	}
	static $hasAttribute( el, attr ) {
		return el.hasAttribute( attr );
	}
	static $getAttribute( el, attr ) {
		return el.getAttribute( attr );
	}
	static $getAttributeNum( el, attr ) {
		const val = el.getAttribute( attr );
		const n = +val;

		if ( Number.isNaN( n ) ) {
			console.error( `GSUI.$getAttributeNum: ${ attr } is NaN (${ val })` );
		}
		return n;
	}

	// .........................................................................
	static $emptyElement( el ) {
		while ( el.lastChild ) {
			el.lastChild.remove();
		}
	}

	// .........................................................................
	static $unselectText() {
		window.getSelection().removeAllRanges();
	}
}
