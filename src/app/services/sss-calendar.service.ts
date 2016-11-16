import { Injectable, 
		 EventEmitter } 	from "@angular/core";

import { Http } 			from "@angular/http";

import { Observable } 		from "rxjs/Observable";

import { SSSAPIService }    from "./sss-api.service";
import { SSSTabService }    from "./sss-tab.service";
import { SSSNodeService } 	from "./sss-node.service";


@Injectable()
export class SSSCalendarService {

    _emitterCalendarUpdated : EventEmitter<any> = new EventEmitter();
    http 					: Http;
    calendarsInMemory 		: Array<Object>;
    highlightyear 			: any;
    highlightmonth 			: any;
    highlightday 			: any;
    calendarDayArray 		: Array<Object>;

  	
    constructor( http: Http,
                 public apiService: SSSAPIService,
                 public tabService: SSSTabService,
                 public nodeService: SSSNodeService ) { 

	    let todaydate = new Date(); 

        if ( !JSON.parse( localStorage.getItem("calendarsInMemory") ) ) {
             localStorage.setItem("lastUpdate", JSON.stringify( Date.now() ) );
             localStorage.setItem("calendarsInMemory", JSON.stringify( [] ) ); }
        if ( !JSON.parse( localStorage.getItem("highlightyear") ) ) {	
             localStorage.setItem("lastUpdate", JSON.stringify( Date.now() ) );		
             localStorage.setItem("highlightyear", JSON.stringify( todaydate.getFullYear() ) );	 }
        if ( !JSON.parse( localStorage.getItem("highlightmonth") ) ) {
             localStorage.setItem("lastUpdate", JSON.stringify( Date.now() ) );
             localStorage.setItem("highlightmonth", JSON.stringify( todaydate.getMonth() ) ); }
        if ( !JSON.parse( localStorage.getItem("highlightday") ) ) {
             localStorage.setItem("lastUpdate", JSON.stringify( Date.now() ) );
             localStorage.setItem("highlightday", JSON.stringify( todaydate.getDate() ) ); }

        this.calendarsInMemory = JSON.parse( localStorage.getItem("calendarsInMemory") );
        this.highlightyear     = JSON.parse( localStorage.getItem("highlightyear") );
        this.highlightmonth    = JSON.parse( localStorage.getItem("highlightmonth") );
        this.highlightday      = JSON.parse( localStorage.getItem("highlightday") );
        this.calendarDayArray  = JSON.parse( localStorage.getItem("calendarDayArray") ) || [];

    }


    pushCalendarInMemory( calendarnodeid ) {

        if( this.calendarsInMemory.length === 0 ) { this.updateCalendarDayArray(); } // FIRST ADDITION   

        let originalposition = this.calendarsInMemory.indexOf( calendarnodeid ); 
        
        if( originalposition !== -1 ) { this.calendarsInMemory.splice( originalposition, 1 ); } // NO DUPLICATES 

        this.calendarsInMemory.push( calendarnodeid );

        this.localUpdateCalendarsInMemory( this.calendarsInMemory );

    };


    unshiftCalendarInMemory( calendarnodeid ) {

        if( this.calendarsInMemory.length === 0 ) { this.updateCalendarDayArray(); } // FIRST ADDITION  

        let originalposition = this.calendarsInMemory.indexOf( calendarnodeid ); 
        
        if( originalposition !== -1 ) { this.calendarsInMemory.splice( originalposition, 1 ); } // NO DUPLICATES

        this.calendarsInMemory.unshift( calendarnodeid ); 

        this.localUpdateCalendarsInMemory( this.calendarsInMemory );
    };  


    updateHighlightDate( year, month, day ) {
    	this.setHighlightyear( year );
    	this.setHighlightmonth( month );
    	this.setHighlightday( day );
    };


    updateHighlightUTCDate( utcint ) {

        let dateobj = new Date( utcint );

        this.setHighlightyear( dateobj.getFullYear() );
        this.setHighlightmonth( dateobj.getMonth() );
        this.setHighlightday( dateobj.getDate() );
    };


