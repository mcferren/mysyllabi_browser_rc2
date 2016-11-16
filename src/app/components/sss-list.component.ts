import { Component, 
         EventEmitter,
         ComponentRef, 
         ComponentFactoryResolver,
         ViewChild, 
         ViewContainerRef }         from "@angular/core";

import { Observable }               from "rxjs/Observable";
import "rxjs/Rx";

import { SSSConfigService } 		from "./../services/sss-config.service";
import { SSSNodeService } 			from "./../services/sss-node.service";
import { SSSTabService } 			from "./../services/sss-tab.service";
import { SSSCalendarService }       from "./../services/sss-calendar.service";
import { SSSDOMService }            from "./../services/sss-dom.service";
import { SSSRouterService }         from "./../services/sss-router.service";

import { SSSNodeComponent }         from './sss-node.component';


@Component({
    selector: 'sss-list',
    template: `
        <div class="list_template" #nodetarget></div>
        
        <p style="clear: both;"></p>
    `
})
export class SSSListComponent {

    localinventory                                  : Array<any>;
    cmpRefArray                                     : Array<any>;
    previousURLargs                                 : Array<String>;

    @ViewChild('nodetarget', {read: ViewContainerRef}) nodetarget : ViewContainerRef;

    // @Input's
    public templateobject                 			: any;
    public parentnodeobject               			: any;
    public matryoshkanodeindex            			: String;
    public matryoshkanodeobject           			: any;
    public pointerobject                  			: any;
    public listtemplatesuggestion                   : String;
    public tabid                                    : String;

    // @Output's
    nodepersister                  		  			= new EventEmitter();
    nodeeditor                     		  			= new EventEmitter();
    nodezapper                     		  			= new EventEmitter();
    modalprompter                                   = new EventEmitter();

    constructor( public  configService              : SSSConfigService,
                 public  nodeService                : SSSNodeService,
                 public  tabService                 : SSSTabService,
                 public  domService                 : SSSDOMService,
                 public  routerService              : SSSRouterService,
                 private componentFactoryResolver   : ComponentFactoryResolver ) {

        this.localinventory                         = [];
        this.cmpRefArray                            = [];
        this.previousURLargs                        = []; // CAN"T CENTRALIZE THIS VARIABLE IN CONFIGSERVICE
                                                          // BC THERE ARE MULTIPLE LISTENING NODEOBJ's FOR EACH URL CHANGE
                                                          // AND THE VALUE OF THE VARIABLE WOULD BECOME OFFSYNC THERE
    };


    ngAfterContentInit() { 

        let _self = this;

        // this.setTabID();

        let targetinstructions = _self.fetchTargetInstructions( "flop" );

        this.updateLocalInventory().subscribe(args => {

            _self.processCmpRefs( _self.localinventory, _self.cmpRefArray.length, targetinstructions, "upstream", "smurf" ).subscribe(changerate => {
            // *** RETURNS changerate IS AN INTEGER REPRESENT THE CHANGE RATE AMONST CMPREF DELETES, REPLACEMENT AND ADDITIONS


                _self.defineCmpRefArrayIndices( 0 ); // ??? WEAK - NEED A BETTER WAY TO DEFINE INDEX OF CMPREF IN CMPREFARRAY

                _self.handleParentHashChangeEvent(); // ??? TEMPORARY - THIS RESULTS IN TWO CALLS OFF FLOP SITE IS REACHED THE FIRST TIME BY URL ADDRESS BAR 
            });                                      // THE LISTENING NODES/TABID's (HISTORY / TAXONOMY) SHOULD ARRIVE ALREADY POPULATED WITH THE RESULTING URLARG ADDITIONS
        });                                          // PROBLEM IS THIS MEAN TRANSRIBING ALL THE LIST COMPONENT VALIDATION WORK ONTO THE SERVER WHICH WILL TAKE A LOT OF TIME
    }                                                // SO FOR NOW WE USE THIS TEMPORARILY AS A FIX


    
    fetchTargetInstructions( circumstance ) {

        let targetinstructions 

        if( circumstance === "url" ) {

            targetinstructions = JSON.parse( JSON.stringify( this.pointerobject.urlinstructions || { // IF IT CONTAINS PERSISTANT flopinstructions
                                
                                        "method"              : "after",  // INSTEAD OF REPLACE, BEFORE, AFTER
                                        "position"            : -1,       // PUSH (INSTEAD OF 0 FOR UNSHIFT OR ## FOR INSERT)
                                        "seek"                : false,
                                        "duplicatetoppointer" : true, 
                                        "duplicatetoptab"     : true, 
                                        "duplicatetopdate"    : true,
                                        "default"             : true 
                                 } ) );

        } else if(  circumstance === "flop" ) {

            targetinstructions = JSON.parse( JSON.stringify( this.pointerobject.flopinstructions || { // IF IT CONTAINS PERSISTANT flopinstructions
                                
                                        "method"              : "after",  // INSTEAD OF REPLACE, BEFORE, AFTER
                                        "position"            : -1,       // PUSH (INSTEAD OF 0 FOR UNSHIFT OR ## FOR INSERT)
                                        "seek"                : false,
                                        "duplicatetoppointer" : true, 
                                        "duplicatetoptab"     : true, 
                                        "duplicatetopdate"    : true,
                                        "default"             : true 
                                 } ) );

            // VALIDATION OFF THE FLOP MAKES THINGS TOO CONFUSING, ESPECIALLY FOR INSERT. WHEN NODES HIDDEN, IT IS
            // IMPOSSIBLE FOR URLARGS TO KNOW THE PRECISE LOCATION TO INSERT. IE FLOP IS EMPTY, EMPTY, LETA, LANG WITH
            // THE SECOND EMPTY NOT PASSING VALIDATION. THIS PARTICULAR INSERT WILL HIDE THE SECOND EMPY IN PROCESSCMPREF
            targetinstructions.position            = 0;    // BUT WHEN URL ARGS CALLS processTabInventoryMutations, IT WILL
            targetinstructions.duplicatetoppointer = true; // NOT KNOW TO INSERT AFTER THE (HIDDEN) SECOND EMPTY BECAUSE WE
            targetinstructions.duplicatetoptab     = true; // HAVE NO ABILITY TO MARK FOR THIS. I TRIED TO CHANGE THE INPUT 
            targetinstructions.duplicatetopdate    = true; // VARIABLE SO THAT processCmpRefs KNOWS AHEAD OF TIME WHAT THE
            // tabindex IS BUT THIS STILL PRESENTS THE PROBLEM ABOVE. SO TO SOLVE THIS, WE JUST DEMAND THAT ALL FLOPS ACCEPT 
            // ONLY VALIDATION TRUE (UNTIL A BETTER, FLOEIBLE SOLUTION PRESENTS ITSELF FOR FLOP)         
        } else if( circumstance === "relay" ) {

            targetinstructions = JSON.parse( JSON.stringify( this.pointerobject.urlinstructions || { // IF IT CONTAINS PERSISTANT flopinstructions
                                
                                        "method"              : "after",  // INSTEAD OF REPLACE, BEFORE, AFTER
                                        "position"            : 0,       // PUSH (INSTEAD OF 0 FOR UNSHIFT OR ## FOR INSERT)
                                        "seek"                : false,
                                        "duplicatetoppointer" : true, 
                                        "duplicatetoptab"     : true, 
                                        "duplicatetopdate"    : true,
                                        "default"             : true 
                                 } ) );

        }


        // ****************************************************************************************
        // ** NOW GRACEFULLY FIX ANY AWKWARD PERSISTANT DATA IDENTIFIED FROM INSTRUCTIONS OBJECT **
        // ****************************************************************************************
        if( !targetinstructions.position ||
             isNaN( targetinstructions.position ) ) { targetinstructions.position = 0; } // MISSING PROPERTY OR NAN

        // BAD POSITION DATA SCENARIO
        if( targetinstructions.position !== -1 && 
            targetinstructions.position >= this.cmpRefArray.length ) { targetinstructions.position = this.cmpRefArray.length; }

        // WHILE -1 WILL PUSH CONSECUTIVE NODES TO END IN REVERSE, FERRIS WHEEL ORDER
        // BUT -2 WILL PUSH CONSECUTIVE NODES TO END IN DEFAULT ORDER
        if( targetinstructions.position === -2 ) { targetinstructions.position = this.cmpRefArray.length; }

        return targetinstructions; // MUTATION OF targetinstructions IS OK BC IT ORIGINALLY ARRIVES AS AN EPHEMERAL FUNTION ARGUMENT
    }



