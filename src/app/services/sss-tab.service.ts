import { Injectable,
		 EventEmitter } 	from '@angular/core';

import { Http } 			from "@angular/http";

import { Observable } 	 	from "rxjs/Observable";
// import { Observable } 		from "rxjs/Rx";
// import 'rxjs/Rx'

import { SSSAPIService }    from "./sss-api.service";
import { SSSNodeService }   from "./sss-node.service";


@Injectable()
export class SSSTabService {

    _emitterTabInventoryUpdated 	: EventEmitter<any>     = new EventEmitter();
    _emitterTabCurrentDateUpdated 	: EventEmitter<any> 	= new EventEmitter();
    _emitterTabCurrentTabUpdated 	: EventEmitter<any> 	= new EventEmitter();

    http 							: Http;
    tabsInMemory 					: Object;
    folderNodeTabCollection 		: Array<Object>;
    calendarNodeTabCollection 		: Array<Object>;
    posterNodeTabCollection 		: Array<Object>;
    stubNodeTabCollection 			: Array<Object>;
    vacantNodeTabCollection 		: Array<Object>;

  	constructor( http  				: Http,
                 public apiService 	: SSSAPIService,
                 public nodeService : SSSNodeService) {

        this.http = http;

        if ( !JSON.parse( localStorage.getItem("tabsInMemory") ) ) {
             localStorage.setItem("lastUpdate", JSON.stringify( Date.now() ) );
             localStorage.setItem("tabsInMemory", JSON.stringify( {} ) );
        }

        this.tabsInMemory = JSON.parse( localStorage.getItem("tabsInMemory") );

        this.folderNodeTabCollection     = [

            {
                "label"     : "All",
                "template"  : "card_template",
                "name"      : "all",
                "leaf"      : "ALLRESOURCES",
                "refine"    : [],
                "visible"   : true,
                "hovermenu" : false
            },
            {
                "label"     : "Pre-K",
                "template"  : "card_template",
                "name"      : "pre-k",
                "leaf"      : "ALLRESOURCES",
                "refine"    : [ "pre-k" ],
                "visible"   : true,
                "hovermenu" : false
            },
            {
                "label"     : "Kindergarten",
                "template"  : "card_template",
                "name"      : "kinder",
                "leaf"      : "ALLRESOURCES",
                "refine"    : [ "kinder" ],
                "visible"   : true,
                "hovermenu" : false
            },
            {
                "label"     : "1st",
                "template"  : "card_template",
                "name"      : "first",
                "leaf"      : "ALLRESOURCES",
                "refine"    : [ "1st" ],
                "visible"   : true,
                "hovermenu" : false
            },
            {
                "label"     : "2nd",
                "template"  : "card_template",
                "name"      : "second",
                "leaf"      : "ALLRESOURCES",
                "refine"    : [ "2nd" ],
                "visible"   : true,
                "hovermenu" : false
            },
            {
                "label"     : "3rd",
                "template"  : "card_template",
                "name"      : "third",
                "leaf"      : "ALLRESOURCES",
                "refine"    : [ "3rd" ],
                "visible"   : true,
                "hovermenu" : false
            },
            {
                "label"     : "4th",
                "template"  : "card_template",
                "name"      : "fourth",
                "leaf"      : "ALLRESOURCES",
                "refine"    : [ "4th" ],
                "visible"   : true,
                "hovermenu" : false
            },
            {
                "label"     : "5th",
                "template"  : "card_template",
                "name"      : "fifth",
                "leaf"      : "ALLRESOURCES",
                "refine"    : [ "5th" ],
                "visible"   : true,
                "hovermenu" : false
            },
            {
                "label"     : "6th",
                "template"  : "card_template",
                "name"      : "sixth",
                "leaf"      : "ALLRESOURCES",
                "refine"    : [ "6th" ],
                "visible"   : true,
                "hovermenu" : false
            },
            {
                "label"     : "7th",
                "template"  : "card_template",
                "name"      : "seventh",
                "leaf"      : "ALLRESOURCES",
                "refine"    : [ "7th" ],
                "visible"   : true,
                "hovermenu" : false
            },
            {
                "label"     : "8th",
                "template"  : "card_template",
                "name"      : "eighth",
                "leaf"      : "ALLRESOURCES",
                "refine"    : [ "8th" ],
                "visible"   : true,
                "hovermenu" : false
            },
            {
                "label"     : "9th",
                "template"  : "card_template",
                "name"      : "ninth",
                "leaf"      : "ALLRESOURCES",
                "refine"    : [ "9th" ],
                "visible"   : true,
                "hovermenu" : false
            },
            {
                "label"     : "10th",
                "template"  : "card_template",
                "name"      : "tenth",
                "leaf"      : "ALLRESOURCES",
                "refine"    : [ "10th" ],
                "visible"   : true,
                "hovermenu" : false
            },
            {
                "label"     : "11th",
                "template"  : "card_template",
                "name"      : "eleventh",
                "leaf"      : "ALLRESOURCES",
                "refine"    : [ "11th" ],
                "visible"   : true,
                "hovermenu" : false
            },
            {
                "label"     : "12th",
                "template"  : "card_template",
                "name"      : "twelth",
                "leaf"      : "ALLRESOURCES",
                "refine"    : [ "12th" ],
                "visible"   : true,
                "hovermenu" : false
            },
            {
                "label"     : "College",
                "template"  : "card_template",
                "name"      : "college",
                "leaf"      : "ALLRESOURCES",
                "refine"    : [ "college" ],
                "visible"   : true,
                "hovermenu" : false
            },
            {
                "label"     : "",
                "template"  : "eggshell_template",
                "name"      : "vacant",
                "leaf"      : "",
                "refine"    : [],
                "visible"   : false,
                "hovermenu" : false
            }, 
            {
                "label"     : "",
                "template"  : "textarea_template",
                "name"      : "stub",
                "leaf"      : "",
                "refine"    : [],
                "visible"   : false,
                "hovermenu" : false
            },
            {
                "label"     : "Edit",
                "template"  : "edit_template",
                "name"      : "edit",
                "leaf"      : "",
                "refine"    : [],
                "visible"   : true,
                "hovermenu" : false
            },
            {
                "label"     : "Tags",
                "template"  : "grid_template",
                "name"      : "tags",
                "leaf"      : "",
                "refine"    : [],
                "visible"   : true,
                "hovermenu" : false
            },
            {
                "label"     : "Menu",
                "template"  : "menu_template",
                "name"      : "menu",
                "leaf"      : "",
                "refine"    : [],
                "visible"   : false,
                "hover"     : false,
                "hovermenu" : false
            },
            {
                "label"     : "Basic",
                "template"  : "basic_template",
                "name"      : "basic",
                "leaf"      : "",
                "refine"    : [],
                "visible"   : false,
                "hovermenu" : true
            },
            {
                "label"     : "Coin",
                "template"  : "coin_template",
                "name"      : "coin",
                "leaf"      : "",
                "refine"    : [],
                "visible"   : false,
                "hovermenu" : false
            },
            {
                "label"     : "Headline",
                "template"  : "link_template",
                "name"      : "headline",
                "leaf"      : "",
                "refine"    : [],
                "visible"   : false,
                "hovermenu" : false
            },
            {
                "label"     : "SSS Button",
                "template"  : "button_template",
                "name"      : "button",
                "leaf"      : "",
                "refine"    : [],
                "visible"   : false,
                "hovermenu" : false
            },
            {
                "label"     : "Destinations",
                "template"  : "relay_template",
                "name"      : "destinations",
                "leaf"      : "",
                "refine"    : [],
                "visible"   : false,
                "hovermenu" : false
            },
            {
                "label"     : "Modal",
                "template"  : "sss-modal_template",
                "name"      : "modal",
                "leaf"      : "",
                "refine"    : [],
                "visible"   : false,
                "hovermenu" : false
            },
            {
                "label"     : "Calendar",
                "template"  : "sss-calendar_template",
                "name"      : "calendar",
                "leaf"      : "",
                "refine"    : [],
                "visible"   : false,
                "hovermenu" : false
            }
        ];

        this.calendarNodeTabCollection   = [   

            {
                "label"     : null,
                "template"  : "card_template",
                "name"      : "day",
                "leaf"      : null,
                "refine"    : [],
                "visible"   : true,
                "hovermenu" : false
            },
            {
                "label"     : "State Standards",
                "template"  : "table_template",
                "name"      : "statestandards",
                "leaf"      : "statestandards",
                "refine"    : [],
                "visible"   : true,
                "hovermenu" : false
            },
            {
                "label"     : "Participation",
                "template"  : "table_template",
                "name"      : "participation",
                "leaf"      : "subscibers", 
                "refine"    : [],
                "visible"   : true,
                "hovermenu" : false
            },
            {
                "label"     : "Subscribers",
                "template"  : "table_template",
                "name"      : "subscibers",
                "leaf"      : "subscibers",
                "refine"    : [],
                "visible"   : true,
                "hovermenu" : false
            },
            {
                "label"     : "Month",
                "template"  : "card_template",
                "name"      : "month",
                "leaf"      : null,
                "refine"    : [],
                "visible"   : true,
                "hovermenu" : false
            },
            {
                "label"     : "Edit",
                "template"  : "edit_template",
                "name"      : "edit", 
                "leaf"      : null,
                "refine"    : [],
                "visible"   : true,
                "hovermenu" : false
            },
            {
                "label"     : "",
                "template"  : "eggshell_template",
                "name"      : "vacant", 
                "leaf"      : "",
                "refine"    : [],
                "visible"   : false,
                "hovermenu" : false
            }, 
            {
                "label"     : "",
                "template"  : "textarea_template",
                "name"      : "stub",
                "leaf"      : "",
                "refine"    : [],
                "visible"   : false,
                "hovermenu" : false
            },
            {
                "label"     : "Tags",
                "template"  : "grid_template",
                "name"      : "tags",
                "leaf"      : "",
                "refine"    : [],
                "visible"   : false,
                "hovermenu" : false
            },
            {
                "label"     : "Menu",
                "template"  : "menu_template",
                "name"      : "menu",
                "leaf"      : "",
                "refine"    : [],
                "visible"   : false,
                "hovermenu" : false
            },
            {
                "label"     : "Basic",
                "template"  : "basic_template",
                "name"      : "basic",
                "leaf"      : "",
                "refine"    : [],
                "visible"   : false,
                "hovermenu" : true
            },
            {
                "label"     : "Coin",
                "template"  : "coin_template",
                "name"      : "coin",
                "leaf"      : "",
                "refine"    : [],
                "visible"   : false,
                "hovermenu" : false
            },
            {
                "label"     : "Headline",
                "template"  : "link_template",
                "name"      : "headline",
                "leaf"      : "",
                "refine"    : [],
                "visible"   : false,
                "hovermenu" : false
            },
            {
                "label"     : "SSS Button",
                "template"  : "button_template",
                "name"      : "button",
                "leaf"      : "",
                "refine"    : [],
                "visible"   : false,
                "hovermenu" : false
            },
            {
                "label"     : "Destinations",
                "template"  : "relay_template",
                "name"      : "destinations",
                "leaf"      : "",
                "refine"    : [],
                "visible"   : false,
                "hovermenu" : false
            },
            {
                "label"     : "Modal",
                "template"  : "sss-modal_template",
                "name"      : "modal",
                "leaf"      : "",
                "refine"    : [],
                "visible"   : false,
                "hovermenu" : false
            },
            {
                "label"     : "Calendar",
                "template"  : "sss-calendar_template",
                "name"      : "calendar",
                "leaf"      : "",
                "refine"    : [],
                "visible"   : false,
                "hovermenu" : false
            }
        ];

        this.posterNodeTabCollection     = [ 

            {
                "label"     : "View",
                "template"  : "iframe_template",
                "name"      : "all",
                "leaf"      : "ALLRESOURCES",
                "refine"    : [],
                "visible"   : true,
                "hovermenu" : false
            },
            {
                "label"     : "Schedule?",
                "template"  : "iframe_template",
                "name"      : "schedule",
                "leaf"      : "ALLRESOURCES",
                "refine"    : [],
                "visible"   : true,
                "hovermenu" : false
            },
            {
                "label"     : "Add to Folder?",
                "template"  : "iframe_template",
                "name"      : "schedule",
                "leaf"      : "ALLRESOURCES",
                "refine"    : [],
                "visible"   : true,
                "hovermenu" : false
            },
            {
                "label"     : "State Standards",
                "template"  : "table_template",
                "name"      : "statestandards",
                "leaf"      : "statestandards",
                "refine"    : [],
                "visible"   : true,
                "hovermenu" : false
            },
            {
                "label"     : "English",
                "template"  : "iframe_template",
                "name"      : "english",
                "leaf"      : "ALLRESOURCES",
                "refine"    : [],
                "visible"   : true,
                "hovermenu" : false
            },
            {
                "label"     : "Spanish",
                "template"  : "iframe_template",
                "name"      : "spanish",
                "leaf"      : "ALLRESOURCES",
                "refine"    : [],
                "visible"   : true,
                "hovermenu" : false
            },
            {
                "label"     : "",
                "template"  : "eggshell_template",
                "name"      : "vacant",
                "leaf"      : "",
                "refine"    : [],
                "visible"   : false,
                "hovermenu" : false
            }, 
            {
                "label"     : "",
                "template"  : "textarea_template",
                "name"      : "stub",
                "leaf"      : "",
                "refine"    : [],
                "visible"   : false,
                "hovermenu" : false
            },
            {
                "label"     : "Edit",
                "template"  : "edit_template",
                "name"      : "edit",
                "leaf"      : "",
                "refine"    : [],
                "visible"   : true,
                "hovermenu" : false
            },
            {
                "label"     : "Tags",
                "template"  : "grid_template",
                "name"      : "tags",
                "leaf"      : "",
                "refine"    : [],
                "visible"   : false,
                "hovermenu" : false
            },
            {
                "label"     : "Menu",
                "template"  : "menu_template",
                "name"      : "menu",
                "leaf"      : "",
                "refine"    : [],
                "visible"   : false,
                "hovermenu" : false
            },
            {
                "label"     : "Basic",
                "template"  : "basic_template",
                "name"      : "basic",
                "leaf"      : "",
                "refine"    : [],
                "visible"   : false,
                "hovermenu" : true
            },
            {
                "label"     : "Coin",
                "template"  : "coin_template",
                "name"      : "coin",
                "leaf"      : "",
                "refine"    : [],
                "visible"   : false,
                "hovermenu" : false
            },
            {
                "label"     : "Headline",
                "template"  : "link_template",
                "name"      : "headline",
                "leaf"      : "",
                "refine"    : [],
                "visible"   : false,
                "hovermenu" : false
            },
            {
                "label"     : "SSS Button",
                "template"  : "button_template",
                "name"      : "button",
                "leaf"      : "",
                "refine"    : [],
                "visible"   : false,
                "hovermenu" : false
            },
            {
                "label"     : "Destinations",
                "template"  : "relay_template",
                "name"      : "destinations",
                "leaf"      : "",
                "refine"    : [],
                "visible"   : false,
                "hovermenu" : false
            },
            {
                "label"     : "Modal",
                "template"  : "sss-modal_template",
                "name"      : "modal",
                "leaf"      : "",
                "refine"    : [],
                "visible"   : false,
                "hovermenu" : false
            },
            {
                "label"     : "Calendar",
                "template"  : "sss-calendar_template",
                "name"      : "calendar",
                "leaf"      : "",
                "refine"    : [],
                "visible"   : false,
                "hovermenu" : false
            }
        ];


        this.stubNodeTabCollection     = [ 

            {
                "label"     : "",
                "template"  : "eggshell_template",
                "name"      : "vacant",
                "leaf"      : "",
                "refine"    : [],
                "visible"   : false,
                "hovermenu" : false
            }, 
            {
                "label"     : "",
                "template"  : "textarea_template",
                "name"      : "stub",
                "leaf"      : "",
                "refine"    : [],
                "visible"   : false,
                "hovermenu" : false
            },
            {
                "label"     : "Edit",
                "template"  : "edit_template",
                "name"      : "edit",
                "leaf"      : "",
                "refine"    : [],
                "visible"   : true,
                "hovermenu" : false
            },
            {
                "label"     : "Tags",
                "template"  : "grid_template",
                "name"      : "tags",
                "leaf"      : "",
                "refine"    : [],
                "visible"   : true,
                "hovermenu" : false
            },
            {
                "label"     : "Menu",
                "template"  : "menu_template",
                "name"      : "menu",
                "leaf"      : "",
                "refine"    : [],
                "visible"   : false,
                "hovermenu" : false
            }
        ];


        this.vacantNodeTabCollection     = [ 

            {
                "label"     : "",
                "template"  : "eggshell_template",
                "name"      : "vacant",
                "leaf"      : "",
                "refine"    : [],
                "visible"   : false,
                "hovermenu" : false
            }, 
            {
                "label"     : "",
                "template"  : "textarea_template",
                "name"      : "stub",
                "leaf"      : "",
                "refine"    : [],
                "visible"   : false,
                "hovermenu" : false
            },
            {
                "label"     : "Edit",
                "template"  : "edit_template",
                "name"      : "edit",
                "leaf"      : "",
                "refine"    : [],
                "visible"   : true,
                "hovermenu" : false
            },
            {
                "label"     : "Tags",
                "template"  : "grid_template",
                "name"      : "tags",
                "leaf"      : "",
                "refine"    : [],
                "visible"   : true,
                "hovermenu" : false
            },
            {
                "label"     : "Menu",
                "template"  : "menu_template",
                "name"      : "menu",
                "leaf"      : "",
                "refine"    : [],
                "visible"   : false,
                "hovermenu" : false
            }
        ];

    }


