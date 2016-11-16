import { Injectable, 
		 EventEmitter } 		from "@angular/core";

import { Http } 				from "@angular/http";


// import { Observable } 	 	from "rxjs/Observable";
import { Observable } 			from "rxjs/Rx";
import 'rxjs/Rx'

import * as _ 					from "underscore";

import { SSSAPIService }        from "./sss-api.service";
import { SSSTabService }        from "./sss-tab.service";
import { SSSNodeService }       from "./sss-node.service";
import { SSSCalendarService }   from "./sss-calendar.service";


@Injectable()
export class SSSConfigService {

    _emitterInstanceUpdated 			: EventEmitter<any> = new EventEmitter();
    http 								: Http;
    applicationnodeid   				: String;
    favoritesnodeid     				: String;
    historynodeid       				: String;
    taxonomynodeid      				: String;
    categoriesnodeid    				: String;
    tagsnodeid                          : String;
    globalHoverState    				: String;

    constructor( http 					: Http,
                 public apiService 		: SSSAPIService,
                 public nodeService 	: SSSNodeService,
                 public tabService 		: SSSTabService,
                 public calendarService : SSSCalendarService ) {

        this.http = http;
        this.applicationnodeid = "";

        if ( !localStorage.getItem("globalHoverState") ) {
              localStorage.setItem("lastUpdate", JSON.stringify( Date.now() ) );
              localStorage.setItem("globalHoverState", "calendar" ); 
        }

        this.applicationnodeid  = localStorage.getItem( "applicationnodeid" );
        this.favoritesnodeid    = localStorage.getItem( "favoritesnodeid"   );
        this.historynodeid      = localStorage.getItem( "historynodeid"     );
        this.taxonomynodeid     = localStorage.getItem( "taxonomynodeid"    );
        this.categoriesnodeid   = localStorage.getItem( "categoriesnodeid"  );
        this.tagsnodeid         = localStorage.getItem( "tagsnodeid"        );
        this.globalHoverState   = localStorage.getItem( "globalHoverState"  );
    }


    launchApplication( hostname, urlargsarray ) {

        let _self = this,
             instanceid;

        return Observable.create((observer) => {

            switch ( hostname ) {
                case "mysyllabi.com"    : instanceid = "mysyllabi"; break;
                case "localhost:3000"   : instanceid = "mysyllabi"; break;
                default                 : instanceid = "mysyllabi"; break;
            }

            _self.fetchInstanceConditional( instanceid, urlargsarray ).subscribe(arg => {
            // *** RETURNS arg IS A BATCH OBJECT WITH AN ARRAY FOR NODES AND ANOTHER ARRAY FOR TAB OR false IF !_self.applicationnodeid 
                    
                _self.setApplicationMetaData( instanceid ).subscribe(subarg => {
                // *** RETURNS subarg IS TABID UNDER APPLICATIONNODE

                    _self.insertPayloadDataInBatch( arg ).subscribe(grandarg => {
                    // *** RETURNS grandarg IS NOTHING JUST TO CONTROL ORDER OF EVENTS

                        observer.next("application-ready"); observer.complete();
                    });
                });
            });
        });
    }


    // IF THERE IS NO INSTANCE OBJ OR INSTANCE ID 
    // THEN THIS FUNCTION QUERIES THE DATASTORE BY INSTANCE ID AND CURRENT URL ARGS
    fetchInstanceConditional( instanceid, urlargs ) {

        if( this.applicationnodeid ) { return Observable.create((observer) => { observer.next( false ); observer.complete(); }); }

        let _self = this;

        return Observable.create((observer) => {

            _self.apiService.fetchInstance( instanceid, urlargs ).subscribe(arg => {

                console.log("instanceargs", arg);

                observer.next( arg ); observer.complete();
            });
        });
    }


    insertPayloadDataInBatch( instanceobj ) {

        if( !instanceobj ) { return Observable.create((observer) => { observer.next( "empty-batch" ); observer.complete(); }); }

        let _self = this;

        return Observable.create((observer) => {

            _self.nodeService.addNodesInBatch( instanceobj.nodes ).subscribe(arg => {
            // *** RETURNS arg IS NOTHING JUST TO CONTROL ORDER OF EVENTS


                _self.tabService.addTabsInBatch( instanceobj.tabs ).subscribe(subarg => {
                // *** RETURNS subarg IS NOTHING JUST TO CONTROL ORDER OF EVENTS


                    observer.next( "batch-loaded" ); observer.complete();
                });
            });
        });
    }