    handleParentHashChangeEvent() {

        if( this.pointerobject.urlnodelistener ) {

            let _self = this;
                                                              // MUST BE LOCAL BC previousURLargs MUST BE UNIQUE AS DISCUSSED ABOVE NEAR
            _self.checkFreshUrl().subscribe(freshurlargs => { // THE previousURLargs DECLARATION AT THE TOP OF THE FILE  
            // *** RETURNS freshurlargs IS AN ORDERED ARRAY OF STRINGS THAT WILL BE INTERPRETTED AS NODEIDS AND THE LAST, MAYBE A TABID
     
                _self.mutateNodeInventory( freshurlargs, "instantiations", "url" ).subscribe(fauxarg => {  


                    _self.mutateInventoryTab( location.href.split('/').splice(4).slice(-1)[0], 
                                             _self.fetchTargetInstructions( "url" ) ).subscribe(fauxarg => { 


                        console.log( _self.domService.cmpRefsInMemory );
                    }); 
                });
            });
        }
    }



    mutateInventoryTab( tabcandidate, targetinstructions ) {

        let _self = this;

        return Observable.create((observer) => {

            let indextarget = _self.fetchTargetIndexFromCmpRefArray( targetinstructions );

            _self.configService.ALTprocessUrlTabArgument( tabcandidate,
                                                         _self.fetchTargetPointerFromCmpRefArray( targetinstructions ), 
                                                         _self.fetchPredeccessorPointerObj( targetinstructions, true ),
                                                         _self.fetchFollowingPointerObj( targetinstructions, true ),
                                                          indextarget, // _self.fetchTargetIndexFromCmpRefArray( targetinstructions ),
                                                          targetinstructions,
                                                         _self.tabid ).subscribe(dateindicator => {

                    if( dateindicator instanceof Date ) { 

                        _self.cmpRefArray[ indextarget ].compreference.instance.parentRerender();
                    }

                    observer.next( true );
                    observer.complete(); 
            });
        });
    }



    fetchTargetPointerFromCmpRefArray( targetinstructions ) {

        if( this.cmpRefArray.length === 0 ) { return undefined; }

        return targetinstructions.position === -1 || this.cmpRefArray.length === targetinstructions.position
                                 ? this.cmpRefArray[ this.cmpRefArray.length - 1 ].compreference.instance.pointerobj
                                 : this.cmpRefArray[ targetinstructions.position ].compreference.instance.pointerobj;
    }



    fetchTargetIndexFromCmpRefArray( targetinstructions ) {

        if( this.cmpRefArray.length === 0 ) { return undefined; }

        return targetinstructions.position === -1 || this.cmpRefArray.length === targetinstructions.position
                                 ? this.cmpRefArray[ this.cmpRefArray.length - 1 ].compreference.instance.pointerindex
                                 : this.cmpRefArray[ targetinstructions.position ].compreference.instance.pointerindex;
    }


    fetchPredeccessorPointerObj( targetinstructions, changetabindicator ) { // changetabindicator MEANS INVOKED INSIDE mutateInventoryTab FUNCTION

        if( this.cmpRefArray.length        === 0 )                           { return undefined; }

        if( targetinstructions.position    === 0 )                           { return undefined; }

        if( targetinstructions.method      === "replace" && 
            this.cmpRefArray.length         <= 1 )                           { return undefined; }

        // if( changetabindicator === true ) { return this.cmpRefArray[ this.cmpRefArray.length - 2 ].compreference.instance.pointerobj }

        if( ( targetinstructions.method      === "replace" || changetabindicator === true ) && 
            this.cmpRefArray.length          > 1         &&
            ( targetinstructions.position  === -1 || 
              targetinstructions.position  === this.cmpRefArray.length ) ) {

                                             return this.cmpRefArray[ this.cmpRefArray.length - 2 ].compreference.instance.pointerobj }

        return targetinstructions.position === -1 ? this.cmpRefArray[ this.cmpRefArray.length - 1 ].compreference.instance.pointerobj
                                                  : this.cmpRefArray[ targetinstructions.position - 1 ].compreference.instance.pointerobj;
    }


    fetchFollowingPointerObj( targetinstructions, changetabindicator ) { // changetabindicator MEANS INVOKED INSIDE mutateInventoryTab FUNCTION

        if( this.cmpRefArray.length        === 0 )                           { return undefined; }

        if( targetinstructions.method      === "replace" && 
            this.cmpRefArray.length         <= 1 )                           { return undefined; }

        if( targetinstructions.position    === -1 || // WHEN UPSTREAM (FLOP) THERE IS NO EXISTING CMPREFS & WILL BE AFTER THE END IF DOWNSTREAM (URLARG)
            targetinstructions.position    === this.cmpRefArray.length )     { return undefined; } 
  
        if( ( targetinstructions.method    === "replace" || changetabindicator === true ) &&
            targetinstructions.position    === this.cmpRefArray.length - 1 ) { return undefined; }

        return targetinstructions.method   === "replace" || changetabindicator === true
                    ? this.cmpRefArray[ targetinstructions.position + 1 ].compreference.instance.pointerobj
                    : this.cmpRefArray[ targetinstructions.position ].compreference.instance.pointerobj;
    }



    checkFreshUrl() {

        let _self = this;

        return Observable.create((observer) => { // NEED TEMP uniqueargs VAR BELOW INSTEAD OF JUST RETURN

            let uniqueargs = location.href.split('/').splice(4).filter((element, i) => { 
                return element != _self.previousURLargs[i]; 
            });

           _self.previousURLargs = location.href.split('/').splice(4); 

            observer.next( uniqueargs ); // RETURNING AN ARRAY EITHER FILLED OR EMPTY WITH ZREO LENGTH
            observer.complete(); 
        });
    }



    mutateNodeInventory( mutationarray, source, method ) { 
            
        let _self = this;

        return Observable.create((observer) => {

            let targetinstructions = _self.fetchTargetInstructions( method );

/*service*/ _self.configService.processTabInventoryMutations( _self.pointerobject, 
                                                               mutationarray,         // NEEDS A NEW FETCH TO BE SURE WE HAVE A FRESH predeccessorpointerobj
                                                            { "predeccessorpointerobj" : _self.fetchPredeccessorPointerObj( targetinstructions, false ), 
                                                              "followingpointerobj"    : _self.fetchFollowingPointerObj( targetinstructions, false ) },
                                                            { "cmprefcount"            : _self.nodetarget.length,
                                                              "inventorycount"         : _self.localinventory.length },
                                                               targetinstructions,
                                                               source ).subscribe(pointerchildrenarray => {
            // *** RETURNS pointerchildrenarray IS AN ORDERED ARRAY OF POINTER OBJS OR AN EMPTY ARRAY AS A RESULT OF NO NEW URLARGS


      /*local*/ _self.processCmpRefs( pointerchildrenarray, _self.cmpRefArray.length, targetinstructions, "downstream", "led" ).subscribe(changerate => {  
                // *** RETURNS changerate IS AN INTEGER REPRESENT THE CHANGE RATE AMONST CMPREF DELETES, REPLACEMENT AND ADDITIONS


              /*local*/ _self.cleanupURLProcessing( changerate, targetinstructions ).subscribe(args => { // ?? NEED TO MOVE THIS ??
                        // *** RETURNS args IS NOTHING AND JUST TO CONTROL SEQUENCE OF EVENTS   


                            observer.next( true ); observer.complete();
                        });
                    // });
                });
            });
        });
    }