    // PURPOSE OF THIS FUNCTION IS TO MAKE SURE THAT THE CANDIDATE NODE 
    // HAS A PREEXISTING TEMPLATE OR AUXTAB TO SUPPORT targettabstring
    qualifyUrlArgAgainstCandidateTemplate( candidatepointerobj, tabstring ) {

        // CHECK undefined SO THAT CALLER CAN RESOLVE PROMISE
        if( !candidatepointerobj ) { return Observable.create((observer) => { observer.next( false ); observer.complete(); }); }

        let _self = this;

        return Observable.create((observer) => { 

            _self.nodeService.memoizeNode( candidatepointerobj._id ).subscribe(args => {

                if( !args.type ) { 

                    observer.next( false ); observer.complete(); 

                } else {

                    let mergedarray;

                    switch( args.type ) {

                        case "folder"   : mergedarray = args.auxtabs.concat( _self.folderNodeTabCollection   ); break; // NEW OBJECT - NO MUTATION
                        case "category" : mergedarray = args.auxtabs.concat( _self.folderNodeTabCollection   ); break; // NEW OBJECT - NO MUTATION
                        case "poster"   : mergedarray = args.auxtabs.concat( _self.posterNodeTabCollection   ); break; // NEW OBJECT - NO MUTATION
                        case "stub"     : mergedarray = args.auxtabs.concat( _self.stubNodeTabCollection     ); break; // NEW OBJECT - NO MUTATION
                        case "vacant"   : mergedarray = args.auxtabs.concat( _self.vacantNodeTabCollection   ); break; // NEW OBJECT - NO MUTATION
                        case "calendar" : mergedarray = args.auxtabs.concat( _self.calendarNodeTabCollection ); break; // NEW OBJECT - NO MUTATION
                        default         : mergedarray = args.auxtabs;
                    }

                    if( mergedarray ) {

                        let flag = false;

                        for ( let tab of mergedarray ) { if( tab.name == tabstring) { flag = true; break; } }
//                           debugger
                                                  // IF flag IS STILL FALSE AFTER LOOP ABOVE
                        // if( args.type == "calendar" && !flag ) { flag = isNaN( new Date( parseInt( tabstring ) ).getTime() )  };
                        if( args.type == "calendar" && !flag ) { flag = _self.checkIfDate( tabstring ) };

                        observer.next( flag ); observer.complete(); 

                    } else {
                        observer.next( false ); observer.complete(); 
                    }
                }
            });
        });
    }