    setApplicationMetaData( instanceid ) {

        if( this.applicationnodeid ) { return Observable.create((observer) => { observer.next( instanceid + "_application_ALLRESOURCES" ); observer.complete(); }); }

        let _self = this;

        return Observable.create((observer) => {

            _self.setApplicationNodeID( instanceid + "_application");
            _self.setCategoriesNodeID( instanceid + "_categories");
            _self.setTaxonomyNodeID( instanceid + "_taxonomy");
            _self.setHistoryNodeID( instanceid + "_history");
            _self.setFavoritesNodeID( instanceid + "_favorites");
            _self.setTagsNodeID( instanceid + "_tags"); // BE SURE THAT EACH POINTER IN tagsnodeid HAS A AUXTAB THAT SUPPORTS COIN TEMPLATE

            observer.next( instanceid + "_application_ALLRESOURCES");
            observer.complete();
        });
    }


    preprocessFilteredList( rawargsarray ) {

        return Observable.create((observer) => {

            let filteredlist = _.flatten( rawargsarray ).filter(element => { return element != undefined &&
                                                                                    element != false; } );    
            // THE ORDER RETURNED HERE IS IMPORTANT SO THAT THE EVENTUAL TOP (OR BOTTOM) NODE 
            // PASSES VALIDATION AGAINST THE LAST (OR FIRST) INDEX IN THE PRE-EXISTING ARRAY


            // if( method === "replace" && filteredlist.length > 1 ) { filteredlist = [ filteredlist.slice(-1) ]; } // NEW OBJ [...]
            // // IF METHOD IS REPLACE THEN WE REALLY ONLY NEED TO ADD ONE WILL SAVE A FEW ITERATIONS BUT 
            // // MORE IMPORTANTLY, IT WILL ENSURE THAT WHEN WE UNSHIFT, IT REPLACES WITH THE CORRECT NEW 
            // // POINTER OBJ BECAUSE IT PASSES VALIDATION

            observer.next( filteredlist );
            observer.complete();
        });
    }



    postProcessPointerArray( mixedpointerarray, position ) {

        return Observable.create((observer) => {

            // let returnarray = [],
            //     i,
            //     length = mixedpointerarray.length;

            // for( i = 0; i < length; ++i ) {

            //     if( mixedpointerarray[ i ] != false ) {

            //         returnarray.push({
            //             "inventoryindex" : position === -1 ? position + length - i - 1 : position + length - i - 1,
            //             "pointerid"      : mixedpointerarray[ i ]
            //         })
            //     }
            // }
// console.log("@@@ returnarray", returnarray);
            let postprocessedarray = mixedpointerarray.filter(element => { return element != false; } );    

            observer.next( postprocessedarray );
            // observer.next( returnarray );
            observer.complete();
        });
    }


    processTabInventoryMutations( parentpointerobj, mutationarray, validateinputobj, existingcountobj, targetinstructions, source ) {

        // CHECK FOR EMPTY ARRAY SO THAT CALLER CAN RESOLVE PROMISE
        if( mutationarray.length === 0 ) { return Observable.create((observer) => { observer.next( [] ); observer.complete(); }); }   

        let _self = this;

        return Observable.create((observer) => {        

            _self.fetchRelevantInstantiationIDs( parentpointerobj._id, targetinstructions, mutationarray, source ).subscribe(nodeidarray => { 
            // *** RETURNS nodeidarray IS AN ARRAY OF NODEIDS &&|| false BOOLS - EACH INTENDED TO INSTANTIATE IN THIS TABID INVENTORY
                        

                _self.preprocessFilteredList( nodeidarray ).subscribe(filteredlist => {
                // *** RETURNS ARGS IS AN ARRAY OF FILTERED NODEIDS


                    let tabid = this.tabService.fetchTabid( parentpointerobj._id, 
                                                            parentpointerobj.currenttab === "day" ? parentpointerobj.currentdate: "ALLRESOURCES",
                                                            parentpointerobj.instance,
                                                            "GUEST" );

                    _self.processInstantiationArray( filteredlist,
                                                     tabid,   
                                                     validateinputobj,
                                                     existingcountobj,
                                                     targetinstructions,
                                                     parentpointerobj ).subscribe(processedarray => {                                   
                    // *** RETURNS SUBARGS IS AN ORDERED ARRAY OF POINTER OBJ   


                        // _self.reverseValidationSanityCheck( followingpointerobj, 
                        //                                     mutationarray.length,
                        //                                     targetinstructions,
                        //                                     tabid,
                        //                                     parentpointerobj ) {
                        // *** RETURNS args IS NOTHING AND JUST TO CONTROL SEQUENCE OF EVENTS  

                        _self.postProcessPointerArray( processedarray, targetinstructions.position ).subscribe(postprocessedarray => {


                            observer.next( postprocessedarray ); observer.complete();  
                        });     
                        // }         
                    });  
                });                                
            });
        });
    }

 
    // I DON"T THINK THIS IS CORRECT:
    // IS NOT A PROBLEM FOR THE FOLLOWING AFTER NEXT POINTER OBJ (FROM THE INPUT ARRAY) BC THE  
    // FOLLOWING AFTER NEXT POINTER OBJ WILL FAIL WHEN IT COMPARES AGAINST ITS PREDECCESSOR.  