    // processInventory( parentpointerobj, mutationarray, validateinputobj, existingcountobj, targetinstructions, source ) {
            
    //     let _self  = this,
    //         marker = false;

    //     return Observable.create((observer) => {

    //         // while( !marker ) {

    // /*service*/ _self.configService.processTabInventoryMutations( _self.pointerobject, 
    //                                                                mutationarray,         // NEEDS A NEW FETCH TO BE SURE WE HAVE A FRESH predeccessorpointerobj
    //                                                             { "predeccessorpointerobj" : _self.fetchPredeccessorPointerObj( targetinstructions, false ), 
    //                                                               "followingpointerobj"    : _self.fetchFollowingPointerObj( targetinstructions, false ) },
    //                                                             { "cmprefcount"            : _self.nodetarget.length,
    //                                                               "inventorycount"         : _self.localinventory.length },
    //                                                                targetinstructions,
    //                                                                source ).subscribe(pointerchildrenarray => {


    //                 if( pointerchildrenarray.length === mutationarray.length ) {

    //                     _self.configService.processTabInventoryMutations( _self.pointerobject, 
    //                                                                mutationarray,         // NEEDS A NEW FETCH TO BE SURE WE HAVE A FRESH predeccessorpointerobj
    //                                                             { "predeccessorpointerobj" : _self.fetchPredeccessorPointerObj( targetinstructions, false ), 
    //                                                               "followingpointerobj"    : _self.fetchFollowingPointerObj( targetinstructions, false ) },
    //                                                             { "cmprefcount"            : _self.nodetarget.length,
    //                                                               "inventorycount"         : _self.localinventory.length },
    //                                                                targetinstructions,
    //                                                                source ).subscribe(pointerchildrenarray => {


    //                     });

    //                 } else {

    //                     observer.next( pointerchildrenarray ); observer.complete();
    //                 }

    //             });
    //         // }
    //     });
    // }



    // descipherSeekPosition() {

    // }





    fetchTargetCmpRefIndex( position ) {

        return position === -1 ? this.nodetarget.length -1 : position;
    }




    cleanupURLProcessing( changerate, targetinstructions ) {
            
        let _self = this;

        return Observable.create((observer) => {

            // NEEDED TO KEEP LOCALINVENTORY IN SYNCH WITH CMPREFARRAY AND TABSINMEMORY
            _self.updateLocalInventory().subscribe(subargs => { 
            // *** RETURNS subargs IS NOTHING AND JUST TO CONTROL SEQUENCE OF EVENTS

                // IF THERE IS A CHANGE IN AMOUNT OF POINTER OBJS AS A RESULT OF NEW URL ARGS MINUS deletePredecessors RESULTS,
                // INCLUDES PARAMETERS FOR HOW LONG TO UPDATE INDICES: START AND END (end is optional)
                if( changerate != 0 ) { _self.updateCmpRefIndices( "downstream", 
                                                                    changerate, 
                                                                    targetinstructions, 
                                                                    targetinstructions.position === -1 
                                                                       ? this.nodetarget.length
                                                                       : targetinstructions.position + changerate ); } // ??? NEED TO ADD FOR "upstream" SCENARIO

                // HERE IS WHEN WE CHECK THE DATABASE AND UPDATE THE COMPONENT"S INVENTORY
                // _self.fetchInventoryUpdate(); 

                observer.next( true ); observer.complete();
            });
        });
    }



    // THIS FUNCTION ACTS AS A PROXY BEFORE AND AFTER WE ROLL THE POINTERARRAY RECEIVED  
    // AS AN ARG SO WE CAN COMPARE THE LENGTH OF cmprefarray BEFORE AND AFTER
    processCmpRefs( rollingpointerarray, beforelength, targetinstructions, direction, poo ) {

        // CHECK FOR EMPTY ARRAY SO THAT CALLER CAN RESOLVE PROMISE
        if( rollingpointerarray.length === 0 ) { return Observable.create((observer) => { observer.next( [] ); observer.complete(); }); }

        let _self = this;

        return Observable.create((observer) => {      

            _self.rollPointerArray( rollingpointerarray,    
                                    targetinstructions,
                                    direction,     
                                    poo,                    // NOT STORED IN A VARIABLE BECAUSE WE CAPTURE DIFFERENT MOMENTS
                                 { "predeccessorpointerobj" : _self.fetchPredeccessorPointerObj( targetinstructions, false ), 
                                   "followingpointerobj"    : _self.fetchFollowingPointerObj( targetinstructions, false ),
                                   "cmprefiterator"         : 0 } ).subscribe(args => {
            // *** RETURNS args IS NOTHING AND JUST TO CONTROL SEQUENCE OF EVENTS    


                observer.next( _self.cmpRefArray.length - beforelength ); observer.complete(); // RETURN RESULTING CMPREF CHANGE RATE
            })                       
        });
    }



    rollPointerArray( rollingpointerarray, targetinstructions, direction, poo, validateinputobj ) { 

        let _self           = this,
            observableBatch = [],                      // ALTER DIRECTION OF LOOP DYNAMICALLY
            i               = direction === "downstream" ? 0 : rollingpointerarray.length - 1,
            targetlength    = direction === "downstream" ? rollingpointerarray.length : 0;


               if( direction === "downstream" ) {      // HERE WE DECOUPLE - END GOAL IS TO MATCH INDEX OF localinventory WITH 
                                                       // CANDIDATE POINTER OBJ - DECOUPLED FROM INDEX USED AS CMPREF WHEN VALIDATING
                    for( i; i < targetlength; ++i ) {  

                        observableBatch.push( _self.manufactorCmpRefMutation( targetinstructions, 
                                                                              validateinputobj, 
                                                                              direction, 
                                                                              rollingpointerarray, 
                                                                              i, poo ) );
                    }

        } else if( direction === "upstream") {

                    for( i; i >= targetlength; --i ) {

                        observableBatch.push( _self.manufactorCmpRefMutation( targetinstructions, 
                                                                              validateinputobj, 
                                                                              direction, 
                                                                              rollingpointerarray, 
                                                                              i, poo ) );
                    }
        }

        return Observable.forkJoin( observableBatch );
    }

    


    fetchBackupId( position, direction, inputarray, iterator, relation, poo, puff ) {
        
        if( direction === "downstream" && relation === "before" )   { 

            return position === -1 ? inputarray[ iterator - 1 ] ? inputarray[ iterator - 1 ]._id : undefined 
                                   : inputarray[ iterator + 1 ] ? inputarray[ iterator + 1 ]._id : undefined; 
        }

        if( direction === "downstream" && relation === "after" )   { 

            return position === -1 ? inputarray[ iterator + 1 ] ? inputarray[ iterator + 1 ]._id : undefined 
                                   : inputarray[ iterator - 1 ] ? inputarray[ iterator - 1 ]._id : undefined; 
        }
        
        if( direction === "upstream"   && relation === "before" )   { 

            return position === -1 ? inputarray[ iterator + 1 ] ? inputarray[ iterator + 1 ]._id : undefined 
                                   : inputarray[ iterator - 1 ] ? inputarray[ iterator - 1 ]._id : undefined; 
        }

        if( direction === "upstream"   && relation === "after" )   { 

            return position === -1 ? inputarray[ iterator - 1 ] ? inputarray[ iterator - 1 ]._id : undefined 
                                   : inputarray[ iterator + 1 ] ? inputarray[ iterator + 1 ]._id : undefined; 
        }

        // return false; // FALL THROUGH PATTERN REQUIRED BC SOME APPROPRIATE RETURN VALUES ARE undefined
    }