    checkIfDate( timestampstring ) {

    	let tester = new Date( parseInt( timestampstring ) );

    	return !isNaN( tester.getTime() );
    }


    // *** THE PURPOSE OF THIS UTILITY FUNCTION IS TO
    // *** 1) RESTRICT ADDITION OF CONSECUTIVE DUPLICATE NODES IN A TAB INVENTORY ARRAY OF POINTERS
    // *** 2) RESTRICT DISPLAY OF CONSECTUTIVE DUPLICATE NODES THAT MAY HAVE BEEN MANUALLY ENTERED INTO
    //        MONGO DATASTORE (BUT DO NOT DELETE THEM WHEN DENYING REQUEST TO INSTANTIATE CMPREF)

    // *** THIS IS COMPLICATED BECAUSE THE VALIDATION CHECK NEEDS TO OCCUR AT DIFFERENT MOMENTS 
    // THAT REQUIRE DIFFERENT CHECKS, SOME ALL CHECKS; OTHERS JUST ONE

    // *** (A) IT IS IMPORTANT TO CUT UP THIS FUNCTION BECAUSE WE CAN'T COUPLE ALL THESE RULES TOGETHER
    //         targetinstructions.duplicatetoppointer SHOULD BE CHECKED BEFORE COLUMB COMPONENT ROLLSTABARRAY
    // -> -> ->INVOKED AFTER processUrlNodeArguments INSIDE handleChildHashChangeEvent FROM rollNodeArray WITH 3 AS THE validationlevel argument 
    // -> -> ->NECCESARY BECAUSE AT THIS MOMENT, THE FINAL TAB ARGS FROM URLSTRING HAVE NOT BEEN APPLIED AND ONLY TEMPRORARY ONES ARE THERE
    // -> -> ->IF NEGATIVE THEN IGNORE ELEMENT FROM INDEX AND NOT CREATE CMPREF IN DOM -  BUT IT WILL NOT AFFECT THE PERSISTENT tabinformation.inventory***

    // *** (B) EVERYTHING SHOULD BE CHECKED WHEN INITIAL FLOP COMES FROM if( this.cmpRefArray.length === 0 ) { INSIDE ngAfterViewInit
    // -> -> ->INVOKED FROM rollNodeArray WITH 1 AS THE validationlevel argument
    // -> -> ->IF NEGATIVE THEN CALL WILL IGNORE INDEX ELEMENT, AND NOT CREATE CMPREF IN DOM, AND NOT INCLUDE THAT ELEMENT IN THE RETURNED ARRAY SO IT WON"T EFFECT THE tabinformation.inventory AS THE FUNCTION PROCEEDS TO updateTabINformatiopn***

    // *** (C) BECAUSE OF THE NEED TO DECOUPLE, WE DO NOT USE validateTabAdditionRestrictions FUNCTION BELOW FOR THE CHECK
    //         INSTEAD, CHECK EXPLICITLY IN configService.processDayTab and configService.processGeneralTab
    //         targetinstructions.duplicatetopdate AND targetinstructions.duplicatetoptab SHOULD BE CHECKED 
    //         WHILE CONSIDERING TO INTRODUCE A TAB URL ARG. 
    // -> -> ->IF FALSE THEN WILL DESTROY PREDECCESOR***
    comparePointerObjs( existingtargetpointerobj, candidatepointerobj, targetinstructions ) {

        // if( validationlevel === 1) { debugger; }
// if( tabid === "kurtd") { debugger; }
// if( tabid === "mysyllabi_history_ALLRESOURCES") { debugger; }
        if( !existingtargetpointerobj )                 { return true; } // REPRESENTS AN EMPTY INVENTORY ARRAY
        if( !candidatepointerobj )                      { return true; } // REPRESENTS AN EMPTY INVENTORY ARRAY ???   // SHOULD BE 0 - REPRESENTS NO ROLLARRAY AND PROBABLY A DELETE


        if( !targetinstructions.duplicatetoppointer                                   && // IF FALSE OR undefined
             candidatepointerobj._id              === existingtargetpointerobj._id )              { return false; } // { return 1; }

        if( !targetinstructions.duplicatetoptab                                       && // IF FALSE OR undefined 
             candidatepointerobj.currenttab       !=  "day"                           && // CONSECUTIVE CALENDAR NODES WILL BOTH HAVE day AS THEIR CURRENTTAB 
             candidatepointerobj._id              === existingtargetpointerobj._id    && // NECCESARY FOR FALL THROUGH
             candidatepointerobj.currenttab       !== null                            && // NECCESARY FOR FALL THROUGH
             existingtargetpointerobj.currenttab  !== null                            && // NECCESARY FOR FALL THROUGH
             candidatepointerobj.currenttab       === existingtargetpointerobj.currenttab )       { return false; } // { return 2; }

        if( !targetinstructions.duplicatetopdate                                      && // IF FALSE OR undefined
             candidatepointerobj.currenttab       ==  "day"                           && // CONSECUTIVE CALENDAR NODES WILL BOTH HAVE day AS THEIR CURRENTTAB 
             candidatepointerobj._id              === existingtargetpointerobj._id    && // NECCESARY FOR FALL THROUGH
             candidatepointerobj.currentdate      !== null                            && // NECCESARY FOR FALL THROUGH
             existingtargetpointerobj.currentdate !== null                            && // NECCESARY FOR FALL THROUGH
             candidatepointerobj.currentdate      ==  existingtargetpointerobj.currentdate + "" ) { return false; } // { return 3; }

        return true;
    }


    validateTabAddition( predeccessorpointerobj, followingpointerobj, candidatepointerobj, targetinstructions ) {

        return this.comparePointerObjs( predeccessorpointerobj, candidatepointerobj, targetinstructions )  === true && 
               this.comparePointerObjs( followingpointerobj, candidatepointerobj, targetinstructions )     === true;
    }



    contributionHouseKeeping( childpointerobj, parenttabid ) {

        let _self = this;

        return Observable.create((observer) => { 

            // _self.nodeservice.updateNodeTags( parentnodeid, Object.keys( arg._childNodeObj.tags ), [] );

            // _self.nodeService.incrementLeafCount( parentnodeobj._id, "ALLRESOURCES" );

            if( JSON.parse( localStorage.getItem("sessionobject") ) !== null &&
                JSON.parse( localStorage.getItem("sessionobject") ) !== undefined &&
                JSON.parse( localStorage.getItem("sessionobject") ).token !== undefined &&
                JSON.parse( localStorage.getItem("sessionobject") ).token !== null )  {

                _self.persistUnshiftNodeBatchToServer( parenttabid, _self.tabsInMemory[ parenttabid ].type, {
                    "inventory" : [ childpointerobj ],
                    "nodes"     : [],
                    "tabs"      : []
                }, false );
            }

            _self.localUpdateTabsInMemory( _self.tabsInMemory );

            observer.next( childpointerobj );
            observer.complete();

        });
    }