    // MAYBE NEED A WHILE LOOP IN THE VALIDATINO FUNCTION TO CHECK AHEAD IF THE FOLLWING IS FALSE


    // THERE IS A GLITCH ON INSERT WHEN ONE ARRAY ELEMENT PASSES THEN THE FOLLOWING FAILS 
    // AND THE INPUT ARRAY ENDS BUT THE FOLLOWING *EXISTING* POINTER OBJ CONFLICTS WITH THAT 
    // ORIGINAL MENTIONED ELEMENT. THIS COMPARISON AGAINST THE ORIGINAL MENTIONED ELEMENT 
    // IS NOT A PROBLEM FOR THE FOLLOWING AFTER NEXT POINTER OBJ (FROM THE INPUT ARRAY) BC THE  
    // FOLLOWING AFTER NEXT POINTER OBJ WILL FAIL WHEN IT COMPARES AGAINST ITS PREDECCESSOR.  
    // REGARDLESS,THE SANITY CHECK ITERATES BACKWARDS AND IT BREAKS LOOP IF AN ELEMENT SERVES 
    // VALIDATION === TRUE AT ANY INDEX. IF THE ELEMENT SERVES  VALIDATION !== TRUE, 
    // THEN IT DELETES THE PREDECESSOR IT COMPARES AGAINST AND IT CONTINUES ITERATING 
    // BACKWARDS UNTIL IT FINDS AN ELEMENT THAT VALIDATION === TRUE OR THE length ENDS
    // reverseValidationSanityCheck( followingarg, arraylength, targetinstructions, tabid, parentpointerobj ) {

    //     let observableBatch  = [], 
    //        _self             = this;

    //     if( !followingarg )   { return Observable.create((observer) => { observer.next( true ); observer.complete(); }); } // OCCURS WHEN POSITION === -1 OR arraylength

    //     if( arraylength < 2 ) { return Observable.create((observer) => { observer.next( true ); observer.complete(); }); } // IF 1 THEN ITS ALREADY BEEN CHECKED

    //     let loopiterator = arraylength; // JUST SO ITS LEGIBLE

    //     _self.memoizeTab( tabid, null ).subscribe(tabobj => { 
    //     // *** tabobj RETURNS A TAB OBJ EITHER A TAB FROM MEMORY, A TAB FETCH FROM DATA STORE, OR A NEWLY CREATED TAB OBJECT    


    //         let startingdecrement = targetinstructions.position + arraylength;

    //         while( startingdecrement > startingdecrement - arraylength )

    //             let validationflag = _self.tabService.validateTabAddition( tabobj.inventory[ startingdecrement ], 
    //                                                                        undefined, // SO THAT IT PASSES VALIDATION
    //                                                                        followingarg,
    //                                                                        targetinstructions );

    //             validationflag === true ? break : observableBatch.push( deletePointerFromTabInventoryAtIndex( startingdecrement,
    //                                                                                                           parentpointerobj._id, 
    //                                                                                                          _self.tabService.getLeaf( parentpointerobj ) ) );
    //             --startingdecrement;
    //         }
    //     });

    //     return Observable.forkJoin(observableBatch);
    // }



    processInstantiationArray( inputarray, parenttabid, validateinputobj, existingcountobj, targetinstructions, parentpointerobj ) {

        // CHECK FOR EMPTY ARRAY SO THAT CALLER CAN RESOLVE PROMISE
        if( inputarray.length === 0 ) { return Observable.create((observer) => { observer.next( [] ); observer.complete(); }); }

        let observableBatch  = [], 
           _self             = this;

        inputarray.forEach( ( element, i ) => {

            observableBatch.push( _self.manufactorNodeMutation( element,
            /* NO BATCH LOADING HERE!! LOAD INDIVIDUALLY  */    validateinputobj, 
            /* BC THIS COMES OFF THE URL AND ANYTHING OFF */    i,
            /* THE THE URL MUST BE EXAMINED BC THE URL    */    inputarray, 
            /* DOES NOT ADD ANYTHING THAT DOES NOT PASS   */    parenttabid,
            /* VALIDATION PUSH SO WE PUSH TO              */    targetinstructions, 
            /* tabsInMemory[...].inventory IN THE SAME    */    existingcountobj,
            /* ORDER AS RECEIVED predeccessorobj =        */    parentpointerobj ) );
            /* adddata.candidatechildpointerobj;          */
        });
            
        return Observable.forkJoin(observableBatch);
    }