    updateCalendarDayArray() {

        // THIS FUNCTION IS EXPENSIVE EXPENSIVE
        // ######## PERHAPS SOME SORT OF CACHING TO FIRST CHECK ##########  MAYBE AN ARGUMENT IS THE FLAG RELATIVE TO CURRENT CALENDAR ### ESLE JUST RETURN CACHED ARRY INSTEAD OF REROLLING IT

    	// THESE STORED IN LOCAL VARIABLES SINCE WE DON'T NEED INVOKE EVERYTIME DURING ITERATION
		let daysinmonth_previous_month  	= this.getDaysInMonth( this.getPreviousMonthInt() ), 				
    	    daysinmonth_current_month 	 	= this.getDaysInMonth( this.highlightmonth ),
    	    previous_year 					= this.getPreviousYear(),
    	    current_year					= this.highlightyear,
    	    following_year 					= this.getFollowingYear(),
    	    previous_month 					= this.getPreviousMonthInt(),
    	    current_month					= this.highlightmonth,
    	    following_month 				= this.getFollowingMonthInt(),
    	    startday 	 					= this.getHighlightMonthStartDayOfWeek(),
            newcalarray = [];

    	for(let i = 0; i < 42; ++i) {

    		if ( i < startday ) { 
    		// previous day object

                let day       		= daysinmonth_previous_month + (i + 1) - startday,
                    datestamp 		= Date.UTC( previous_year, previous_month, day + 1 );

                newcalarray.push({
                    "datestamp"     : datestamp,
                    "daynumber"     : day,
                    "position"      : "previous",
                    "isEmpty"       : this.getDayInventoryCount( this.calendarsInMemory[0], datestamp ) // MUST DO FETCH AND TEST IF DATE TAB IS UNDEFINED
                });
    		} 
    		else if ( i >= startday && i <= daysinmonth_current_month + startday - 1) { 
    		// current day object

    			let day 			= (i + 1) - startday,
					datestamp 		= Date.UTC( current_year, current_month, day + 1);

    			newcalarray.push({
    				"datestamp"		: datestamp,
    				"daynumber"		: day,
    				"position"		: "current",
    				"isEmpty" 		: this.getDayInventoryCount( this.calendarsInMemory[0], datestamp ) // MUST DO FETCH AND TEST IF DATE TAB IS UNDEFINED
    			});
    		} 
    		else if ( i > daysinmonth_current_month + startday - 1) { 
    		// following day object

    			let day 			= i - startday + 1 - daysinmonth_current_month,
 					datestamp 		= Date.UTC( following_year, following_month, day + 1 );

    			newcalarray.push({
    				"datestamp"		: datestamp, 
    				"daynumber"		: day,
    				"position"		: "following",
    				"isEmpty" 		: this.getDayInventoryCount( this.calendarsInMemory[0], datestamp ) // MUST DO FETCH AND TEST IF DATE TAB IS UNDEFINED
    			});
    		} 
    	}

        // while( newcalarray.lenght < 42 ) { /* stall until promises have completed */ }

		this.setCalendarDayArray( newcalarray ); // 42 ELEMENTS
        this._emitterCalendarUpdated.next({});
    }


    forwardCalendar() { 

        let oldtarget = this.calendarsInMemory[0];

        this.calendarsInMemory.splice( 0, 1 );

        this.pushCalendarInMemory( oldtarget );
    };

    
    backwardCalendar() {

        let oldtarget = this.calendarsInMemory.pop();

        this.unshiftCalendarInMemory( oldtarget );
    };


    resetCalendarsInMemory() {
        this.calendarsInMemory = [];
        this.localUpdateCalendarsInMemory([]);
    }

    
    rollDateString( utcstring, size ) {

        let returndate,
        	monthsbyname         = [ "January", "February", "March", "April", "May", "June", "July",
                                     "August", "September", "October", "November", "December" ];

        if( size === 'full' ) { returndate = new Date( parseInt(utcstring, 10) ); }

        switch ( size )
        {
            case 'short':   return monthsbyname[ this.highlightmonth ] + " " + this.highlightyear;
            case 'full':    return monthsbyname[ returndate.getMonth() ] + ' ' + returndate.getDate() + ', ' + returndate.getFullYear();
            default:        return;
        }
    };


    gotopreviousmonth() {

        this.highlightmonth == 0 
        ? this.updateHighlightDate( this.highlightyear - 1, this.getPreviousMonthInt(), 1 )
        : this.updateHighlightDate( this.highlightyear, this.getPreviousMonthInt(), 1 );

        this.updateCalendarDayArray();   
    };


    gotonextmonth() {

        this.highlightmonth == 11 
        ? this.updateHighlightDate( this.highlightyear + 1, this.getFollowingMonthInt(), 1 )
        : this.updateHighlightDate( this.highlightyear, this.getFollowingMonthInt(), 1 );

        this.updateCalendarDayArray();   
    };