    // THIS APPEARS TO BE THE CORRECT WAY 
    deletePointerFromTabInventoryAtIndex( index, parentnodeid, parentpointerobj ) {

        let _self = this;

        return Observable.create((observer) => {

            _self.nodeService.memoizeNode( parentnodeid ).subscribe(args => {

                let tabid = _self.fetchTabid( parentpointerobj._id, 
                                              parentpointerobj.currenttab === "day" ? parentpointerobj.currentdate: "ALLRESOURCES",
                                              parentpointerobj.instance,
                                              "GUEST" );

                _self.memoizeTab( tabid, null ).subscribe(subargs => {

                    _self.tabsInMemory[ subargs._id ].inventory.splice( index, 1 );

                    // caseCadeNodeOrderChangeInTabInventory( data['_id'] )
                    //     .then(function( data ) {

                    if( JSON.parse( localStorage.getItem("sessionobject") ) !== null &&
                        JSON.parse( localStorage.getItem("sessionobject") ) !== undefined &&
                        JSON.parse( localStorage.getItem("sessionobject") ).token !== undefined &&
                        JSON.parse( localStorage.getItem("sessionobject") ).token !== null )  {

                        _self.persistUpdateTabObj( subargs._id, _self.tabsInMemory[ subargs._id ] );
                    }

                    _self.localUpdateTabsInMemory( _self.tabsInMemory );
// debugger;
                    observer.next( _self.tabsInMemory[ subargs._id ].inventory );
                    observer.complete();

                });
            });
        });
    };


    fetchChildAndParentNodeObjects( newchildnodeid, parentnodeid ) {

        let _self = this;

        return Observable.create((observer) => {

            // mAKE SURE NEW NODE IS IN MEMORY
            _self.nodeService.memoizeNode( newchildnodeid ).subscribe(arg => {

                let childNodeObj = arg;

                // gET TABID FROM NODEID
                _self.nodeService.memoizeNode( parentnodeid ).subscribe(subarg => {

                    let parentNodeObj = subarg;

                    observer.next({
                        _childNodeObj: childNodeObj,
                        _parentNodeObj: parentNodeObj
                    });
                    observer.complete();
                });
            });
        });
    }


    getLeaf( pointerobj ) {

        if( pointerobj.currenttab === "day" ) { return pointerobj.currentdate; }

        return "ALLRESOURCES";
    }



    // WE NEED THIS FUNCTION BECAUSE ITERATING THROUGH AN ARRAY AND UNSHIFTING EASH POINTER 
    // RESULTS IN A DIFFERENT ORDER THAN SIMPLY UNSHIFTING A SINGLE POINTER
    getConditionalAddInstructions( arraylength, pointerobj ) { 

        return arraylength > 1 ? pointerobj.flopinstructions : pointerobj.urlinstructions;
    }                   // > 1 MEANS AT LEAST 1 ALREADY IN "ARRAY"




    fetchReplacementQuantity( method ) { return method === "replace" || method === "delete"  ? 1 : 0 }



    fetchStartingPoint( targetinstructions, iterator, existingcountobj ) {

        if( targetinstructions                    // OPTIONAL ARG 
            ? targetinstructions.position === 0   // PERSISTENT targetinstructions
            : true ) {                            // DEFAULT VALUE

/*UNSHIFT*/ switch ( targetinstructions.method === "replace" ) { 
                case true     : return targetinstructions.position;
                case false    : return targetinstructions.position;
            }

        } else if( targetinstructions.position === -1 ) { // INDIVIDUAL/CONSECUTIVE PUSH

/*PUSH*/    switch ( targetinstructions.method === "replace" ) { 
                case true     : return existingcountobj.inventorycount === 0 
                                                       ? existingcountobj.inventorycount 
                                                       : existingcountobj.inventorycount - 1;
                case false    : return existingcountobj.inventorycount + iterator;
            }

        } else if( targetinstructions.position === existingcountobj.cmprefcount ) { // BLOCK PUSH ie -2

/*PUSH*/    switch ( targetinstructions.method === "replace" ) {  
                case true     : return existingcountobj.inventorycount === 0 
                                                       ? existingcountobj.inventorycount 
                                                       : existingcountobj.inventorycount - 1; 
                case false    : return existingcountobj.inventorycount; 
            }

        } else { 

/*INSERT*/  switch ( targetinstructions.method === "replace" ) {  
                case true     : return targetinstructions.position;
                case false    : return targetinstructions.position;
            }
        }
    }  // ??? WHAT ABOUT DELETE ???




    shouldIncludeThirdArg( method, validationflag, finalindexflag ) {
// if(stopper === "pong") {debugger;};

        if( method === "delete" ) { return false; }

        // WHAT IF THERE ARE TWO INVALIDATIONS AND DELETING JOINS THE PREDECCESSOR WITH THE FOLLOWING?
        // if( method === "replace" && validationflag !== true && finalindexflag === true ) { return false; }

        return true;
    }


    fetchSpliceArgArray( targetinstructions, iterator, existingcountobj, validationflag, candidatechildnodeobj, finalindexflag ) {

        let argarray = [];

        argarray.push( this.fetchStartingPoint( targetinstructions, iterator, existingcountobj ) );
        argarray.push( this.fetchReplacementQuantity( targetinstructions.method ) );

        if( this.shouldIncludeThirdArg( targetinstructions.method, validationflag, finalindexflag ) ) { argarray.push( candidatechildnodeobj ); }

        return argarray;
    }




    // *** THIS IS THE ONE THAT IS BOUND TO POINTER THROUGH PROCESSINSTANTIATIONS CONDITIONAL FUNCTION ABOVE
    addPointerToTabInventory( candidatechildnodeobj, parenttabid, existingcountobj, iterator, targetinstructions, validationflag, finalindexflag ) {

        // IF METHOD IS REPLACE AND THE POINTER DOESN'T PASS VALIDIATION, 
        // THEN IT WILL TRANFORM THIS INSTRUCTION TO A DELETE DOWNSTREAM IN splicestats
        if( validationflag !== true && targetinstructions.method !== "replace" ) 
            { return Observable.create((observer) => { observer.next( false ); observer.complete(); }); }

        // FALL THROUGH DISCRETE LOGIC
        if( validationflag !== true && targetinstructions.method === "replace" && finalindexflag === false ) 
            { return Observable.create((observer) => { observer.next( false ); observer.complete(); }); }  
        // FALLS THROUGH BECAUSE REPLACE (THAT ISN"T FINAL INDEX) WILL STACK ONTOP OF ITS PREDECCESSOR     


        let _self = this;

        return Observable.create((observer) => {


            let splicearray = _self.fetchSpliceArgArray( targetinstructions, 
                                                         iterator, 
                                                         existingcountobj, 
                                                         validationflag,
                                                         candidatechildnodeobj,
                                                         finalindexflag );

            // SATISFIES METHODS: AFTER, BEFORE, DELETE, REPLACE
            Array.prototype.splice.apply( _self.tabsInMemory[ parenttabid ].inventory, 
                                          splicearray );

            _self.contributionHouseKeeping( candidatechildnodeobj, parenttabid ).subscribe(args => {
            // *** RETURNS args IS AN candidatechildnodeobj

                observer.next( args );
                observer.complete();
            });
        });
    };



    fetchTabid( nodeid, keystring, instance, userid ) {

        return nodeid + "_" + keystring + "_" + instance;
    }



    // *** THIS IS THE ONE THAT THE HOVER CALENDAR AND HOVER MENU USE TO ADD A NODE POINTER TO A TAB INVENTORY
    // *** CURRENTLY THIS RELIES ON GLOBAL EVENT EMITTER / SUBSCRIBING :(
    addResourceToNode( nodeid, resourceobject, keystring, type, tabobj )           {

        let _self = this;

        return Observable.create((observer) => {

            let tabid = undefined; 

            _self.memoizeTab( tabid, type )
                 .subscribe(args => { // DATA IS EITHER A TAB FROM MEMORY,
                                      // A TAB FETCH FROM DATA STORE,
                                      // OR A NEWLY CREATED TAB OBJECT                

                    // INSERT RESOURCE INTO NEW DAY TAB OBJECT
                    _self.addNewResourceToTabByIteration( tabid, 
                                                          resourceobject, 
                                                          tabobj ).subscribe(newpointerobj => {

                        // _self.nodeService.incrementLeafCount( nodeid, keystring );

                        // if( keystring === 'ALLRESOURCES') {
                            observer.next( newpointerobj );
                            observer.complete();
                        // } else {
                        //     observer.next( newpointerobj );
                        //     observer.complete();
                        // }  
                    });
        		});  

                // THIS IS FROM THE PREVIOUS REJECT CONDITION
                // nodeservice.addTabReferenceToNode( data['_id'], 
                //                                    nodeid, 
                //   
        });
    }