    // THIS FUNCTION IS NECCESARY BECAUSE processInstantiationArray THE CALLER CAN"T CALL OBSERVABLE FUNCTIONS INSIDE THE LOOP OR THE CALLSTACK MESSES UP
    manufactorNodeMutation( candidateid, validateinputobj, iterator, inputarray, parenttabid, targetinstructions, existingcountobj, parentpointerobj ) {

        // CHECK FOR EMPTY ARRAY SO THAT CALLER CAN RESOLVE PROMISE
        if( candidateid === false ) { return Observable.create((observer) => { observer.next( false ); observer.complete(); }); }   

        let _self = this;

        return Observable.create((observer) => {                            

            _self.fetchAppropriatePointer( validateinputobj.predeccessorpointerobj, 
                                           targetinstructions.position === -1 ? inputarray[ iterator - 1 ] : inputarray[ iterator + 1 ], 
                                           iterator,
                                           targetinstructions.position === -1 ? 0 : inputarray.length - 1,
                                           targetinstructions,
                                           existingcountobj.inventorycount ).subscribe(appropriatepredeccessorpointerobj => {
            // RETURNS appropriatepredeccessorpointerobj IS A QUALIFIED POINTER OBJ OR undefined


                _self.fetchAppropriatePointer( validateinputobj.followingpointerobj, 
                                               targetinstructions.position === -1 ? inputarray[ iterator + 1 ] : inputarray[ iterator - 1 ],  // ELSE IS RELATED TO -1 POSITION SCENARIO
                                               iterator,
                                               targetinstructions.position === -1 ? inputarray.length - 1 : 0,
                                               targetinstructions,
                                               existingcountobj.inventorycount ).subscribe(backupfollowingpointerobj => {
                // RETURNS appropriatefollowingpointerobj IS A QUALIFIED POINTER OBJ OR undefined


                    _self.nodeService.memoizeNode( candidateid ).subscribe(candidatenodeobj => {
                    // RETURNS fetchdata IS AN NODE OBJ
                    // _self.fetchCandidatePointerObj( candidateid, iterator === inputarray.length - 1 ).subscribe(targetcandidateobj => {
                    // RETURNS targetcandidateobj IS A QUALIFIED POINTER OBJ 

                        if( !candidatenodeobj ) {

                            observer.next( false ); observer.complete();

                        } else {

                            let targetcandidateobj = _self.tabService.createNewPointer( candidatenodeobj.type, 
                                                                                        candidatenodeobj._id, 
                                                                                        parentpointerobj.defaultchildrenstate, 
                                                                                        undefined,
                                                                                        iterator ), // ??? TEMP FIX FOR MIGRATION

                                validationflag     = _self.tabService.validateTabAddition( targetinstructions.position !== -1 
                                                                                                 ? appropriatepredeccessorpointerobj
                                                                                                 : validateinputobj.predeccessorpointerobj,
                                                                                            targetinstructions.position !== -1 
                                                                                                 ? validateinputobj.followingpointerobj
                                                                                                 : backupfollowingpointerobj, 
                                                                                            targetcandidateobj,
                                                                                            targetinstructions );

                                // targetcandidateobj.style = { "width" : "250px", "height" : "550px" }; // TEMPORARILY MOVED TO createNewPointer
    // debugger
                            // THIS SOLVES A GLITCH ON INSERT WHEN ONE ARRAY ELEMENT PASSES THEN THE FOLLOWING FAILS AND THE 
                            // INPUT ARRAY ENDS BUT THE FOLLOWING *EXISTING* POINTER OBJ CONFLICTS WITH THAT ORIGINAL MENTIONED ELEMENT.
                            if( validationflag === true &&
                                targetinstructions.position !== -1 &&
                                targetinstructions.method   !== "replace" ) { validateinputobj.followingpointerobj = targetcandidateobj; }

                            if( validationflag === true &&
                                targetinstructions.position === -1 &&
                                targetinstructions.method   !== "replace" ) { validateinputobj.predeccessorpointerobj = targetcandidateobj; }


                            _self.tabService.addPointerToTabInventory( targetcandidateobj, 
                                                                       parenttabid, 
                                                                       existingcountobj,
                                                                       iterator, 
                                                                       targetinstructions,
                                                                       validationflag,
                                                                       iterator === inputarray.length - 1 ).subscribe(childpointerobj => {
                            // *** RETURNS childpointerobj IS AN POINTER OBJS AMONGST OTHERS ROLLED IN THE ARRAY LOOP


                                observer.next( childpointerobj ); observer.complete();
                            });                                          
                        }
                    });                                 
                });                                         
            });                             
        });
    }