    getCurrentCalendarName(){ 

        let _self = this;

        return Observable.create((observer) => {

            _self.nodeService.getNodeTitle( _self.calendarsInMemory[0] )
                 .subscribe( args => { 
                    observer.next( args );
                    observer.complete();
                 });
        }); 
    };


    getDayInventoryCount( calendarnodeid, dayutc ) {

        let tabobj = this.tabService.getTabInMemoryByKey( calendarnodeid + '_' + dayutc);
        // ONLY A DEFAULT DAY DATE IMAGE
        // BECAUSE THIS DOESN"T ACCOUNT FOR LINGERING BLANKS
        if( tabobj === undefined) {
            return true;
        } else if(tabobj.inventory.length === 1 && tabobj.inventory[0]["_id"].substring(0, 8) !== 'GGGGGGGG') { 
            return true;
        } else if( tabobj.inventory.length > 0 ) { // HAS ACTUAL CONTENT
            return false;
        } else {
            return true; // ALL VACANT
        }
    };

    getCurrentCalendarID()               { return this.calendarsInMemory[0]; };

    getCalendarDateString()              { return this.rollDateString( null, 'short'); };

    getCustomFullDateString( utcstring ) { return this.rollDateString( utcstring, 'full'); };

    getCalendarDayArray()                { return this.calendarDayArray; };

    getUTCDateString()             		 { return Date.UTC( this.highlightyear, this.highlightmonth, this.highlightday + 1 ); };

    getPreviousMonthInt() 				 { return this.highlightmonth == 0  ? 11 : this.highlightmonth - 1; }

    getFollowingMonthInt()             	 { return this.highlightmonth == 11 ? 0  : this.highlightmonth + 1; }

    getPreviousYear()             		 { return this.highlightmonth == 0  ? this.highlightyear - 1 : this.highlightyear; }

    getFollowingYear()             		 { return this.highlightmonth == 11 ? this.highlightyear + 1 : this.highlightyear; }

 	getHighlightMonthStartDayOfWeek()    { return new Date( this.highlightyear, this.highlightmonth, 1).getDay(); }
    
    getDaysInMonth( intarg )     		 {

    	let montharray;

		(( this.highlightyear % 4 == 0) && ( this.highlightyear % 100 != 0)) || ( this.highlightyear % 400 == 0)
		? montharray = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
		: montharray = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

		return montharray[ intarg ];
    }


    getCurrentCalendarColor() { 

        let _self = this;

        return Observable.create((observer) => {
            _self.nodeService.getNodeColor( _self.calendarsInMemory[0] )
                .subscribe( args => { 
                    observer.next( args );
                    observer.complete();
                });
        }); 
    };


    setHighlightyear( intarg ) { 
    	this.highlightyear = intarg; 
    	this.localUpdateHighlightyear( this.highlightyear );
    };

    setHighlightmonth( intarg ) {
    	this.highlightmonth = intarg; 
    	this.localUpdateHighlightmonth( this.highlightmonth );
    };

    setHighlightday( intarg ) { 
    	this.highlightday = intarg; 
    	this.localUpdateHighlightday( this.highlightday );
    };

    setCalendarDayArray( arrayarg ) { 
    	this.calendarDayArray = arrayarg; 
    	this.localUpdateCalendarDayArray( arrayarg );
    };

    localUpdateHighlightyear( intarg ) { 
        localStorage.setItem("highlightyear", JSON.stringify( intarg ) );
        localStorage.setItem("lastUpdate", JSON.stringify( Date.now() ) );
	};

	localUpdateHighlightmonth( intarg ) { 
        localStorage.setItem("highlightmonth", JSON.stringify( intarg ) );
        localStorage.setItem("lastUpdate", JSON.stringify( Date.now() ) );
	};

	localUpdateHighlightday( intarg ) { 
        localStorage.setItem("highlightday", JSON.stringify( intarg ) );
        localStorage.setItem("lastUpdate", JSON.stringify( Date.now() ) );
	};

	localUpdateCalendarDayArray( arrayarg ) { 
        localStorage.setItem("calendarDayArray", JSON.stringify( arrayarg ) );
        localStorage.setItem("lastUpdate", JSON.stringify( Date.now() ) );
	};

	localUpdateCalendarsInMemory( calobj ) {
        localStorage.setItem("calendarsInMemory", JSON.stringify( calobj ) );
        localStorage.setItem("lastUpdate", JSON.stringify( Date.now() ) );
	}
}