    // *** THIS ONE SCANS THROUGH EXISTING NODE POINTERS IN A TAB INVENTORY ARRAY 
    // *** AND WHEN IT FINDS A VACANT, IT FILLS IT WITH A NEW NODE POINTER OBJECT
    addNewResourceToTabByIteration( tabid, nodeobj, tabobj ) {

        let _self = this;

        return Observable.create((observer) => {

            let nowDate   = new Date(),
                todayDate = new Date( nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate() ),
                _self     = this,
                _currentdate;

            nodeobj.type === 'calendar' ? _currentdate = todayDate : _currentdate = null;
            
            let objarg = { 
                "_id"           : nodeobj._id, 
                "currentdate"   : todayDate,
                "currenttab"    : "basic",
                "isFavorite"    : false,
                "isOpen"        : null 
            };

            this.memoizeTab( tabid, nodeobj.type )
                .subscribe(args => {

                    // CAPTURE A SOLID INT INSTEAD OF READING FROM VARIABLE DURING EACH ITERATION
                    let inventoryitemsamount = args.inventory.length,
                        i;

                    for(i = 0; i < inventoryitemsamount; ++i) {

                        if( args.inventory[i]["_id"].substring(0, 8) === 'HHHHHHHH') { // VACANCY FOUND

                            args.inventory[i] = objarg;

                            if( JSON.parse( localStorage.getItem("sessionobject") ) !== null &&
                                JSON.parse( localStorage.getItem("sessionobject") ) !== undefined &&
                                JSON.parse( localStorage.getItem("sessionobject") ).token !== undefined &&
                                JSON.parse( localStorage.getItem("sessionobject") ).token !== null )  {

                                _self.persistReplacePointerAtTabIndexToServer( tabid, i,  
                                               {
                                                    "inventory"     : [ objarg ],
                                                    "nodes"         : [ nodeobj ]
                                               } );
                            }

                            _self.localUpdateTabsInMemory( _self.tabsInMemory );

                            // _self._emitterTabInventoryUpdated.next( { "tabid" : tabid } );

                            return;
                        }
                    }     

                    // FALL THROUGH IF NO VACANCY FOUND
                    _self.tabsInMemory[ tabid ].inventory.unshift( objarg );

                    if( JSON.parse( localStorage.getItem("sessionobject") ) !== null &&
                        JSON.parse( localStorage.getItem("sessionobject") ) !== undefined &&
                        JSON.parse( localStorage.getItem("sessionobject") ).token !== undefined &&
                        JSON.parse( localStorage.getItem("sessionobject") ).token !== null )  {

                        _self.persistUnshiftNodeBatchToServer( tabid, 
                                                               _self.tabsInMemory[ tabid ].type, 
                                                               {
                                                                    "inventory"     : [ objarg ],
                                                                    "nodes"         : [ nodeobj ],
                                                                    "tabs"          : [ tabobj ] // WHY IS THIS HERE???
                                                               }, true ); // true for shouldinstantiate
                    }

                    _self.localUpdateTabsInMemory( _self.tabsInMemory );

                    // _self._emitterTabInventoryUpdated.next( { "tabid" : tabid } );

                    observer.next( objarg );
                    observer.complete();
            });
        });
    };


    addTabsInBatch( tabarray ) {

        let _self = this;

        return Observable.create((observer) => {

            tabarray.forEach( function(element) {

                element.instancebatch = true;

                _self.tabsInMemory[ element._id ] = element;
            });

            _self.localUpdateTabsInMemory( _self.tabsInMemory );

            observer.next();
            observer.complete();
        });
    }


    // *** THIS IS THE ONE THAT COLUMNS USED TO USE WHEN YOU 
    // *** SUBMITTED A NEW FOLDER OR CALENDAR IN THE FORM AT THE BOTTOM OF THE PAGE
    unshiftNewNodeIntoTabInventory( titlestring, idstring, parentnodeid, nodetype ) {
        
        let _self = this;

        return Observable.create((observer) => {

            if( titlestring  == 0) { return; } 

            _self.getNewColor( parentnodeid )
                 .subscribe(args => { 

                    let nodeidentificationnumber = idstring.toLowerCase().split(' ').join('-'),
                        backgroundimage;

                    if(nodetype === 'calendar') {
                        backgroundimage = '../images/inline/default_calendar.png';
                    } else {
                        backgroundimage = '../images/inline/default_folder.png';
                    }

                    // ROLL NEW PAYLOAD TO CREATE NEW NODE
                    let nodeobjectdetails = {
                        "_id"           : nodeidentificationnumber,
                        "name"          : titlestring,
                        "type"          : nodetype,
                        "color"         : args,
                        "background"    : backgroundimage,
                        "url"           : "easteregg",
                        "tags"          : {
                            "1st"       : 2,
                            "2nd"       : 2
                        },
                        "instantiations"    : {
                            "history_ALLRESOURCES"       : [ nodeidentificationnumber ]
                        },
                        "auxtabs": []
                    };

                    // ADD TO nodesInMemory OBJECT
                    // nodeservice.addNewNode( nodeobjectdetails );
                    _self.nodeService.silentAddNewNode( nodeobjectdetails );

                    let dateobj  = new Date(),
                        solidDay = Date.UTC( dateobj.getFullYear(), dateobj.getMonth(), dateobj.getDate() + 1 ),
                        tabid,
                        tabobject;

                    if(nodetype === 'calendar') {
                        tabid       = nodeidentificationnumber + "_" + solidDay;
                        tabobject   = _self.assembleNewCalendarTabObject( tabid, "calendar" );
                    } else {
                        tabid       = nodeidentificationnumber + "_ALLRESOURCES";
                        tabobject   = _self.assembleNewGenericTabObject( tabid, "folder" );
                    }

                    _self.setTabsInMemoryByKey( tabid, tabobject );

                    // NOW THAT THERE IS A NEW NODE IN MEMORY, LOOK IT UP AND ADD IT TO THE INVENTORY OF A PARENT NODE
                    _self.nodeService.memoizeNode( nodeidentificationnumber )
                         .subscribe(subargs => { 

                            _self.addResourceToNode( parentnodeid, subargs, 'ALLRESOURCES', null, tabobject )
                                 .subscribe(supersubargs => { 

                                        // CALLER POINTS URL LOCATION TO NEW NODE IMMDEIATELY AFTER RETURN 
                                        // WHICH TRIGGERS TAB CREATION AND FUTURE PERSISTENCE
                                        observer.next( nodeidentificationnumber );
                                        observer.complete();

                                 });
                        });
                });
        });
    }


    getNewColor( parentnodeid ) {

        let _self = this;

        return Observable.create((observer) => {

            _self.nodeService.memoizeNode( parentnodeid )
                 .subscribe(args => {

                    _self.memoizeTab( undefined, null )
                         .subscribe(subargs => {

                                    if( subargs.inventory[ 0 ] === undefined) {

                                        observer.next('red');
                                        observer.complete();

                                    } else {

                                        _self.nodeService.getNodeColor( subargs.inventory[ 0 ]['_id'] )
                                            .subscribe(supersubargs => { 

                                                switch ( supersubargs )
                                                {
                                                    case 'red':     observer.next('orange');
                                                                    observer.complete();
                                                    case 'blue':    observer.next('red');
                                                                    observer.complete();
                                                    case 'green':   observer.next('blue');
                                                                    observer.complete();
                                                    case 'purple':  observer.next('green');
                                                                    observer.complete();
                                                    case 'orange':  observer.next('purple');
                                                                    observer.complete();
                                                    default:        observer.next('red');
                                                                    observer.complete();
                                                }
                                          });
                                    }
                              });
                  });
        });
    }


    createNewPointer( typearg, newchildnodeid, optionaltabarg, optionaldatearg, iterator ) {

        let nowDate,
           _currentdate,
           _currenttab;

        if ( typearg === "calendar" ) {

             nowDate        = new Date()
            _currenttab     = optionaltabarg === "card" ? "day" : optionaltabarg  || "day";
            _currentdate    = optionaldatearg || Date.UTC( nowDate.getFullYear(),
                                                           nowDate.getMonth(),
                                                           nowDate.getDate() + 1 );
        } else {

            _currenttab     = optionaltabarg === "card" ? "all" : optionaltabarg  || "all";
            _currentdate    = optionaldatearg || null;
        }


        return {
            "_id"                       : newchildnodeid,
            "instance"                  : Date.now().toString() + "-" + iterator,
            "isFavorite"                : false,
            "isOpen"                    : true,
            "currenttab"                : _currenttab,
            "currentdate"               : _currentdate,
            "rollblanks"                : true, 
            "defaultchildrenstate"      : "basic",
            "style"                     : { 
                    "width"  : "250px", 
                    "height" : "271px" 
            }, 
            "layoutbehavior" : "float"
        };
    }


    fetchTagReport( nodeid, tabid, isDaemon ) {  // FALSE DAEMON? WAITS UNTIL THE END AND DELIVERS IN BATCH

        let _self           = this,
            accumulation    = {},
            parentnodeid;

        this.memoizeTab( tabid, null )
            .subscribe(args => {

                let i;

                // data.inventory.forEach( function( pointerobj, index ) {
                for(i = 0; i < args.inventory.length; ++i) {

                    // MUST UPDATE accumulation SO WE CAN BREAK OUT OF THE LOOP EARLY
                    if( _self.governerCheck( accumulation ) ) { break; }; // maybe have to move this out of nest

                    parentnodeid = args.inventory[i]["_id"];

                    _self.nodeService.memoizeNode( parentnodeid )
                         .subscribe(subargs => { 

                            if( subargs.type === 'poster') {

                                for (let tagname in subargs.tags){

                                    if( accumulation[ tagname ] === undefined ) {
                                        accumulation[ tagname ] = subargs.tags[tagname];
                                    } else {
                                        accumulation[ tagname ] = accumulation[ tagname ] + subargs.tags[tagname];
                                    }

                                    if( isDaemon ) { _self.broadcastTagPush( nodeid, tagname, subargs.tags[tagname] ); }
                                }      
                                
                            } else {

                                for (let tagname in subargs.tags){

                                    if( accumulation[ tagname ] === undefined ) {
                                        accumulation[ tagname ] = subargs.tags[tagname];
                                    } else {
                                        accumulation[ tagname ] = accumulation[ tagname ] + subargs.tags[tagname];
                                    }

                                    if( isDaemon ) { _self.broadcastTagPush( nodeid, tagname, subargs.tags[tagname] ); }
                                }     

                                // _self.fetchTagReport( ["_id"] ); // just go down recursively by one level!!!
                            }
                            
                        });
                };

                // if( !isDaemon ) { broadcastAccumulationPush( tabid, accumulation ); };

            });
    }