    fetchAppropriatePointer( pointerobj, 
                             backupnodeid, 
                             iterator, 
                             indexcheck, 
                             targetinstructions, 
                             existinglength ) {

        // undefined BC WE STARTED WITH ONE OR ZERO EXISTING CMPREFS AND METHOD === REPLACE
        // IN WHICH CASE, WE RETURN undefined AND LET VALIDATION PROCESS THIS undeinfed DOWN STREAM IN THE PROCESS
        if( !pointerobj && targetinstructions.method === "replace" ) { return Observable.create((observer) => { observer.next( undefined ); observer.complete(); }); } 

        // undefined CHECK SO WE DON'T HAVE A PROBLEM BELOW IE Cannot read property '_id' of undefined
        if( !pointerobj && iterator === indexcheck ) { return Observable.create((observer) => { observer.next( undefined ); observer.complete(); }); }

        let _self = this;                           
                                                 // HERE OUT, WE CAN COUNT ON pointerobj BEING DEFINED
        return Observable.create((observer) => { // OR ELSE WE DON'T CARE BC METHOD != REPLACE IN WHICH CASE WE RELY ON ITERATOR NODEID)

            let querytabid = targetinstructions.method === "replace" ? pointerobj._id // REPLACE ALWAYS USES pointerobj ARG BC THE ITERATOR WILL NOT CAUSE ACCUMULATION OF ADDITIONS
                                                                     : iterator === indexcheck ? pointerobj._id 
                                                                                               : backupnodeid;
            if( querytabid !== null ) { // null BC ITS A LOCAL VACANT POINTER

                _self.nodeService.memoizeNode( querytabid ).subscribe(nodeobj => { 

                    if( !nodeobj ) {

                        observer.next( nodeobj ); // ie undefined

                    } else {

                        observer.next( _self.tabService.createNewPointer( nodeobj.type, 
                                                                          nodeobj._id,
                                                                          pointerobj ? pointerobj.currenttab  : undefined,
                                                                          pointerobj ? pointerobj.currentdate : undefined,
                                                                          iterator ) );
                    } 
                    observer.complete(); // REDUNDANT TO CREATE THIS TEMPORARY POINTER OBJ TO TEST WITH BUT THE CLEAREST WAY TO PROCESS COMPLEX RULES
                });

            } else { // ELSE RETURN A GENERIC LOCAL VACANT POINTER

                observer.next( {
                    "_id"           : null, 
                    "isFavorite"    : false, 
                    "isOpen"        : true, 
                    "currentdate"   : null, 
                    "currenttab"    : "vacant",
                    "emptyvacant"   : "emptyvacant"
                } ); 
                observer.complete();
            }
        });
    }




    // fetchCandidatePointerObj( candidateid, lastindexbool ) {

    //     let _self = this;

    //     return Observable.create((observer) => {  

    //         _self.nodeService.memoizeNode( candidateid ).subscribe(candidatenodeobj => {
    //         // RETURNS fetchdata IS AN NODE OBJ


    //             let candidatepointerobj = _self.tabService.createNewPointer( candidatenodeobj.type, candidatenodeobj._id );

    //             _self.qualifyTabArg( lastindexbool,
    //                                  candidatepointerobj,
    //                                  location.href.split('/').splice(4).slice(-1)[0], "bulbs" ).subscribe(qualifytabresult => {
    //             // *** RETURNS qualifytabresult IS EITHER A TABSTRING OR FALSE IF IT DOESN"T PASS THE TEST


    //                 observer.next( qualifytabresult && lastindexbool ? _self.mutatePointerTab( qualifytabresult, candidatepointerobj ) 
    //                                                                  : candidatepointerobj  ); 
    //                 observer.complete();
    //             });
    //         });
    //     });
    // }



    mutatePointerTab( tabstring, pointer ) {

        if( !isNaN( parseInt( tabstring ) ) ) { // SPECIFICALLY UTC

           let urldate = new Date( parseInt( tabstring ) )

            this.calendarService.updateHighlightDate( urldate.getFullYear(), urldate.getMonth(), urldate.getDate() );

            pointer.currentdate = tabstring;

            pointer.currenttab  = "day";

        } else {

            pointer.currenttab  = tabstring;
        } 

        return pointer;
    }