    fetchIndexCheck( position, direction, arraylength, relation ) {

        if( direction === "downstream" && relation === "before" )    { return position === -1 ? 0 : arraylength - 1; }

        if( direction === "downstream" && relation === "after" )     { return position === -1 ? arraylength - 1 : 0; }

        if( direction === "upstream"   && relation === "before" )    { return position === -1 ? arraylength - 1 : 0; }

        if( direction === "upstream"   && relation === "after" )     { return position === -1 ? 0 : arraylength - 1; }

        // return false; // FALL THROUGH PATTERN REQUIRED BC SOME APPROPRIATE RETURN VALUES ARE undefined
    }



    // BASICALLY DETERMINES WHETHER TO DELETE OR ADD (and maybe deletes if replace), THEN INVOKES FUNCTIONS ACCORDINGLY
    manufactorCmpRefMutation( targetinstructions, validateinputobj, direction, inputarray, iterator,  poo ) {

        let _self = this;

        return Observable.create((observer) => {    

            _self.configService.fetchAppropriatePointer( validateinputobj.predeccessorpointerobj, 
                                                        _self.fetchBackupId( targetinstructions.position, direction, inputarray, iterator, "before", poo, "pake" ), 
                                                         iterator,
                                                        _self.fetchIndexCheck( targetinstructions.position, direction, inputarray.length, "before" ),
                                                         targetinstructions,
                                                        _self.nodetarget.length ).subscribe(appropriatepredeccessorpointerobj => {



                _self.configService.fetchAppropriatePointer( validateinputobj.followingpointerobj, 
                                                            _self.fetchBackupId( targetinstructions.position, direction, inputarray, iterator, "after", poo, "woke" ), 
                                                             iterator,
                                                            _self.fetchIndexCheck( targetinstructions.position, direction, inputarray.length, "after" ),
                                                             targetinstructions,
                                                            _self.nodetarget.length ).subscribe(backupfollowingpointerobj => {



                    // IF THE TOGGLE FOR DUPLICATE NODES IS FALSE, THERE IS SOME COMPLEXITY WHEN PUSHING BECAUSE 
                    // localinventory WILL NOT BE IN SYNCH WITH cmpRefArray -> cmpRefArray will ignore, not delete 
                    let validationresult = _self.tabService.validateTabAddition( targetinstructions.position !== -1 
                                                                                        ? appropriatepredeccessorpointerobj
                                                                                        : validateinputobj.predeccessorpointerobj, 
                                                                                 targetinstructions.position !== -1 
                                                                                        ? validateinputobj.followingpointerobj
                                                                                        : backupfollowingpointerobj, 
                                                                                 inputarray[ iterator ], 
                                                                                 targetinstructions );
                    // VALIDATION IS NECCESARY HERE BC processCmpRefs EVEN THOUGH URLARGS ARE ALREADY VALIDATED IN THE processTabInventoryMutations 
                    // PROCESS, FLOP ARGS ARE NOT. SO JUST TO GRACEFULLY RECOVER FROM ANY VALIDATION ISSUES INSIDE OF THE PERSISTANT DATA THAT
                    // processCmpRef PROCESS FINDS WHEN PROCESSING FLOP DATA, WE PERFORM VALIDATION HERE (EVEN THOUGH ITS REDUNDANT FOR URLARG SCENARIOS) 


                    _self.processCmprefByInstruction( inputarray[ iterator ], 
                                                      targetinstructions, 
                                                     _self.fetchTabInfoIndexArg( inputarray.length, iterator, targetinstructions, direction, inputarray[ iterator ] ), 
                                                     _self.fetchCmpRefIndexArg( validateinputobj.cmprefiterator, targetinstructions, direction ), 
                                                      validationresult, 
                                                      validateinputobj.cmprefiterator, 
                                                     _self.fetchCmpRefAccumulationCount( inputarray.length, 
                                                                                         iterator,
                                                                                         targetinstructions.position, 
                                                                                         targetinstructions.method,
                                                                                         direction,
                                                                                         poo,
                                                                                         inputarray[ iterator ] ), 
                                                      poo ).subscribe(confirmationbool => { observer.next( confirmationbool ); observer.complete(); })

                    // THIS SOLVES A GLITCH ON INSERT WHEN ONE ARRAY ELEMENT PASSES THEN THE FOLLOWING FAILS AND THE 
                    // INPUT ARRAY ENDS BUT THE FOLLOWING *EXISTING* POINTER OBJ CONFLICTS WITH THAT ORIGINAL MENTIONED ELEMENT.
                    if( validationresult === true &&
                        targetinstructions.position !== -1 &&
                        targetinstructions.method   !== "replace" ) { validateinputobj.followingpointerobj = inputarray[ iterator ]; }

                    if( validationresult === true &&
                        targetinstructions.position === -1 &&
                        targetinstructions.method   !== "replace" ) { validateinputobj.predeccessorpointerobj = inputarray[ iterator ]; }

                    if( validationresult === true ) { ++validateinputobj.cmprefiterator; }
                    // ??? DO WE HAVE ISSUES HERE RELATED TO DELETE OR REPLACE? MAYBE RELATED TO candidateNode -> false
                    // NECCESARY DUE TO PUSH ARRAY ORDER - - IF instructions DUPLICATES TOGGLE IS FALSE THEN 
                    // localinventory INDEX WILL BE GREATER THAN THE LENGTH (AMOUNT) OF cmpRefArray
                });
            });
        });
    }



    fetchCmpRefAccumulationCount( batchlength, iterator, position, method, direction, pac, mooch ) {

        if( direction === "upstream" ) { // if( this.tabid === "mysyllabi_history_ALLRESOURCES" && pac === "smurf") { debugger; }

            if( method === "replace" ) { 

                return 0;

            } else {

                return position === -1 ? batchlength - 1 - iterator : iterator;
            }
        
        } else if( direction === "downstream" ) { // if( this.tabid === "mysyllabi_history_ALLRESOURCES" && pac === "led") { debugger; }

            if( method === "replace" && this.cmpRefArray.length <= 1 ) { return 0 }

            if( method === "replace" ) { return position === -1 || position === this.cmpRefArray.length ? this.cmpRefArray.length - 1 : position; }

            // FALL THROUGH
            return position === -1 ? this.cmpRefArray.length + iterator : position + batchlength - 1 - iterator;
        }
    }



    processCmprefByInstruction( pointerobj, targetinstructions, tabinfoindex, cmprefindex, validationflag, cmprefiterator, cmprefaccumcounter, poo  ) {

        let _self = this;

        return Observable.create((observer) => {  

            // IF METHOD IS REPLACE AND THE POINTER DOESN'T PASS VALIDIATION, 
            // THEN IT WILL TRANFORM THIS INSTRUCTION TO A DELETE
            if( ( targetinstructions.method === "replace" && validationflag !== true ) ||          
                ( targetinstructions.method === "delete"  && _self.nodetarget.length > 0 ) ) {

                    // CANT BE REACHED BECAUSE BLOCK IN shouldIncludeThirdArg FUNCTION IN tabService IS COMMENTED OUT
                    _self.deleteIndividualCmpRef( targetinstructions.position, 
                                                  targetinstructions.position === -1 || targetinstructions.position === _self.cmpRefArray.length
                    /* NEED TO ADJUST BC cmprefindex IS USED IN */  ? cmprefindex -1 
                    /* injectIndividualCmpRef TO PUSH TO THE    */  : targetinstructions.position ).subscribe(args => { 
                    // injectIndividualCmpRef TO PUSH TO THE ABSOLUE END (ie .length) WHEN POSITION === -1 (PUSH)

                        observer.next( true ); observer.complete();
                    });

            } else if( validationflag === true ) {

                    _self.injectIndividualCmpRef( pointerobj, 
                                                  targetinstructions, 
                                                  tabinfoindex, 
                                                  cmprefindex, 
                                                  validationflag, 
                                                  cmprefiterator, 
                                                  cmprefaccumcounter, 
                                                  poo ).subscribe(args => {

                        observer.next( true ); observer.complete();
                    });

            } else {
                        observer.next( false ); observer.complete();
            }
        });
    }