    broadcastAccumulationPush( nodeid, key, quantity ) {

        // $rootScope.$broadcast('tab-tagreport-updated', { 
        //                                             "tabid"         : data.leaves[ olddatestring ]['_id'],
        //                                             "currentdate"   : datestring 
        //                                          } );  

    };

    broadcastTagPush( nodeid, key, quantity ) {

        // $rootScope.$broadcast('tag-report-updated', { 
        //                                                     "nodeid"   : nodeid,
        //                                                     "key"      : key,
        //                                                     "quantity" : quantity 
        //                                             } );  
    };


    governerCheck( checkobj ) {

        if( checkobj.hasOwnProperty('pre-k')  &&
            checkobj.hasOwnProperty('kinder') &&
            checkobj.hasOwnProperty('1st') &&
            checkobj.hasOwnProperty('2nd') &&
            checkobj.hasOwnProperty('3rd') &&
            checkobj.hasOwnProperty('4th') &&
            checkobj.hasOwnProperty('5th') &&
            checkobj.hasOwnProperty('6th') &&
            checkobj.hasOwnProperty('7th') &&
            checkobj.hasOwnProperty('8th') &&
            checkobj.hasOwnProperty('9th') &&
            checkobj.hasOwnProperty('10th') &&
            checkobj.hasOwnProperty('11th') &&
            checkobj.hasOwnProperty('12th') &&
            checkobj.hasOwnProperty('college') ) {

            return true;
        } else {
            return false;
        }
    };

    fetchTabObj( tabid ) {

        let _self = this;

        return Observable.create((observer) => {

            _self.apiService.fetchTabObj( tabid ).subscribe(arg => {

                observer.next( arg );
                observer.complete();
            });
        });
    }


    getTabidPrefix( tabid )   { return tabid.split("_").slice(0, -1).join('_') + "_"; }


    // getTabidInstance( tabid ) { return tabid.split("_").pop()[0]; }


    cloneMasterTab( input_master_tabobj, instancestring ) {

        let _self = this;

        return Observable.create((observer) => { 

            let returntabobj = JSON.parse( JSON.stringify( input_master_tabobj ));

            returntabobj._id = _self.getTabidPrefix( input_master_tabobj._id ) + instancestring;

            let nowDate      = new Date(),
                randomprefix = Date.UTC( nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate() + 1 )

            returntabobj.inventory.forEach((element, index) => {

                element.instance = randomprefix + "-" + index;
            });

            observer.next( returntabobj ); 
            observer.complete(); 
        }); 
    }




    // 1. Check server/database for _1289172981729 instance or _master
    // 2. If Neither returned, then make _master locally
    // 3. If only _master returned, then make a new _instance locally
    // 4. If both _1289172981729 instance and _master returned, then use _1289172981729 instance
    interpretFetchTabInstanceResponse( responseobj, type ) {

        let _self = this;
// if( responseobj.input_data.user_tabid === "sample-class-empty_1462665600000_master") { debugger; }
        if( !responseobj.application_tab_instance_obj && !responseobj.application_tab_master_obj ) { 
// if( responseobj.input_data.user_tabid === "sample-class-empty_1462665600000_master") { debugger; }
            return Observable.create((observer) => { 
// if( responseobj.input_data.user_tabid === "sample-class-empty_1462665600000_master") { debugger; }
                observer.next( type === "calendar" ? _self.assembleNewCalendarTabObject( responseobj.input_data.user_tabid, type )
                                                   : _self.assembleNewGenericTabObject( responseobj.input_data.user_tabid, type ) ); 
                observer.complete(); 
            }); 
        }

        if( !responseobj.application_tab_instance_obj && !responseobj.application_tab_master_obj ) { 

            return Observable.create((observer) => { 

                observer.next( responseobj.application_tab_instance_obj ); 
                observer.complete(); 
            }); 
        }

        if( !responseobj.application_tab_instance_obj && responseobj.application_tab_master_obj ) { 
        // WHEN AN ID REQUESTED BUT THERE IS NO TABOBJ FOUND WITH THAT TABID SO A MASTER IS USED INSTEAD
        // THIS OCCURS BECAUSE WHEN CLONES ARE CREATED FOR A PARENT TAB, THE CHILDREN ONLY EDIT THE 
        // INSTANCE VALUE AND O NOT CREATE A NEW OBECT FROM THIS INSTANCE REFERENCE

        // ??? HOW WOULD YOU EVEN CONVINCE THE REQUESTER TO USE THE MASTER INSTEAD ???

            let _self = this;

            return Observable.create((observer) => {

                _self.cloneMasterTab( responseobj.application_tab_master_obj,
                                      responseobj.input_data.user_tabid.split("_").pop() ).subscribe(tabobj => {

                    observer.next( tabobj );
                    observer.complete();
                });
            });
        }
    }




    memoizeTab( input_tabid, type ) {
       
// if( input_tabid.slice(0,9) === "sample-cl") { debugger; }
        let _self = this;

        return Observable.create((observer) => {

            if ( _self.tabsInMemory[ input_tabid ] === undefined ) {

                _self.apiService.fetchTabInstance( input_tabid, _self.getTabidPrefix( input_tabid ) ).subscribe(payload => {

                    console.log("@@ payload", payload);
                    console.log("CRUSH 52t", input_tabid); 

                    _self.interpretFetchTabInstanceResponse( payload, type ).subscribe(interpretedobj => {
// if( payload.input_data.user_tabid === "sample-class-empty_1462665600000_master") { debugger; }
                        // UPDATE THE DATA STORE IN MEMORY WITH THE NEW TAB OBJECT
                        _self.setTabsInMemoryByKey( interpretedobj._id, interpretedobj );

                        observer.next( interpretedobj );
                        observer.complete();
                    });
                },
                (error) => {

                    console.log('REQUEST ERROR INDICATED');

                    let newtaobj = type === "calendar" ? _self.assembleNewCalendarTabObject( input_tabid, type )
                                                       : _self.assembleNewGenericTabObject( input_tabid, type );

                    // UPDATE THE DATA STORE IN MEMORY WITH THE NEW TAB OBJECT
                    _self.setTabsInMemoryByKey( input_tabid, newtaobj );

                    observer.next( newtaobj );
                    observer.complete();
                });

            } else { // fETCH TAB FROM MEMORY

                observer.next( _self.tabsInMemory[ input_tabid ] );
                observer.complete();
            }
        });
    }