    ALTprocessUrlTabArgument( tabstring, candidatepointerobj, predeccessorpointerobj, followingpointerobj, targetindex, targetinstructions, parenttabid ) {

        let _self = this;

        return Observable.create((observer) => {

            _self.qualifyTabArg( true, candidatepointerobj, tabstring ).subscribe(qualifytabresult => {

                if( !qualifytabresult || _self.tabService.validateTabAddition( predeccessorpointerobj,
                                                                               followingpointerobj, 
                                                                               candidatepointerobj,
                                                                               targetinstructions ) != true ) { 
                    observer.next( false ); observer.complete(); 

                } else if( !isNaN( parseInt( tabstring ) ) ) { // SPECIFICALLY A DATE UTC -> -> THIS CHECK COULD IMPROVE SPECIFICITY ???

                    // let urldate = new Date( parseInt( tabstring ) );

                    // _self.calendarService.updateHighlightDate( urldate.getFullYear(), urldate.getMonth(), urldate.getDate() );

                    _self.tabService.updateCurrentDateOfInventoryNodeByIndex( parenttabid, targetindex, tabstring ).subscribe(args => {
                    // *** RETURNS args IS A NODEID THAT JUST HAD ITS CURRENT DATE CHANGED


                        observer.next( new Date( parseInt( tabstring ) ) ); observer.complete(); // RETURNS urldate DATE OBJ INSTEAD OF NODEID
                    });
                       
                } else {
                            
                    _self.tabService.updateCurrentTabOfInventoryNodeByIndex( parenttabid, targetindex, tabstring, undefined ).subscribe(args => { // TEMP ARG FOR MIGRATION
                    // *** RETURNS args IS A NODEID THAT JUST HAD ITS CURRENT TAB CHANGED 


                        observer.next( tabstring ); observer.complete(); // RETURNS args NODEID
                    }); 
                }
            });
        });
    }



    // processUrlTabArgument( candidatepointerobj, existingpointerobj, targetindex, targetinstructions, parenttabid, tabstring ) {

    //     let _self = this;

    //     return Observable.create((observer) => {

    //         _self.qualifyTabArg( true, candidatepointerobj, tabstring ).subscribe(qualifytabresult => {
               
    //             if( !qualifytabresult || _self.tabService.validateTabAddition( existingpointerobj,  /* existingpointerobj IGNORES METHOD === REPLACE BC */
    //                                                                            candidatepointerobj, /* NEW NODES HAVE ALREADY BEEN ADDED BY THIS MOMENT */
    //                                                                            targetinstructions ) != true ) { 
    //                 observer.next( false ); observer.complete(); 

    //             } else if( !isNaN( parseInt( tabstring ) ) ) { // SPECIFICALLY A DATE UTC -> -> THIS CHECK COULD IMPROVE SPECIFICITY ???

    //                 let urldate = new Date( parseInt( tabstring ) );

    //                 _self.calendarService.updateHighlightDate( urldate.getFullYear(), urldate.getMonth(), urldate.getDate() );

    //                 _self.tabService.updateCurrentDateOfInventoryNodeByIndex( parenttabid, targetindex, tabstring ).subscribe(args => {
    //                 // *** RETURNS args IS A NODEID THAT JUST HAD ITS CURRENT DATE CHANGED


    //                     observer.next( new Date( parseInt( tabstring ) ) ); observer.complete(); // RETURNS urldate DATE OBJ INSTEAD OF NODEID
    //                 });
                       
    //             } else {
                            
    //                 _self.tabService.updateCurrentTabOfInventoryNodeByIndex( parenttabid, targetindex, tabstring ).subscribe(args => {
    //                 // *** RETURNS args IS A NODEID THAT JUST HAD ITS CURRENT TAB CHANGED 


    //                     observer.next( tabstring ); observer.complete(); // RETURNS args NODEID
    //                 }); 
    //             }
    //         });
    //     });
    // };



