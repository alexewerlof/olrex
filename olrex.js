require([ 'knockout' ], function ( ko ) {

    //** quote a string (and replace all new lines with \n)
    function quote ( str ) {
        return '"' + str.replace( /\n/g, '\\n' ) + '"';
    }

    //** quote all elements of an array
    function quoteArr ( arr ) {
        if ( arr ) {
            var ret = [];
            for ( var i = 0; i < arr.length; i++ ) {
                ret.push( quote( arr[i] ) );
            }
            return ret;
        } else {
            return arr;
        }
    }

    function ViewModel ( initialStr, initialRegexp, initialReplaceStr, initialGFlag, initialIFlag, initialMFlag ) {
        var self = this;
        self.str = ko.observable( initialStr );
        self.strQ = ko.computed( function () {
            return quote( self.str() );
        });
        self.regexpStr = ko.observable( initialRegexp );
        self.gFlag = ko.observable( initialGFlag );
        self.iFlag = ko.observable( initialIFlag );
        self.mFlag = ko.observable( initialMFlag );
        self.replaceStr = ko.observable( initialReplaceStr );
        self.replaceStrQ = ko.computed( function () {
            return quote( self.replaceStr() );
        });
        self.error = ko.observable( '' );
        self.regexp = ko.computed( function () {
            var ret = null;
            try {
                self.error( '' );
                var flags = '';
                if ( self.gFlag() ) { flags += 'g'; }
                if ( self.iFlag() ) { flags += 'i'; }
                if ( self.mFlag() ) { flags += 'm'; }
                ret = new RegExp( self.regexpStr(), flags );
            } catch ( ex ) {
                self.error( ex );
            }
            return ret;
        });
        self.replaceResult = ko.computed( function () {
            return self.regexp() ? quote( self.str().replace( self.regexp(), self.replaceStr() ) ) : null;
        });
        self.matchResult = ko.computed( function () {
            return self.regexp() ? quoteArr( self.str().match( self.regexp() ) ) : null;
        });
        self.execResult = ko.computed( function () {
            return self.regexp() ? quoteArr( self.regexp().exec( self.str() ) ) : null;
        });
        self.testResult = ko.computed( function () {
            return self.regexp() ? self.regexp().test( self.str() ) : null;
        });
        self.searchResult = ko.computed( function () {
            return self.regexp() ? self.str().search( self.regexp() ) : null;
        });
        self.splitResult = ko.computed( function () {
            return self.regexp() ? quoteArr( self.str().split( self.regexp() ) ) : null;
        });
    }

    ko.applyBindings( new ViewModel( 'orange, apple, banana', ",", ' and', true, true, false ) );
});