    assembleNewCalendarTabObject( tabid, type ) {

        let _self = this,
            idvariable,
            vacantnodeid,
            stubnodeid;

        let dateobj         = new Date( parseInt( tabid.split("_").slice(-2, -1), 10 ) ),
            datedummy       = new Date(),
            solidDay        = new Date( dateobj.getFullYear(),
                                        dateobj.getMonth(),
                                        dateobj.getDate() );

// if( tabid === "sample-class-empty_1462665600000_master") { debugger; }
        // HACK AGAINST CIRCULAR DEPENECY ON AccountService - WHAT HAPPENED TO zEBRA STRIPING???
        if( tabid.slice(0,9) === "mysyllabi") {
 
            idvariable      = tabid; // COME FROM THE RIGHT
            vacantnodeid    = "GUEST_" + "HHHHHHHH-" + datedummy.getTime();
            stubnodeid      = "GUEST_" + "GGGGGGGG-" + datedummy.getTime();

        } else if( JSON.parse( localStorage.getItem("userobject") )._id === undefined ) {
 
            idvariable      = "GUEST_" + this.getTabidPrefix( tabid ) + tabid.split("_").slice(-2, -1); // COME FROM THE RIGHT
            vacantnodeid    = "GUEST_" + "HHHHHHHH-" + datedummy.getTime();
            stubnodeid      = "GUEST_" + "GGGGGGGG-" + datedummy.getTime();

        } else if( JSON.parse( localStorage.getItem("userobject") )._id === "mysyllabi") {

            idvariable      = this.getTabidPrefix( tabid ) + tabid.split("_").slice(-2, -1);
            vacantnodeid    = "HHHHHHHH-" + datedummy.getTime();
            stubnodeid      = "GGGGGGGG-" + datedummy.getTime();

        } else {

            idvariable      = JSON.parse( localStorage.getItem("userobject") )._id + '_' + tabid.split("_").slice(-2)[0];
            stubnodeid      = JSON.parse( localStorage.getItem("userobject") )._id + '_' + "GGGGGGGG-" + datedummy.getTime();
        }

        // tHIS ONE IS TO PUT NODES IN MEMORY (LOCALLY AND IN BATCH ON THE SERVER)
        let vacantnodeobject = {
            "_id"            : vacantnodeid,
            "name"           : "", // vACANT
            "type"           : "vacant",
            "tags"           : {},
            "color"          : "blue",
            "background"     : "", // vACANT
            "custom"         : "",
            "url"            : null,
            "subscribers"    : [],
            "instantiations" : null,
            "auxtabs"        : []
        };
// READY TO TEST IF DATABASE IS MISSING THE AUTABS
        let stubnodeobject = {
            "_id"            : stubnodeid,
            "name"           : solidDay.toDateString(),
            "type"           : "stub",
            "tags"           : {},
            "color"          : "blue",
            "background"     : "https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Blank_Calendar_page_icon.svg/220px-Blank_Calendar_page_icon.svg.png",
            "custom"         : "",
            "url"            : null,
            "subscribers"    : [],
            "instantiations" : null,
            "auxtabs"        : []
        };

        // THERE IS AN ERROR WHEN THE USER TYPES A DATE DIRECTLY INTO THE URL
        // AND THE SERVER RETURNS A DAY LEAF WITH THE WRONG FRIENDLY DATE TExT

        _self.nodeService.setNodeInMemoryByKey( vacantnodeid, vacantnodeobject );
        _self.nodeService.setNodeInMemoryByKey( stubnodeid, stubnodeobject );

        let calendardayobject = {

            "_id"                       : idvariable,
            "type"                      : type,
            "heightstate"               : "dooper",
            "percentageheight"          : 100,
            "inventory"                 : [
                {
                    "_id"                       : vacantnodeid,
                    "isFavorite"                : false,
                    "isOpen"                    : true,
                    "currenttab"                : "vacant",
                    "currentdate"               : null, 
                    "style"                     : {
                              "width"   : "250px", 
                              "height"  : "271px", 
                              "display" : "inline-block", 
                              "padding" : "30px"
                    }
                }, {
                    "_id"                       : stubnodeid,
                    "isFavorite"                : false,
                    "isOpen"                    : true,
                    "currenttab"                : "stub",
                    "currentdate"               : null,
                    "style"                     : {
                              "width"   : "250px", 
                              "height"  : "271px", 
                              "display" : "inline-block", 
                              "padding" : "30px"
                    }
                }
            ]
        };

        // 1. Tab object of the calendar date calname_472839230000
        // 2. Create nodes (but no tabs) for the vacant and stub mentioned in #2
        
        if( JSON.parse( localStorage.getItem("sessionobject") ) !== null &&
            JSON.parse( localStorage.getItem("sessionobject") ) !== undefined &&
            JSON.parse( localStorage.getItem("sessionobject") ).token !== undefined &&
            JSON.parse( localStorage.getItem("sessionobject") ).token !== null )  {

            _self.persistCreateCalendarToServer({
                                                    "tabs"          : [ calendardayobject ],
                                                    "nodes"         : [ vacantnodeobject, stubnodeobject ]
                                                });
        }

        return calendardayobject;
    };


    assembleNewGenericTabObject( tabid, type ) {

        return {
            "_id"                       : tabid,
            "type"                      : type,
            "heightstate"               : "dooper",
            "percentageheight"          : 100,
            "inventory"                 : []
        };
    };


    rollTabArray( auxtabarray, type ) {

        let _self = this;

        return Observable.create((observer) => {
            switch ( type )
            {
                case 'folder'       :      observer.next( this.folderNodeTabCollection.concat( auxtabarray   || [] ) );   observer.complete();
                case 'category'     :      observer.next( this.folderNodeTabCollection.concat( auxtabarray   || [] ) );   observer.complete();
                case 'calendar'     :      observer.next( this.calendarNodeTabCollection.concat( auxtabarray || [] ) );   observer.complete();
                case 'poster'       :      observer.next( this.posterNodeTabCollection.concat( auxtabarray   || [] ) );   observer.complete();
                case 'stub'         :      observer.next( this.stubNodeTabCollection.concat( [] ) );                      observer.complete(); // SHORTHAND TO CREATE NEW OBJECT EASILY
                case 'vacant'       :      observer.next( this.vacantNodeTabCollection.concat( auxtabarray   || [] ) );   observer.complete(); // SHORTHAND TO CREATE NEW OBJECT EASILY
                case 'promo'        :      observer.next( auxtabarray || [] );                                            observer.complete();
                case 'sponsor'      :      observer.next( auxtabarray || [] );                                            observer.complete();
                default:                   observer.next( auxtabarray || [] );                                            observer.complete(); 
                // INCLUDES COLUMNS, TAXONOMY, HISTORY, FAVORITES, & CATEGORIES
            }
        });
    }


    showMoreCalulate(tabid, heightstatestring, percentheightint) {

        this.localUpdateTabsInMemory( this.tabsInMemory );

        return [ 'beyond', percentheightint + 80 ];
    }


    toggleHeight(tabid, heightstatestring, percentheightint) {

        let returnarray;

        switch (heightstatestring) {

            case        'super'     : returnarray = [ 'collapsed'      , 0 ];  break;
            case        'dooper'    : returnarray = [ 'collapsed'      , 0 ];  break;
            case        'beyond'    : returnarray = [ 'collapsed'      , 0 ];  break;
            case        'collapsed' : returnarray = [ 'mini'           , 32 ]; break;
            case        'mini'      : returnarray = [ 'collapsed'      , 0 ];  break;
            default                 : returnarray = [ 'collapsed'      , 0 ];
        }

        this.localUpdateTabsInMemory( this.tabsInMemory );

        return returnarray;
    }


    updateFavoriteStatusOfInventoryNodeByIndex( tabid, index, bool ) {

        let _self = this;

        this.memoizeTab( tabid, null )
            .subscribe(args => {

                _self.tabsInMemory[ tabid ][ "inventory" ][ index ].isFavorite = bool;

                if( JSON.parse( localStorage.getItem("sessionobject") ) !== null &&
                    JSON.parse( localStorage.getItem("sessionobject") ) !== undefined &&
                    JSON.parse( localStorage.getItem("sessionobject") ).token !== undefined &&
                    JSON.parse( localStorage.getItem("sessionobject") ).token !== null )  {

                    _self.persistIsFavorite( tabid, index, bool );
                }

                _self.localUpdateTabsInMemory( _self.tabsInMemory );

            });
    };


    // *** THIS IS THE ONE THAT REPLACES VACANT IN GRID TEMPLATE 
    // *** AND THEN FILLS THE GAP OF ITS PREDECCESORS WITH NEW PERSISTANT VACANT NODES
    updateTabResourcesWithBatchArray(tabid, lastindex, batchobj ) {

        if( JSON.parse( localStorage.getItem("sessionobject") ) !== null &&
            JSON.parse( localStorage.getItem("sessionobject") ) !== undefined &&
            JSON.parse( localStorage.getItem("sessionobject") ).token !== undefined &&
            JSON.parse( localStorage.getItem("sessionobject") ).token !== null )  {

            this.persistPushBatchToServer( tabid, lastindex - batchobj["inventory"].length, batchobj );
        }

        this.tabsInMemory[ tabid ][ "inventory" ] = this.tabsInMemory[ tabid ][ "inventory" ].concat( batchobj["inventory"] );

        this.localUpdateTabsInMemory( this.tabsInMemory );

        this._emitterTabInventoryUpdated.next( { "tabid" : tabid } );
    };


    // *** THIS IS THE ONE THAT REPLACES VACANT IN GRID TEMPLATE
    updateResourceIndexFromTab ( tabid, index, objarg ) { 

        let _self = this;

        return Observable.create((observer) => {

            this.memoizeTab( tabid, null ).subscribe(args => {

                // DELAY PERSISTANCE FOR POSTER AND DAY TABS SO THAT EW AN PACKAGE DEFAULT NODES INSIDE EACH'S INVENTORY
                if(objarg.type !== "chronology" && objarg.type !== 'day') {
  
                    if( _self.tabsInMemory[ tabid ][ "inventory" ] === undefined &&
                        _self.tabsInMemory[ tabid ][ "inventory" ].length === 0) {

                        if( JSON.parse( localStorage.getItem("sessionobject") ) !== null &&
                            JSON.parse( localStorage.getItem("sessionobject") ) !== undefined &&
                            JSON.parse( localStorage.getItem("sessionobject") ).token !== undefined &&
                            JSON.parse( localStorage.getItem("sessionobject") ).token !== null )  {
                            _self.persistUnshiftNodeBatchToServer( tabid, _self.tabsInMemory[ tabid ].type, objarg, false );  // false for shouldinstantiate
                        }

                    } else if( _self.tabsInMemory[ tabid ][ "inventory" ].length <= index ) {

                        // DO WE EVEN EVER REACH THIS POINT???
                        if( JSON.parse( localStorage.getItem("sessionobject") ) !== null &&
                            JSON.parse( localStorage.getItem("sessionobject") ) !== undefined &&
                            JSON.parse( localStorage.getItem("sessionobject") ).token !== undefined &&
                            JSON.parse( localStorage.getItem("sessionobject") ).token !== null )  {
                            _self.persistPushBatchToServer( tabid, _self.tabsInMemory[ tabid ][ "inventory" ].length - 1, objarg );
                        }

                    } else if( _self.tabsInMemory[ tabid ][ "inventory" ].length > index ) {

                        if( JSON.parse( localStorage.getItem("sessionobject") ) !== null &&
                            JSON.parse( localStorage.getItem("sessionobject") ) !== undefined &&
                            JSON.parse( localStorage.getItem("sessionobject") ).token !== undefined &&
                            JSON.parse( localStorage.getItem("sessionobject") ).token !== null )  {
                            _self.persistReplacePointerAtTabIndexToServer( tabid, index, objarg );
                        }

                    } else {
                        console.log('ERROR PERSISTING TO SERVER');
                    }
                } 

                // its about packaging the tab already complete with its default inventory elements
                // so wait until the url is appended to the poster_ALLRESOURCES.json before persisting it to server
                // same withe default day on calendar days
                if( objarg.type !== "url"){
                    _self.tabsInMemory[ tabid ][ "inventory" ][ index ] = objarg["inventory"][0]; 
                } else {
                    _self.tabsInMemory[ tabid ][ "inventory" ][ index ] = objarg; 
                }

                _self.localUpdateTabsInMemory( _self.tabsInMemory );

                // maybe need to move this in the subscribe block above
                // _self._emitterTabInventoryUpdated.next( { "tabid" : tabid } );

                observer.next( "resource-update-complete" );
                observer.complete();

            });
        });
    };