    // UNSHIFT, PUSH, AND INSERT EACH REQUIRE A DIFFERENT ITERATOR SOMETIMES WE NEED TO DECOUPLE THE i ITERATOR 
    // FROM ITERATORE WE USE ON THE CMPREFARRAY, THEN WE CAN SKIP THE INCREMENT OF THE i VALUE IF NECCESSARY
    fetchTabInfoIndexArg( arraylength, iterator, targetinstructions, direction, meek ) {

               if( direction === "downstream" ) {

                    if( targetinstructions.method === "replace" ) {

                        switch( true ) {

                            case targetinstructions.position === -1                           : return this.localinventory.length - arraylength + iterator;
                            case targetinstructions.position === this.nodetarget.length &&
                                 this.nodetarget.length !== 0                                 : return this.localinventory.length - arraylength + iterator;
                            default                                                           : return targetinstructions.position;
                        }

                    } else {

                        switch( true ) {

                            case targetinstructions.position === -1                          : return this.localinventory.length - arraylength + iterator;
                            case targetinstructions.position === this.cmpRefArray.length &&
                                 this.nodetarget.length !== 0                                : return this.localinventory.length - iterator - 1;
                            // default                                                          : return this.localinventory.length - this.nodetarget.length - arraylength + // TAKE ANY CONSIDERATION NODES NOT RENDERED
                            //                                                                       targetinstructions.position + arraylength - iterator - 1;                     // BUT STILL ACCOUNTED FOR IN INVENTORY
                            default                                                          : return targetinstructions.position + arraylength - iterator - 1;                     // BUT STILL ACCOUNTED FOR IN INVENTORY
                        }
                    }

        } else if( direction === "upstream" ) {

                    if( targetinstructions.method === "replace" ) {

                        return targetinstructions.position === -1 ? this.localinventory.length - arraylength + iterator
                                                                  : targetinstructions.position;
                    } else {
  
                        return targetinstructions.position === -1 ? iterator
                                                                  : targetinstructions.position + iterator;
                    }
        }
    }




    fetchCmpRefIndexArg( cmprefiterator, targetinstructions, direction ) {

               if( direction === "downstream" ) {

                    if( targetinstructions.method === "replace" ) {

                        return targetinstructions.position === -1 || 
                               ( targetinstructions.position === this.nodetarget.length && this.nodetarget.length !== 0 )
                                                                  ? this.nodetarget.length + cmprefiterator
                                                                  : targetinstructions.position;
                    } else {
                        
                        return targetinstructions.position === -1 ? this.nodetarget.length + cmprefiterator
                                                                  : targetinstructions.position;
                    }

        } else if( direction === "upstream" ) {
        
                    if( targetinstructions.method === "replace" ) {

                        return targetinstructions.position === -1 ? this.nodetarget.length + cmprefiterator
                                                                  : targetinstructions.position;
                    } else {

                        return targetinstructions.position === -1 ? this.nodetarget.length + cmprefiterator
                                                                  : targetinstructions.position;
                    }
        }
    }


    // CANT BE REACHED BECAUSE BLOCK IN shouldIncludeThirdArg FUNCTION IN tabService IS COMMENTED OUT
    deleteIndividualCmpRef( position, cmprefindex ) {

        let _self = this;

        return Observable.create((observer) => {  

// if( _self.tabid === "mysyllabi_history_ALLRESOURCES") { debugger; }

            _self.cmpRefArray.splice( cmprefindex, 1 );

            _self.nodetarget.remove( cmprefindex );

            if( position !== -1 ) {

                _self.cmpRefArray[ cmprefindex ].compreference.instance.pointerindex += -1;

                _self.cmpRefArray[ cmprefindex ].compreference.instance.cmprefindex  += -1;
            }

            observer.next( true ); observer.complete();
        });
    }



    fetchInventoryTargetPosition( position, method, cmprefiterator, pac ) {

        switch( true ) {

            case this.cmpRefArray.length <= 1 && 
                 method === "replace"                       : return 0; // ??? NECCESARY

            case position === -1 && 
                 method   === "replace"                     : return this.cmpRefArray.length - 1;

            case position === -1 && 
                 method   !== "replace"                     : return this.cmpRefArray.length;

            case position === this.cmpRefArray.length &&
                 method   === "replace"                     : return this.cmpRefArray.length - 1;

            case position === this.cmpRefArray.length &&
                 method   !== "replace"                     : return this.cmpRefArray.length;
                                                                 
            default                                         : return position;
        }
    }



    fetchCmpRefTargetRemoval( position, method, cmprefiterator, pac ) {

        switch( true ) {

            case position === -1 && method === "replace"    : return this.cmpRefArray.length === 0 ? this.cmpRefArray.length : this.cmpRefArray.length - 1;

            case position === -1 && method !== "replace"    : return cmprefiterator;

            case position === this.cmpRefArray.length       : return position - 1;
                                                                 
            default                                         : return position + 1; 
        }
    }



    injectIndividualCmpRef( pointerobj, targetinstructions, tabinfoindex, cmprefindex, validationflag, cmprefiterator, cmprefaccumcounter, poo ) { // INJECT BECAUSE ADD OR REPLACE

        let _self = this;

        return Observable.create((observer) => {

            // IF THE VALUE OF THE POINTEROBJ'S TAB PROPERTY IS NOT COMPATABLE WITH THE _id's TYPE TEMPLATE, 
            // THEN FAIL GRACEFULLLY BY CHANGING IT TO "all" or "day" ... MUST BE SURE THAT THE TARGET NODE 
            // POINTER HAS A TEMPLATE THAT SATISFIES TAB ARG (ie. 'third' or utc '1462665600000') 
            _self.gracefulCurrentTabCheck( pointerobj, tabinfoindex ).subscribe(qualifiedpointerobj => {
            // *** RETURNS qualifiedpointerobj IS AN POINTER OBJ THAT HAS BEEN CHECKED & IF NECCESARY EDITED TO DEFAULT COMPATIBLE STATE


		        let factory = this.componentFactoryResolver.resolveComponentFactory( SSSNodeComponent ),
		            cmpRef  = this.nodetarget.createComponent( factory, cmprefindex, this.nodetarget.injector );
                    
                if( targetinstructions.method === "replace" && _self.nodetarget.length > 1 ) // BC WE JUST ADDED AT LEAST ONE
                    { _self.nodetarget.remove( _self.fetchCmpRefTargetRemoval( targetinstructions.position, 
                                                                               targetinstructions.method, 
                                                                               cmprefiterator, 
                                                                               poo ) ); }

                _self.cmpRefArray.splice( _self.fetchInventoryTargetPosition( targetinstructions.position, 
                                                                              targetinstructions.method, 
                                                                              cmprefiterator, 
                                                                              poo ), 
                                           targetinstructions.method === "replace" ? 1 : 0, 
                                          { "compreference" : cmpRef, 
                                            "debugdata"     : qualifiedpointerobj, 
                                            "_id"           : qualifiedpointerobj._id } );

                _self.domService.setCmpRefInMemoryByKey( qualifiedpointerobj._id, _self.parentnodeobject._id, cmpRef );

                // if( qualifiedpointerobj.urlnodelistener ) { _self.routerService.setListenerInMemoryByKey( qualifiedpointerobj._id, cmpRef ); }

                _self.defineCmpRefVariables( qualifiedpointerobj, cmpRef, tabinfoindex, cmprefaccumcounter );

                observer.next( true ); observer.complete();
            });                                     
        });
    }