    // DETERMINES WHETHER A TAB STRING IS PRESENT TO CHANGE THE currenttab OR currentdate OF THE POINTER AT TARGETINDEX
    qualifyTabArg( lastindexflag, candidatepointerobj, targettabstring ) {

        if( !lastindexflag )  { return Observable.create((observer) => { observer.next( false ); observer.complete(); }); }

        let _self = this;

        return Observable.create((observer) => {

            _self.nodeService.fetchIfNodeExists( candidatepointerobj._id ).subscribe(node => {
            // *** RETURNS args IS A NODEOBJ OR FALSE

                // MUST BE SURE THAT THE TARGET NODE POINTER HAS A TEMPLATE THAT SATISFIES TAB ARG (ie. 'third' or utc 
                // '1462665600000') IF NOT, shouldinterprettabargs IS FALSE AND SENDS A MESSAGE TO NOT INTERPRET THE TAB ARG
                _self.tabService.qualifyUrlArgAgainstCandidateTemplate( candidatepointerobj, 
                                                                        targettabstring ).subscribe(tabqualified => {
                // *** RETURNS tabqualified IS AN BOOL RELATIVE TO THE CHECK MENTIONED ABOVE 


                        observer.next( tabqualified && node != false ? targettabstring : false ); 
                        observer.complete();
                });
            });
        });
    }



    fetchRelevantInstantiationIDs( parentnodeid, targetinstructions, urlargsarray, source ) {

        if( source === "direct" )  { return Observable.create((observer) => { observer.next( urlargsarray ); observer.complete(); }); }

        let _self = this,
            observableBatch = [],
            prefix;

        // HACK AGAINST CIRCULAR DEPENECY ON AccountService - WHAT HAPPENED TO zEBRA STRIPING???
        if( JSON.parse( localStorage.getItem("userobject") )        === null        ||
            JSON.parse( localStorage.getItem("userobject") )._id    === undefined   ||
            JSON.parse( localStorage.getItem("userobject") )._id    === "mysyllabi" ) {

                 prefix = "mysyllabi";

        } else { prefix = JSON.parse( localStorage.getItem("userobject") )._id; }


        urlargsarray.forEach( (element, index) => {

            observableBatch.push( _self.scrapeInstantiationArrayHelper( element,
                         /* PUSHING ARRAY OF NODEIDS TO INSTANTIATE */  prefix, 
          /* IMPORTANT BC ORDER MUST REPLICATE MONGO INSTANTIATIONS */  parentnodeid,
                                                                        targetinstructions.position ) );
        });

        return Observable.forkJoin( observableBatch );
    }



    // ANALYZES A PERSISTANT INSTANTIATION HASH OBJ & RETURNS AN ARRAY OF NODEIDS TO INSTANTIATE OR AN EMPTY ARRAY
    scrapeInstantiationArrayHelper( nodeid, prefix, parentnodeid, targetposition ) {

        let _self = this;

        return Observable.create((observer) => {

            _self.nodeService.fetchIfNodeExists( nodeid ).subscribe(args => {
            // *** RETURNS args IS A NODEOBJ OR FALSE


                _self.fetchInstantiationArray( args, prefix, parentnodeid, targetposition ).subscribe(returnarray => {
                // *** RETURNS nodeidarray IS AN ARRAY OF NODEIDS &&|| false BOOLS - EACH INTENDED TO INSTANTIATE IN THIS TABID INVENTORY
              

                    observer.next( returnarray );
                    observer.complete();  
                });
            });
        });
    }


    fetchInstantiationArray( existancearg, prefix, parentnodeid, targetposition ) { 

        if( !existancearg )  { return Observable.create((observer) => { observer.next( false ); observer.complete(); }); }

        return Observable.create((observer) => {

            let keystring   = parentnodeid.slice( prefix.length + 1 ), // ie. "history", "taxonomy", "bing-bong"

                returnarray = existancearg.instantiations[ keystring ] 
                                     ? targetposition === -1 
                                            ? [].concat( existancearg.instantiations[ keystring ] )
                                            : [].concat( existancearg.instantiations[ keystring ] ).reverse()
                                     : [];  // REVERSE BECAUSE THE ORDER MUST BE DIFFERENT FOR UNSHIFT THAN PUSH 
                                            // THINK OF A FERRIS WHEEL WHERE THE CARS ARE ALWAYS UP NO MATTER WHAT 
            observer.next( returnarray );   // DIRECTION THE MACHINE OPERATES
            observer.complete();  
        });
    }



    toggleHeight( heightstatestring, percentheightint ) {

        switch ( heightstatestring ) {

            case        'super'     : return [ 'collapsed'      , 0 ];
            case        'dooper'    : return [ 'collapsed'      , 0 ];
            case        'beyond'    : return [ 'collapsed'      , 0 ];
            case        'collapsed' : return [ 'mini'           , 32 ];
            case        'mini'      : return [ 'collapsed'      , 0 ];
            default                 : return [ 'collapsed'      , 0 ];
        }
    }