    updateCurrentTabOfInventoryNodeByIndex( parenttabid, index, tabname, hoverstate ) {

        let _self = this;

        return Observable.create((observer) => {
// debugger;
            let readytabname,
                idvariable;

            if( !isNaN( parseInt( tabname ) ) ) { // SPECIFICALLY A DATE UTC 
                readytabname = "day"; 
            } else {
                readytabname = tabname;
            } 

            if( !_self.tabsInMemory[ parenttabid ][ "inventory" ][ index ] ) { 

                observer.next("updated");
                observer.complete();
            } // REFLECTS TEMP VACANT SCENARIO

            // debugger;
            _self.tabsInMemory[ parenttabid ][ "inventory" ][ index ].currenttab = readytabname;


            // PUT A CHECK HERE FOR EITHER TABNAME OR ANOTHER 
            if( hoverstate !== true &&
                JSON.parse( localStorage.getItem("sessionobject") ) !== null &&
                JSON.parse( localStorage.getItem("sessionobject") ) !== undefined &&
                JSON.parse( localStorage.getItem("sessionobject") ).token !== undefined &&
                JSON.parse( localStorage.getItem("sessionobject") ).token !== null )  {

                _self.persistCurrentTab( parenttabid, index, tabname );
            }

            _self.localUpdateTabsInMemory( _self.tabsInMemory );

           // MUST SEND MESSAGE TO NODE INSTEAD OF TAB BC WE ARE JUMPING FROM ONE TAB TO ANOTHER TAB
            // _self._emitterTabCurrentTabUpdated.next({ 
            //                                             "nodeid"       : tabid.split("_").splice(0, tabid.split("_").length - 1).join("_"),
            //                                             "currenttab"   : tabname 
            //                                         });

            observer.next( _self.tabsInMemory[ parenttabid ][ "inventory" ][ index ] ); // RETURNS POINTER OBJ
            observer.complete();
        });
    };



    updateCurrentDateOfInventoryNodeByIndex( parenttabid, index, datestring ) {

        let _self = this;

        return Observable.create((observer) => {

            let olddate = _self.tabsInMemory[ parenttabid ][ "inventory" ][ index ]['currentdate'],
                nodeid  = _self.tabsInMemory[ parenttabid ][ "inventory" ][ index ]['_id'];

            _self.tabsInMemory[ parenttabid ][ "inventory" ][ index ]['currentdate'] = datestring;

            if( JSON.parse( localStorage.getItem("sessionobject") ) !== null &&
                JSON.parse( localStorage.getItem("sessionobject") ) !== undefined &&
                JSON.parse( localStorage.getItem("sessionobject") ).token !== undefined &&
                JSON.parse( localStorage.getItem("sessionobject") ).token !== null )  {

                _self.persistCurrentDate( parenttabid, index, datestring );
            }

            _self.localUpdateTabsInMemory( _self.tabsInMemory );

            // *** I DON"T WANT TO USE GLOBAL MESSAGES IF POSSIBLE
            // _self._emitterTabCurrentDateUpdated.next({ 
            //                                             "oldtabid"      : nodeid + "_" + olddate,
            //                                             "newdate"       : datestring,
            //                                             "newtabid"      : nodeid + "_" + datestring,
            //                                             "pointerindex"  : index
            //                                         });

            // RETURN NEW TAB ID FOR FUTURE CASES WHEN CALLER IS FROM THE NODE ITSELF (MAYBE A BIG CALENDAR TAB)
            observer.next( _self.tabsInMemory[ parenttabid ][ "inventory" ][ index ] ); 
            observer.complete();
        });
    };



    persistCurrentTab( tabid, index, tabname ) {

        this.apiService.updateCurrentTab( tabid, index, tabname )
                       .subscribe(args => { console.log('* currenttab * persisted *', args); });
    }

    
    persistCurrentDate( tabid, index, utcdate ) {

        this.apiService.updateCurrentDate( tabid, index, utcdate )
                       .subscribe(args => { console.log('* currentdate * persisted *', args); });
    };


    persistUpdateTabObj( tabid, tabobj ) {

        this.apiService.updateTabObj( tabid, tabobj )
                       .subscribe(args => { console.log('* tab * updated *', args); });
    };


    persistCreateCalendarToServer( batchobj ) {

        this.apiService.createCalendar( batchobj )
            .subscribe(arg => {
                console.log("* newCALENDAR * created *", arg);
            });
                    // error(function(mysy, status, headers, config)     {
                    //     sessionobject.token = null;
                    // });
    }


//     persistIsOpen( tabid, index, bool ) {
//         this.apiService.updateIsOpen( tabid, index, bool )
//                        .subscribe(args => { console.log('* isopen * persisted *', args); });
//     }

    checkForDeleteTabInMemoryByKey( nodeobj, shoulddeletereminance ) {

        if( !shoulddeletereminance ) { return Observable.create((observer) => { observer.next( false ); observer.complete(); }); }

        let _self = this;

        return Observable.create((observer) => {

            // ??? CHANGE THIS TO INTERPRETING BY NAMESPACE

            // Object.keys( nodeobj.leaves ).forEach(element => {

            //     if( _self.tabsInMemory[ nodeobj.leaves[ element ]._id ] ) {

            //         delete _self.tabsInMemory[ nodeobj.leaves[ element ]._id ];
            //     }
            // })

            // _self.localUpdateTabsInMemory( _self.tabsInMemory );

            observer.next( true ); 
            observer.complete();
        });
    }


    persistIsFavorite( tabid, index, bool ) {

        this.apiService.updateIsFavorite( tabid, index, bool )
                       .subscribe(args => { console.log('* isfavorite * persisted *', args); });
    }


    persistUnshiftNodeBatchToServer( tabid, tabtype, batchobj, shouldinstantiate ) {

        this.apiService.unshiftNodeBatch( tabid, tabtype, batchobj, shouldinstantiate )
                       .subscribe(args => { console.log('* newtab * unshifted *', args); });
    }


    persistPushBatchToServer(tabid, index, batchobj) {

        this.apiService.pushBatch( tabid, index, batchobj )
                       .subscribe(args => { console.log('* new batch * persisted *', args); });
    }


    persistReplacePointerAtTabIndexToServer( tabid, index, payloadobject ) {

        this.apiService.replacePointerAtTabIndex( tabid, index, payloadobject )
                       .subscribe(args => { console.log('* newtab * EXCHANGED *', args); });
    }


    getTabInMemoryByKey( tabid ) {
        return this.tabsInMemory[ tabid ];
    }

    getTabsInMemory( ) {
        return this.tabsInMemory;
    }


    getTabBatch( tabidarray ) {

        let _self = this;

        return Observable.create((observer) => {

            let returnarray = [];
            for(var i = 0; i < tabidarray.length; ++i) {
                   returnarray.push( this.tabsInMemory[tabidarray[i]]);
            }

            observer.next( returnarray );
            observer.complete();

            // console.log('WOOOOOOF', tabidarray.map( function(element) {
            //         return tabsInMemory[element];
            // }));

            // return tabidarray.map( function(element) {
            //         return tabsInMemory[element];
            // });
        });  
    }


    setTabsInMemoryByKey( stringid, objectarg ) {

        this.tabsInMemory[ stringid ] = objectarg;
        this.localUpdateTabsInMemory( this.tabsInMemory );
    }


    localUpdateTabsInMemory( objectarg ) {
        // debugger;
        localStorage.setItem("tabsInMemory", JSON.stringify( objectarg ) );
        localStorage.setItem("lastUpdate", JSON.stringify( Date.now() ) );
    }
}



// WEBPACK FOOTER //
// /Users/bmcferren/workspace/mysyllabi_rc_1/~/angular2-template-loader!/Users/bmcferren/workspace/mysyllabi_rc_1/src/app/services/sss-tab.service.ts