    defineCmpRefVariables( pointerobj, cmpRef, pointerindex, cmprefindex ) {

        cmpRef.instance.pointerindex                        = pointerindex;
        cmpRef.instance.cmprefindex                         = cmprefindex;
        cmpRef.instance.pointerobj                          = pointerobj;
        cmpRef.instance.matryoshkapointerobj                = this.pointerobject;
        cmpRef.instance.pointerobj.localhoverstate          = false;
        cmpRef.instance.parenttabid                         = this.tabid;
        cmpRef.instance.parenttemplateobj                   = this.templateobject;
        cmpRef.instance.matryoshkanodeobj                   = this.parentnodeobject; 

        let _self = this;

        cmpRef.instance.parentcmpreflength                  = function(){ return _self.cmpRefArray.length; } //() => return _self.cmpRefArray.length; // this.nodetarget.length; 

        cmpRef.instance.blahprompter.subscribe(($event) => { 

            console.log( "***********************************************");
            console.log( "***********************************************");
            console.log( "***************** BLAH PROMPT *****************");
            console.log( "***********************************************");
            console.log( "tabid: ", _self.tabid);
            console.log( "localinventory: ", _self.localinventory);
            console.log( "_self.cmpRefArray: ", _self.cmpRefArray);
            console.log( "_self.nodetarget: ", _self.nodetarget);
            console.log( "***********************************************");
            console.log( "@ child pointer index: ", $event.pointerindex);
            console.log( "@ child cmpref index: ", $event.cmprefindex);
            console.log( "***********************************************");
            console.log( "***********************************************");
            console.log( "***********************************************");
        });

        cmpRef.instance.deletethisnode.subscribe(($event) => { 

            // UNTIL WE HAVE TIME TO SOLVE THE DELETING LAST ELEMENT IN ARRAY PROBLEM
            if(  _self.localinventory.length === 1 ) { 

                alert("still solving the 'delete last array element' problem")

                return; 
            }

            _self.handleDeleteEvent( cmpRef.instance.pointerindex,
                                     cmpRef.instance.cmprefindex );

            // Array.prototype.indexOf.call($event.target.parentNode.childNodes,$event.target)
        }); 

        cmpRef.instance.cmppersister.subscribe(($event) => {

            // _self.replaceCmpRef( $event ).subscribe(arg => {
            // // *** RETURNS args IS NOTHING AND JUST TO CONTROL SEQUENCE OF EVENTS   

            //     // GLOBAL RERENDERPORTION
            //     // _self.nodeService.replaceSimilarCmpRefInstance( replacementobj.oldpointerobj._id, 
            //     //                                                _self.pointerobject._id ).subscribe(grandargs => {
            //     // // *** RETURNS args IS NOTHING AND JUST TO CONTROL SEQUENCE OF EVENTS   


            //     //     // console.log( _self.nodeService.cmpRefsInMemory );
            //     // });
            // });
        });

        cmpRef.instance.cmpreplacer.subscribe(($event) => {

            // _self.replaceCmpRef( $event ).subscribe(arg => {

            // });
        });
    }

    

    replaceChildCmpRefByIndex( replacementobj ) {

        let _self = this;

        return Observable.create((observer) => {


            // DELETION PORTION
            _self.removeForReplaceCmpRef( replacementobj ).subscribe(args => {
            // *** RETURNS args IS NOTHING AND JUST TO CONTROL SEQUENCE OF EVENTS   


                // ADDITION PORTION
                _self.addForReplaceCmpRef( replacementobj ).subscribe(subargs => {
                // *** RETURNS args IS NOTHING AND JUST TO CONTROL SEQUENCE OF EVENTS   


                    observer.next( true );
                    observer.complete();
                });
            });
        });
    }


    addToChildCmpRef( additionpointerid ) {

        let _self = this;

        return Observable.create((observer) => {

            _self.mutateNodeInventory( [ additionpointerid ], "direct", "relay" ).subscribe(fauxarg => { 


                observer.next( true );
                observer.complete();
            });

            // ADDITION PORTION
            // _self.addForReplaceCmpRef( additionpointerid ).subscribe(subargs => {
            // // *** RETURNS args IS NOTHING AND JUST TO CONTROL SEQUENCE OF EVENTS   

            //     let message = "<h3 style='color:white;width:230px;margin:20px 0 0;text-align:center;'>Confirmed</h3><hr><ul style='color:white;'><li><span style='display:inline;'><b>sent: </b></span><span>" + _self.matryoshkanodeobject.name + 
            //                   "</span></li><li><span style='display:inline;'><b>into: </b></span><span>" + _self.parentnodeobject.name +
            //                   "</span></li><li><span style='display:inline;'><b>method: </b></span><span>" + "copy/paste" +  
            //                   "</span></li></ul>";
                
            //     _self.modalprompter.emit( message );

            //     observer.next( true );
            //     observer.complete();
            // });
        });
    }


    removeForReplaceCmpRef( replacementobj ) {

        let _self = this;

        return Observable.create((observer) => {

            _self.domService.deleteCmpRefInMemoryByKey( _self.cmpRefArray[ replacementobj.cmprefindex ].compreference,
                                                         replacementobj.oldpointerid, 
                                                        _self.pointerobject._id ).subscribe(shoulddeletereminance => {
            // *** RETURNS args IS NOTHING AND JUST TO CONTROL SEQUENCE OF EVENTS   


                // _self.tabService.checkForDeleteTabInMemoryByKey( _self.cmpRefArray[ replacementobj.cmprefindex ].compreference.instance.nodeobject,
                //                                                 shoulddeletereminance ).subscribe(subargs => {
                // // *** RETURNS subargs IS NOTHING AND JUST TO CONTROL SEQUENCE OF EVENTS   


                //     _self.nodeService.checkForDeleteNodeInMemoryByKey( replacementobj.oldpointerid,
                //                                                        shoulddeletereminance ).subscribe(grandargs => {
                //     // *** RETURNS grandargs IS NOTHING AND JUST TO CONTROL SEQUENCE OF EVENTS   


                        _self.cmpRefArray[ replacementobj.cmprefindex ].compreference.destroy();

                        _self.cmpRefArray.splice( replacementobj.cmprefindex, 1 );

                        observer.next( true );
                //         observer.complete();
                //     });
                // });
            });
        });
    }


    addForReplaceCmpRef( additionobj ) {

        let _self = this;

        return Observable.create((observer) => {

            let factory   = _self.componentFactoryResolver.resolveComponentFactory( SSSNodeComponent ),
            cmpRef        = _self.nodetarget.createComponent( factory, additionobj.cmprefindex, _self.nodetarget.injector );

            _self.cmpRefArray[ additionobj.cmprefindex ] = {

                "_id"               : additionobj.newpointerobj._id,
                "debugdata"         : additionobj.newpointerobj,
                "compreference"     : cmpRef
            };

            _self.domService.setCmpRefInMemoryByKey( additionobj.newpointerobj._id, _self.parentnodeobject._id, cmpRef );

            _self.defineCmpRefVariables( additionobj.newpointerobj, 
                                         cmpRef, 
                                         additionobj.pointerindex, 
                                         additionobj.cmprefindex );

            _self.updateLocalInventory().subscribe(args => { });

            observer.next( true );
            observer.complete();
        });
    }



