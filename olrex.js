/** Copyright (C) 2013 Alex Hanif */

//**writes a log on javascript console (works only if console.log() is available
function log ( msg ) {
    if ( "log" in console ) {
        console.log( msg );
    }
}

//** returns the result of an operation in string format. if it is null, it returns "null". if it is boolean, it returns "true" or "false". if it is an array it returns all the elements
function result ( res ) {
    switch ( typeof res ) {
        case 'boolean':
            return 'boolean: ' + res;
        case 'number':
            return 'number: ' + res.toString();
        case 'string':
            return 'string: "' + res + '"';
        case 'object':
            if ( res === null ) {
                //result is null
                return 'null';
            } else if ( 'length' in res ) {
                //result is an array
                var ret = 'Array[' + res.length + ']: [ ';
                for ( var i = 0 ; i < res.length ; i++ ) {
                    ret += '"' + res[i] + '"';
                    if ( i < res.length - 1 ) {
                        ret += ', ';
                    }
                }
                ret += ' ]';
                return ret;
            } else {
                return 'A non-array non-null object';
            }
        default:
            return 'Unexpected result type: ' + typeof res;
    }
}

//** updates the copies of regexp and string text in the page
function updateCopies () {
    var regexp = $( "#regexp-txt" ).val();
    var string = $( "#string-txt" ).val();
    $( '.regexp-copy' ).text( regexp );
    $( '.string-copy' ).text( '"' + string + '"' );
    //parse the string to see if it is useful as a regular expression
    var r = regexp.match( "^\/(.+?)\/([mig])*$" );
    if ( r === null ) {
        $( '#regexp-txt' ).addClass( 'error' );
        $( '.results' ).empty();
        log( 'Could not parse the regular expression' );
        return;
    } else {
        $( '#regexp-txt' ).removeClass( 'error' );
        log( 'regular expression parsed to: ' + r );
    }
    if ( r[2] === null ) {
        var rex = new RegExp( r[1] );
    } else {
        var rex = new RegExp( r[1], r[2] );
    }
    if ( rex === null ) {
        $( '#regexp-txt' ).addClass( 'error' );
        $( '.results' ).empty();
        return;
    } else {
        $( '#regexp-txt' ).removeClass( 'error' );
    }
    log( 'regular expression source: ' + rex.source );
    $( '#test-result' ).text( result( rex.test( string ) ) );
    $( '#match-result' ).text( result( string.match( rex ) ) );
    $( '#exec-result' ).text( result( rex.exec( string ) ) );
    $( '#search-result' ).text( result( string.search( rex ) ) );
    $( '.replace-str-copy' ).text( $( '#replace-str-txt' ).val() );
    $( '#replace-result' ).text( result( string.replace( rex, $( '#replace-str-txt' ).val() ) ) );
    $( '#split-result' ).text( result( string.split( rex ) ) );
}

//** runs when the document is loaded and ready
$( document ).ready( function ( e ) {
    updateCopies();
    $( '#regexp-txt' ).change( updateCopies ).keyup( updateCopies );
    $( '#string-txt' ).change( updateCopies ).keyup( updateCopies );
    $( '#replace-str-txt' ).change( updateCopies ).keyup( updateCopies );
});