    showMoreCalulate( heightstatestring, percentheightint ) {

        return [ 'beyond', percentheightint + 80 ];

        // switch ( heightstatestring ) {

        //     return [ 'beyond', percentheightint + 100 ];

        //     // case        'dooper'    : return [ 'beyond', percentheightint + 100 ];
        //     // case        'beyond'    : return [ 'beyond', percentheightint + 100 ]; 
        //     // default                 : return toggleHeight( heightstatestring, percentheightint );
        // }
    };


    flushLocalStorage() {
        localStorage.clear();
    };


    getApplicationNodeID()  { return this.applicationnodeid; };
    getHistoryNodeID()      { return this.historynodeid; };
    getTagsNodeID()         { return this.tagsnodeid; };
    getGlobalHoverState()   { return this.globalHoverState; }
    

    setApplicationNodeID( nodeid ) {

        let tempstring          = this.applicationnodeid;

        this.applicationnodeid  = nodeid;

        this._emitterInstanceUpdated.next( { "oldnodeid" : tempstring,
                                             "newnodeid" : nodeid } );

        this.localUpdateApplicationNodeID( this.applicationnodeid );
    }

    setCategoriesNodeID( nodeid ) {

        let tempstring          = this.categoriesnodeid;

        this.categoriesnodeid   = nodeid;

        this._emitterInstanceUpdated.next( { "oldnodeid" : tempstring,
                                             "newnodeid" : nodeid } );

        this.localUpdateCategoriesNodeID( this.categoriesnodeid );
    }

    setTaxonomyNodeID( nodeid ) {

        let tempstring          = this.taxonomynodeid;

        this.taxonomynodeid     = nodeid;

        this._emitterInstanceUpdated.next( { "oldnodeid" : tempstring,
                                             "newnodeid" : nodeid } );

        this.localUpdateTaxonomyNodeID( this.taxonomynodeid );
    }

    setHistoryNodeID( nodeid ) {

        let tempstring          = this.historynodeid;

        this.historynodeid      = nodeid;

        this._emitterInstanceUpdated.next( { "oldnodeid" : tempstring,
                                             "newnodeid" : nodeid } );

        this.localUpdateHistoryNodeID( this.historynodeid );
    }

    setFavoritesNodeID( nodeid ) {

        let tempstring          = this.favoritesnodeid;

        this.favoritesnodeid    = nodeid;

        this._emitterInstanceUpdated.next( { "oldnodeid" : tempstring,
                                             "newnodeid" : nodeid } );

        this.localUpdateFavoritesNodeID( this.favoritesnodeid );
    }

    setTagsNodeID( nodeid ) {

        let tempstring          = this.tagsnodeid;

        this.tagsnodeid         = nodeid;

        this._emitterInstanceUpdated.next( { "oldnodeid" : tempstring,
                                             "newnodeid" : nodeid } );

        this.localUpdateTagsNodeID( this.tagsnodeid );
    }

    setGlobalHoverState( stringarg ) { 
        this.globalHoverState   = stringarg;
        this.localUpdateGlobalHoverState( this.globalHoverState ); 
    };

    localUpdateGlobalHoverState( stringarg ) { 
        localStorage.setItem("globalHoverState", stringarg );
        localStorage.setItem("lastUpdate", JSON.stringify( Date.now() ) );
    };

    localUpdateApplicationNodeID( nodeid ) {
        localStorage.setItem("applicationnodeid", nodeid );
        localStorage.setItem("lastUpdate", JSON.stringify( Date.now() ) );
    };

    localUpdateTaxonomyNodeID( nodeid ) {
        localStorage.setItem("taxonomynodeid", nodeid );
        localStorage.setItem("lastUpdate", JSON.stringify( Date.now() ) );
    };

    localUpdateHistoryNodeID( nodeid ) {
        localStorage.setItem("historynodeid", nodeid );
        localStorage.setItem("lastUpdate", JSON.stringify( Date.now() ) );
    };

    localUpdateFavoritesNodeID( nodeid ) {
        localStorage.setItem("favoritesnodeid", nodeid );
        localStorage.setItem("lastUpdate", JSON.stringify( Date.now() ) );
    };

    localUpdateTagsNodeID( nodeid ) {
        localStorage.setItem("tagsnodeid", nodeid );
        localStorage.setItem("lastUpdate", JSON.stringify( Date.now() ) );
    };

    localUpdateCategoriesNodeID( nodeid ) {
        localStorage.setItem("categoriesnodeid", nodeid );
        localStorage.setItem("lastUpdate", JSON.stringify( Date.now() ) );
    };
}