    // HERE IS THE PLACE TO CHANGE THE TAB TO "all" or "day" so we can fail gracefully
    // MAYBE ALSO ON DAY CHANGE THE COLOR HERE TO BLACK IN ORDER TO BRING LIGHT TO THE FACT THAT THERE 
    // IS BAD ASSOCIATIVE DATA STEMMING EITHER FROM PERSISTENCE OR DRAWN FROM THE TAB ARG IN THE URL
    // HAVE TO DO THIS HERE IN processCmpRefs / gracefulCurrentTabCheck INSTEAD OF processUrlNodeArguments
    // BC POINTERS DO NOT PASS THROUGH THE processUrlNodeArguments SEQUENCE OF EVENTS AND URLARGS HAVE THEIR OWN qualifyTabArg CHECK
    gracefulCurrentTabCheck( candidatepointerobj, indexarg ) {

        if( candidatepointerobj._id === null ) {

            return Observable.create((observer) => {   

                candidatepointerobj.currenttab = "vacant"; // "vacant" IS THE ONLY OPTION FOR A LOCAL VACANT NODE'S CURRENTTAB

                observer.next( candidatepointerobj ); observer.complete();

            });
        } 

        let _self = this;

        return Observable.create((observer) => {

            _self.tabService.qualifyUrlArgAgainstCandidateTemplate( candidatepointerobj, 
                                                                    candidatepointerobj.currenttab ).subscribe(tabqualified => {
            // *** RETURNS hasatemplate IS AN BOOL RELATIVE TO THE CHECK MENTIONED ABOVE - 


                if ( !tabqualified ) { 

                    _self.nodeService.memoizeNode( candidatepointerobj._id ).subscribe(nodeobj => {
                    // RETURNS nodeobj IS A NODE OBJ


                        let tabstring = nodeobj.type === "calendar" 
                                                     ? candidatepointerobj.currenttab = "day" 
                                                     : candidatepointerobj.currenttab = "all";

                        console.log("ERROR: had to reassign currenttab bc of mismatch");
                       
                        _self.tabService.updateCurrentTabOfInventoryNodeByIndex( _self.tabid, indexarg, tabstring, undefined ).subscribe(mutatedpointer => { // ??? undefined TO SATISFY MIGRAATION
                        // RETURNS pointer IS A POINTER OBJ THAT HAS BE CHANGED BY CURRENTTAB

                            observer.next( mutatedpointer ); observer.complete();
                        });
                    });    

                } else {

                            observer.next( candidatepointerobj ); observer.complete();
                }                         
            });                      
        });
    }


    // NECCESARY BECAUSE VALIDATION OFF FLOP ROLLS BACKWARDS (UPSTREAM) 
    // AND SKIPS INDICES - SO WE ROLL TIHS AFTERWARDS 
    defineCmpRefArrayIndices( startingindex ) { // , endingindex moved for migration

        let endingindex = this.nodetarget.length;
        // endingindex = endingindex || this.nodetarget.length;

        for( let i = startingindex; i < endingindex; ++i ) { 

            this.cmpRefArray[ i ].compreference.instance.cmprefindex = i;
        }
    }



    // CAPTURING THE INDEXOF A NODE IN A INVENTORY ARRAY CAN BE EXPENSIVE IF THERE ARE MANY ELEMENTS
    // WE WOULD RATHER RECEIVE AN ARGUMENT FROM THE CHILD INSTEAD OF COMPUTING ON THE DELETE EVENT HANDLER
    // SO THE SOLUTION IS TO RUN AN ITERATOR OVER THE CMPREF ARRAY AS A SILENT CALLBACK TO UPDATE EACH INDEX
    // THAT WAY EACH CMP'S INDEX IS UP TO DATE BY THE TIME THE DELETE EVENT OCCURS
    // THIS FUNCTION INVOKES AFTER THE DATASTORE UPDATES AND THE VIEW CHANGES SO THERE IS NO LAG FOR THE USER
    updateCmpRefIndices( direction, changerate, targetinstructions, startingindex ) { // ??? , endingindex for migration
                           // direction means start iterator from front to back or back to front
                           // changerate is inc or dec amount
                           // endingindex IS OPTIONAL

        if( this.cmpRefArray.length <= 1 ) { return; }

        let i, j; 

        // startingindex WILL SKIP THE FIRST ITERATOR - FIRST ITERATOR HAS ALREADY  
        // BEEN EDITED INSIDE ADD WITH POSITIN AND DELETE INSIDE deleteIndividualCmpRef
        if( direction === "downstream") { // OUTER CONDITION NECCESARY BECAUSE OF DIFFERENT LOOP SIGNATURE

            let endingindex = this.nodetarget.length;
            // endingindex = endingindex || this.nodetarget.length;

            for( i = startingindex, j = 0; i < endingindex; ++i, ++j ) { 

                // MUST COMPENSATE FOR THOSE JUST ADDED
                // let skipamount = changerate > 0             // ADDITION OR A DELETION? POSITIVE OR NEGATIVE NUMBER?
                //                     ? j < changerate        // ITERATOR IS LESS THAN AMOUNT OF RECENT ADDITIONS OR DELETIONS
                //                         ? targetinstructions.position === -1 // PUSH OR UNSHIFT/INSERT
                //                             ? 0             // THE INDEX THAT WAS ALREADY DEFINED BY defineCmpRefVariables IS SUFFICIENT
                //                             : j             // ITERATOR
                //                         : changerate        // AMOUNT OF ADDITIONS OR DELETIONS
                //                     : changerate;           // AMOUNT OF ADDITIONS OR DELETIONS

                this.cmpRefArray[ i ].compreference.instance.pointerindex += changerate; // skipamount

                this.cmpRefArray[ i ].compreference.instance.cmprefindex  += changerate; // skipamount
            }

        } else if( direction === "upstream")  {  // OUTER CONDITION NECCESARY BECAUSE OF DIFFERENT LOOP SIGNATURE

            // MUST FIX THIS LATER

            // endingindex = endingindex || 0;
            let endingindex = 0;

            for( i = startingindex; i > endingindex; --i ) { 

                // let skipamount = changerate > 0 
                //                     ? startingindex - changerate ? -1 * (startingindex - i) : changerate
                //                     : changerate;

                // let skipamount = changerate > 0         // ADDITION OR A DELETION?
                //                     ? j < changerate    // ITERATOR IS LESS THAN AMOUNT OF ADDITIONS OR DELETIONS
                //                         ? j             // ITERATOR
                //                         : changerate    // AMOUNT OF ADDITIONS OR DELETIONS
                //                     : changerate;       // AMOUNT OF ADDITIONS OR DELETIONS
            }
        }
    }



    // NEED TWO ARGUMENTS FOR PERSISTENCE AND FOR EXISTING DOM ELEMENTS
    deletePredecessors( targetindex, cmprefindex ) {

        let _self = this;

        // CHECK FOR NOT NUMBER AND NOT UTC SO THAT CALLER CAN RESOLVE PROMISE
        if( isNaN( targetindex ) || 
            targetindex instanceof Date ) { return Observable.create((observer) => { observer.next( 0 ); observer.complete(); }); }

        return Observable.create((observer) => {

            _self.tabService.deletePointerFromTabInventoryAtIndex( targetindex, 
                                                                   this.parentnodeobject._id,
                                                                   this.pointerobject ).subscribe(args => { 
            // *** RETURNS args HISTORY NODE'S TAB'S INVENTORY ARRAY

                _self.nodetarget.remove( cmprefindex );

                _self.cmpRefArray[ cmprefindex ].compreference.destroy();

                _self.cmpRefArray.splice( cmprefindex, 1);

                observer.next( -1 ); // temporary until we scale batch ???
                observer.complete();
            });
        });
    }



    updateLocalInventory() {

        let _self = this;

        return Observable.create((observer) => {

            this.tabService.memoizeTab( this.tabid, this.parentnodeobject.type ).subscribe(arg => {

                // _self.filterOutput( arg.inventory ).subscribe(subarg => {

                    // _self.localinventory = subarg;

                        // _self.localinventory = arg.inventory;

                        // observer.next("local-inventory-ready");
                        // observer.complete();

// if( _self.tabid ===  "language-arts-resources_ALLRESOURCES" ) { debugger; }

                    _self.tryRollBlanks( arg.inventory, _self.pointerobject.rollblanks ).subscribe( rolledpointerarray => {
                    // *** RETURNS rolledpointerarray IS AN ARRAY OF POINTER OBJS EITHER W/ OR W/O BLANK DEPENDING ON trybool ARG


                        _self.localinventory = rolledpointerarray;
// if( _self.tabid ===  "language-arts-resources_ALLRESOURCES" ) { debugger; }
// debugger;
                        observer.next("local-inventory-ready");
                        observer.complete();
                    });
                // }

                // if( _self.templateobject.name !== "tags" ) {

                //     _self.rollBlanks( arg.inventory )
                //          .subscribe( args => {

                //             _self.localinventory  = args;

                //          });

                // } 
            });
        });
    }



    // WORK IN PROGRESS
    fetchInventoryUpdate() {

        let _self = this;

        this.tabService.fetchTabObj( this.tabid )
            .subscribe(args => {

                _self.localinventory.forEach((element, i) => {

                    if( element.isFavorite !== true ) { 

                        _self.cmpRefArray[i];
                       
                    }
                });
            });
    }


    handleDeleteEvent( targetindex, cmprefindex ) {

        let _self = this;

        _self.deletePredecessors( targetindex, cmprefindex ).subscribe(amountjustdeleted => {
        // *** RETURNS amountjustdeleted IS AN INT FOR A SUCCESSFUL DELETE IN ORDER TO PROCEED

            _self.updateLocalInventory().subscribe(args => {});

            _self.updateCmpRefIndices( "downstream", 
                                        amountjustdeleted, // skiprate
                                        _self.fetchTargetInstructions( "url" ),
                                        cmprefindex ); 
            // ARGS FOR HOW LONG TO UPDATE INDICES
            // START AND END IS AUTO GENERATED BY LENGTH IF OMITTED 


            // if( targetindex === 0 && // IF YOU DELETED THE TOP NODE OFF THE ARRAY
            //     args.length !== _self.localinventory.length && // THERE WAS NO CHANGE IN INVENTORY LENGTH AS RESULT OF THE DELETE
            //    _self.fetchTargetInstructions( "url" ) ) {          // AND THE CMPREF BINDS URL LISTENERS

            //     // HOW DO WE FIX THIS SO THE PAGE DOES NOT RELOAD BUT BROWSER HISTORY DOES CHANGE ???
            //     let pathstring = location.origin + 
            //                      '/#/' + location.hash.split("/")[1] + 
            //                      '/'   + args[0]['_id'];


            //     // _self.silentUrlChange( pathstring, _self.handleChildHashChangeEvent );

            // } else if( args.length !== _self.localinventory.length &&
            //           _self.fetchTargetInstructions( "url" ) ) {   // AND THE CMPREF BINDS URL LISTENERS

            //     // NEED TO MAKE ADJUSTMENTS TO ROUTER TO MAKE LAST INDEX COMPATIBLE WITH BROWSER URL PATH
            //     // _self.silentUrlChange( location.origin + '/#/', _self.handleChildHashChangeEvent );
            // }
        });
    }


    // silentUrlChange( urlString, handler ) { // NO RELOAD THAT WOULD TRIGGER TOUR ROUTER INTERPRETER

    //     let win = $(window);
        
    //     win.unbind("hashchange");

    //     window.location.href = urlString; 

    //     let _self = this;

    //     // WHILE UGLY A TIMEOUT BRIDGES ENOUGH TIME BEFORE THE ROUTER SYSTEM HAS A CHANCE TO INTERPRT
    //     // TIMEOUT ALSO GUARDS AGAINST A BOT OR TROLL EXCESSIVELY HITTING URL ADDRESSES
    //     // window.setTimeout(() => {
    //         $(window).on('hashchange', (args) => { 

    //             _self.handleChildHashChangeEvent(); 

    //         }); 
    //     // }, 200);
    // }


    // filterOutput( outputarray ) {

    //     let _self = this;

    //     return Observable.create((observer) => {

    //         // CHECK HERE SO CALLER CAN JUST PASS THROUGH WITH AN EMPTY ARRAY RETURNED FROM THIS FUNCTION
    //         if( outputarray.length === 0 ) { observer.next( [] ); observer.complete(); } 

    //         // REMOVE ALL TEMP VACANTS BY FILTERING INPUT 
    //         let fetcharray = outputarray.filter( function ( filterobject ) { 

    //             if( filterobject._id )  
    //                  { return true; } 
    //             else { return false}
    //         });

    //         let nodearray = [],
    //             i = 0;

    //         fetcharray.forEach( function( element ) {

    //             _self.nodeService.memoizeNode( element['_id'] )
    //                 .subscribe(arg => {

    //                     // CONTRAST THE TAGS FROM THE TEMPLATE WITH THE TAGS FROM THE RESOURCE
    //                     if( _.intersection( _self.templateobject.refine, Object.keys( arg.tags ) ).length > 0 ) {

    //                         nodearray.push( { 
    //                                             "_id"           : arg._id, 
    //                                             "isFavorite"    : false,
    //                                             "isOpen"        : true,
    //                                             "currentdate"   : null,
    //                                             "currenttab"    : "all" 
    //                                         } ); 
    //                     }

    //                     ++i;

    //                     // RESOLVE WHEN THE ITERATION IS COMPLETE
    //                     if( i === fetcharray.length ) { 
    //                         observer.next( nodearray );
    //                         observer.complete();
    //                     }

    //                 });
    //         });
    //     });
    // }


    tryRollBlanks( rawarrayarg, trybool ) { // RETURNS NEW ARRAY BUT REFERENCES TO SAME EXISTING OBJS IN EACH SLOT
                                            // BECAUSE WE DON"T WANT TO ADD BLANKS TO THE TABS IN MEMORY
        let _self = this;                   // BUT WE DON"T WANT EXTRA WEIGHT BY CREATING A BUNCH OF NEW (IDENTICAL) OBJS

        if( !trybool ) { return Observable.create((observer) => { observer.next( rawarrayarg ); observer.complete(); }); }

        return Observable.create((observer) => {

            if( rawarrayarg.length === 0 ) { observer.next( rawarrayarg.concat( this.arrayFullOfBlanksFactory( 6 ) ) ); observer.complete(); }
            if( rawarrayarg.length === 1 ) { observer.next( rawarrayarg.concat( this.arrayFullOfBlanksFactory( 5 ) ) ); observer.complete(); }
            if( rawarrayarg.length === 2 ) { observer.next( rawarrayarg.concat( this.arrayFullOfBlanksFactory( 4 ) ) ); observer.complete(); }

            switch ( rawarrayarg.length % 3 )
            {   
                // concat does not alter. It returns a shallow copy of elements from the original array. 
                // Elements of the original array are copied into the returned array as follows: For object 
                // references (and not the actual object), slice copies object references into the new array. 
                // Both the original and new array refer to the same object. If a referenced object changes, 
                // the changes are visible to both the new and original arrays. 
                case 0:    observer.next( rawarrayarg.concat( this.arrayFullOfBlanksFactory( 3 ) ) ); observer.complete(); 
                case 1:    observer.next( rawarrayarg.concat( this.arrayFullOfBlanksFactory( 5 ) ) ); observer.complete();
                case 2:    observer.next( rawarrayarg.concat( this.arrayFullOfBlanksFactory( 4 ) ) ); observer.complete();   
            }

        });
    }


    arrayFullOfBlanksFactory( int ) {
        
        let returnArray = [];

        for(let i = 0; i < int; ++i) { returnArray.unshift( { 
                                                                "_id"           : null,
                                                                "type"          : "vacant", 
                                                                "isFavorite"    : false,
                                                                "isOpen"        : true,
                                                                "currentdate"   : null,
                                                                "currenttab"    : "vacant",
                                                                "emptyvacant"   : "emptyvacant",
                                                                "style"         : {
                                                                    "padding"       : "30px",
                                                                    "height"        : "271px",
                                                                    "width"         : "250px"
                                                                }
                                                            } ); }
        return returnArray;
    }


    // // SHOULD MOVE THIS TO SOME ExTENDS DESIGN PATTERN
    // toggleHeight(event) {

    //     console.log(event);

    //     let heightvalue = this.tabService.toggleHeight( this.tabid,
    //                                                     this.tabinformation.heightstate, 
    //                                                     this.tabinformation.percentageheight );

    //     this.tabinformation.heightstate       = heightvalue[ 0 ];
    //     this.tabinformation.percentageheight  = heightvalue[ 1 ];
    // }
}
