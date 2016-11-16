import { Injectable, 
	     EventEmitter } 		from "@angular/core";

import { Http} 					from "@angular/http"; 

import { Observable} 			from "rxjs/Observable";

import * as _ 					from "underscore";

import { SSSConfigService } 	from "./sss-config.service";
import { SSSAccountService } 	from "./sss-account.service";
import { SSSCalendarService } 	from "./sss-calendar.service";
import { SSSCategoryService } 	from "./sss-category.service";
import { SSSNodeService } 		from "./sss-node.service";
import { SSSTabService } 		from "./sss-tab.service";



@Injectable()
export class SSSProxyService {

    _emitterPointerUpdated 				: EventEmitter<any> = new EventEmitter();
    http: Http;

    constructor( http: Http,
                 public configService 	: SSSConfigService,
                 public accountService 	: SSSAccountService,
                 public calendarService : SSSCalendarService,
                 public categoryService : SSSCategoryService,
                 public nodeService 	: SSSNodeService,
                 public tabService 		: SSSTabService ) {

    }


    persistToMemory( resourceobject, parenttabid, originaltagarray, resourceindex, parentnodeobj, parenttabrefinearray, pointerobj ) { 

        let _self = this;

        return Observable.create((observer) => {

            // SINCE WE REPLACE THE PREDECCESING VACANT, 
            // WE DELETE IT FROM nodesInMemory IF IT WAS A VACANT NODE PLACEHOLDER
            // if( resourceobject['_id'] && resourceobject.type !== "poster" ) {

            //     nodeservice.updateNodeTags( parenttabid, [], Object.keys( originaltagarray ))
            //                .then( function( data ) { nodeservice.deleteNodeInMemory( resourceobject['_id'] ); }, 
            //                       function( data ) { console.log('ERROR updateNodeTags FROM persistToMemory FUNCTION INSIDE RESOURCE SERVICE'); });
            // }

            _self.tabService.memoizeTab( parenttabid, parentnodeobj.type ).subscribe(args => {
//debugger;
                if( resourceindex > args.inventory.length ) { // IF WE NEED TO PERSIST VACANT PREDECESSORS
                    
                    _self.addBatchNodes( parenttabid, 
                                         resourceindex, 
                                         parentnodeobj, 
                                         parenttabrefinearray, 
                                         pointerobj.localinputobj, 
                                         Object.keys( resourceobject.tags ) ).subscribe(subargs => {

                        observer.next( subargs );
                        observer.complete();

                   });

                } else {

                    // ADD NEW NODE TO nodesInMemory AND RELOAD NODE ON SUCCESSFUL PROMISE
                    _self.addNewNode( pointerobj.localinputobj, 
                                      parenttabid, 
                                      resourceindex, 
                                      parentnodeobj, 
                                      Object.keys( resourceobject.tags ),
                                      pointerobj ).subscribe(subargs => {

                        // _self.updateLeafCount( linkinput.url, 
                        //                  resourceobject.type,
                        //                  parentnodeobj, 
                        //                  pointerobj.currentdate );

                        observer.next( subargs );
                        observer.complete();

                        // if( resourceobject.type === 'vacant' ) {

                        //     console.log('@@ VACANT');

                        //     nodeservice.updateNodeTags( parentnodeobj['_id'], Object.keys( resourceobject.tags ), [] )
                        //                .then( function( data ) { resolve( data ); }, // DATA IS NODEID
                        //                       function( data ) { console.log('ERROR updateNodeTags FROM updateParentNodeTags FUNCTION INSIDE RESOURCE CTRL'); }); 

                        // } else {


                        //     console.log('@@ THE OTHER');

                        //     updateParentNodeTags( data, parentnodeobj['_id'], originaltagarray, resourceobject.tags )
                        //          .then(function( data ) { resolve( data ); }, // DATA IS NODEID
                        //                function( data ) { console.log('ERROR updateParentNodeTags FROM persistToMemory FUNCTION INSIDE RESOURCE CTRL'); }); 
                        // } 
                    });
                }
            });  
        });
    };


    addBatchNodes( parenttabid, resourceindex, parentnodeobj, parenttabrefinearray, linkinputobj, existingrefinearray ) {
    
        let _self = this;

        return Observable.create((observer) => {

            _self.tabService.memoizeTab( parenttabid, parentnodeobj.type )
                 .subscribe(args => {

                    // if( resourceindex <= arrayMeasure.length - 1) { resolve(); }

                    let tagset = { },
                        nodeid,
                        arrayToRoll = existingrefinearray.concat( _.without( Object.keys( parentnodeobj.tags ), "pre-k", "kinder", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th", "11th", "12th", "college") );

                    arrayToRoll.forEach( function( tag ) {
                        tagset[ tag ] = 1;
                    });


                    _self.rollVacants( tagset, parentnodeobj.color, resourceindex, args.inventory.length)
                         .subscribe(subargs => {

                                if( _self.accountService.getUserObject()._id === undefined ) {

                                    nodeid = 'GUEST_' + linkinputobj.name.split(" ").join("-");

                                } else if( _self.accountService.getUserObject()._id === "mysyllabi" ) {

                                    nodeid = linkinputobj.name.split(" ").join("-");

                                } else {

                                    nodeid = _self.accountService.getUserObject()._id + '_' + linkinputobj.name.split(" ").join("-");
                                }

                                let returninventory = subargs.inventory.concat([{ 
                                      "_id"                     : nodeid, 
                                      "isFavorite"              : false,
                                      "isOpen"                  : true,
                                      "currentdate"             : null,
                                      "currenttab"              : "basic"
                                }]);

                                let posternodeobj = { 
                                    "_id"                       : nodeid,
                                    "name"                      : linkinputobj.name || "",       // null IF VACANT
                                    "type"                      : "poster",
                                    "tags"                      : tagset,
                                    "color"                     : parentnodeobj.color,
                                    "background"                : linkinputobj.background || "", // null IF VACANT
                                    "url"                       : linkinputobj.url || "", 
                                    "auxtabs"                   : [],
                                    "custom"                    : "",
                                    "subscribers"               : [],
                                    "instantiations"            : {
                                        "history_ALLRESOURCES"  : [ nodeid ]
                                    }
                                };

                                let postertabobj = [{
                                    "_id"                       : nodeid + "_ALLRESOURCES",
                                    "type"                      : "poster",
                                    "heightstate"               : "dooper",
                                    "percentageheight"          : 100,
                                    "inventory"                 : []
                                }];

                                let returnnodes = subargs.nodes.concat([ posternodeobj ]);

                                _self.nodeService.silentAddNewNode( posternodeobj );

                                _self.tabService.setTabsInMemoryByKey( nodeid + "_ALLRESOURCES", postertabobj );
                    
                                // nodeservice.updateNodeTags( parentnodeobj['_id'], Object.keys( resourceobject.tags ), [] )
                                //            .then( function( data ) { resolve( data ); }, // DATA IS NODEID
                                //                   function( data ) { console.log('ERROR updateNodeTags FROM updateParentNodeTags FUNCTION INSIDE RESOURCE CTRL'); }); 

                                // ADD RESOURCE TO INVENTORY OF PARENT FOLDER OR CALENDAR TAB WHERE RESOURCE WAS AUTHORED
                                _self.tabService.updateTabResourcesWithBatchArray( parenttabid, resourceindex, {
                                    "inventory"     : returninventory,
                                    "nodes"         : returnnodes,
                                    "tabs"          : postertabobj
                                } );

                                observer.next();
                                observer.complete();
                         }); 
                   });  
        });
    };


    rollVacants( tagset, color, resourceindex, increment ) {

        let _self = this;

        return Observable.create((observer) => {

            let nodeobjarray    = [],
                pointerobjarray = [],
                datedummy       = new Date(),
                iterator        = 0;

            while( resourceindex > increment ) {

                let nodetitlestring;

                if( this.accountService.getUserObject()._id === undefined )  {

                    // idvariable         = 'GUEST_' + nodetitlestring;
                    nodetitlestring    = 'GUEST_' + 'HHHHHHHH-' + datedummy.getTime() + '-' + ++iterator;

                } else if( this.accountService.getUserObject()._id === "mysyllabi" ) {

                    // idvariable         = nodetitlestring;
                    nodetitlestring    = 'HHHHHHHH-' + datedummy.getTime() + '-' + ++iterator;

                } else {

                    // idvariable         = this.accountService.getUserObject()._id + '_' + nodetitlestring;
                    nodetitlestring    = this.accountService.getUserObject()._id + '_' + 'HHHHHHHH-' + datedummy.getTime() + '-' + ++iterator;
                }


                // THIS ONE IS TO PUT NODES IN MEMORY (LOCALLY AND IN BATCH ON THE SERVER)
                let nodeobjectdetails = {
                    "_id"               : nodetitlestring,
                    "name"              : "",       // VACANT
                    "type"              : "vacant",
                    "tags"              : tagset,
                    "color"             : color,
                    "background"        : "", // VACANT
                    "auxtabs"           : [],
                    "url"               : null,
                    "custom"            : "",
                    "subscribers"       : [],
                    "instantiations"    : null
                }

                _self.nodeService.silentAddNewNode( nodeobjectdetails );

                nodeobjarray.push( nodeobjectdetails );

                // THIS ONE IS TO CREATE POINTEROBJ LOCALLY THROUHG THE updateTabResourcesWithBatchArray FUNCTION
                // AND IN BATCH ON THE SERVER
                pointerobjarray.push({ 
                      "_id"           : nodetitlestring, 
                      "isFavorite"    : false,
                      "isOpen"        : true,
                      "currentdate"   : null,
                      "currenttab"    : "vacant", 
                      "style" : {
                            "width"   : "250px", 
                            "height"  : "271px", 
                            "display" : "inline-block", 
                            "padding" : "30px"
                      }
                });

                ++increment;
            }

            observer.next({
                "inventory" : pointerobjarray,
                "nodes"     : nodeobjarray
            });
            observer.complete();

        });
    }


    
    // ADDS NEW NODE TO NODESINMEMORY, NEW TAB OBJ TO TABSINMEMORY, AND RETURNS NEW POINTER OBJ
    addNewNode( linkinputobjarg, parenttabid, resourceindex, parentnodeobj, existingrefinearray, originalpointerobj ) {

        let _self = this;

        return Observable.create((observer) => {

            let datedummy = new Date(),
                intendednodetype,
                nodetitlestring,
                idvariable,
                localcurrenttab;

            if( !linkinputobjarg.url && !linkinputobjarg.name && !linkinputobjarg.background ) { // ITS A VACANT

                intendednodetype    = "vacant";
                nodetitlestring     = "HHHHHHHH-" + datedummy.getTime();
                localcurrenttab     = "vacant";

            } else if( linkinputobjarg.url === undefined || linkinputobjarg.url === "" ) { 

                intendednodetype    = "stub";
                nodetitlestring     = "GGGGGGGG-" + datedummy.getTime();
                localcurrenttab     = "stub";

            } else {

                intendednodetype    = "poster";
                nodetitlestring     = linkinputobjarg.name;
                localcurrenttab     = "basic";
            }



            if( this.accountService.getUserObject()._id === undefined )  {

                idvariable         = 'GUEST_' + nodetitlestring.split(" ").join("-");

            } else if( this.accountService.getUserObject()._id === "mysyllabi" ) {

                idvariable         = nodetitlestring.split(" ").join("-");

            } else {

                idvariable         = this.accountService.getUserObject()._id + '_' + nodetitlestring.split(" ").join("-");
            }


            let tagset = { },
                arrayToRoll = existingrefinearray.concat( _.without( Object.keys( parentnodeobj.tags ), "pre-k", "kinder", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th", "11th", "12th", "college") );

            arrayToRoll.forEach( function( tag ) {
                tagset[ tag ] = 1;
            });


            /***********************************************************************************
            /***** THIS BLOCK CREATES A NEW NODE IN MEMORY & LOCAL STORAGE *********************
            /**********************************************************************************/

            // ROLL NEW PAYLOAD TO CREATE NEW NODE
            let nodeobjectdetails = {
                "_id"                           : idvariable,
                "name"                          : linkinputobjarg.name || "",       // null IF VACANT
                "type"                          : intendednodetype,
                "tags"                          : tagset,
                "color"                         : parentnodeobj.color,
                "background"                    : linkinputobjarg.background || "", // null IF VACANT
                "auxtabs"                       : [],
                "url"                           : linkinputobjarg.url || "",
                "custom"                        : "",
                "subscribers"                   : [],
                "instantiations"                : {
                    "history_ALLRESOURCES"      : [ idvariable ]
                }
            };

            let tabobjectdetails;

            if( intendednodetype === 'poster') {

            	tabobjectdetails = {
                    "_id"                       : idvariable + "_ALLRESOURCES",
                    "type"                      : "poster",
                    "heightstate"               : "dooper",
                    "percentageheight"          : 100,
                    "inventory"                 : []
                };

                _self.tabService.setTabsInMemoryByKey( idvariable + "_ALLRESOURCES", tabobjectdetails );

            } else {
                tabobjectdetails = null;
            }

            // NEW POSTER NODE ADDED TO nodesInMemory -- CAN'T BE REALIZED UPON DEMAND WITH nodeservice.memoizeNode BECAUSE WE CAN'T WRITE TO JSON FILE
            _self.nodeService.silentAddNewNode( nodeobjectdetails );

            let mutationpointerobj = JSON.parse(JSON.stringify( originalpointerobj ));

            mutationpointerobj._id        = idvariable;
            mutationpointerobj.currenttab = localcurrenttab;

            // ADD RESOURCE TO INVENTORY OF PARENT FOLDER OR CALENDAR TAB WHERE RESOURCE WAS AUTHORED
            _self.tabService.updateResourceIndexFromTab( parenttabid, 
                                                         resourceindex,
                                                         {
                                                                "inventory"         : [ mutationpointerobj ],
                                                                "nodes"             : [ nodeobjectdetails ],
                                                                "tabs"              : [ tabobjectdetails ]
                                                         }).subscribe(args => {

                // IF NO URL, THEN IT IS A STUB OR A VACANT -> -> -> STUB & VACANT NODES DO NOT HAVE LEAF TABS TO REFERENCE -> -> SO IF STUB OR VACANT, THEN RETURN EARLY
                // if( linkinputobjarg.url === undefined || linkinputobjarg.url === "" ) { 

                //     observer.next( idvariable );
                //     observer.complete();

                // } else {
                    
                //     // FALL THROUGH IF ITS NOT A STUB OR VACANT AND PROCESS POSTER TAB
                //     _self.rollLeafTab( idvariable, linkinputobjarg);

                    observer.next( mutationpointerobj );
                    observer.complete();
                // }
            });
        });
    };


    editNode( pointerobj, nodeobj, parenttabid, parentnodeobj, originaltagarray, resourceobject, resourceindex ) {

        let _self = this;

        return Observable.create((observer) => {

            // EDIT NODE NAME AND/OR BACKGROUND
            _self.nodeService.setNodeNameInMemoryByKey( nodeobj._id, pointerobj.localinputobj.name );
            _self.nodeService.setNodeBackgroundInMemoryByKey( nodeobj._id, pointerobj.localinputobj.background );
            _self.nodeService.setNodeTagsInMemoryByKey(  nodeobj._id, nodeobj.tags  );

            // EDIT TAB IF POSTER NODE
            // if( nodeobj.type === 'poster' ) {

            _self.nodeService.memoizeNode( nodeobj._id ).subscribe(args => {

                let updatednodeobject = args;

                let tabobjectdetails = {
                    "_id"                       : args._id + "_ALLRESOURCES",
                    "type"                      : "poster",
                    "heightstate"               : "dooper",
                    "percentageheight"          : 100,
                    "inventory"                 : []
                };

                pointerobj.currenttab = "basic";

                _self.tabService.updateResourceIndexFromTab( parenttabid, 
                                                             resourceindex,
                                                             {
                                                               "inventory"         : [ pointerobj ],
                                                               "nodes"             : [ updatednodeobject ],
                                                               "tabs"              : [ tabobjectdetails ]
                                                             }).subscribe(args => {

                    if( JSON.parse( localStorage.getItem("sessionobject") ) !== null &&
                        JSON.parse( localStorage.getItem("sessionobject") ) !== undefined &&
                        JSON.parse( localStorage.getItem("sessionobject") ).token !== undefined &&
                        JSON.parse( localStorage.getItem("sessionobject") ).token !== null )  {

                        _self.nodeService.persistNodeEdits( args._id, pointerobj.localinputobj );
                    }

                    // _self._emitterPointerUpdated.next( { "nodeid" : parentnodeobj._id } );

                    observer.next( nodeobj._id ); 
                    observer.complete(); 
                });
            });

            // } else {
            
            //     nodeservice.persistNodeEdits( nodeobj['_id'], linkinputobjarg);

            //     $rootScope.$broadcast('prompt-tag-report', { "nodeid" : parentnodeobj['_id'] } ); 
            // }


            // updateParentNodeTags( nodeobj['_id'], parentnodeobj['_id'], originaltagarray, resourceobject.tags )
            //              .then(function( data) {


            //                 $rootScope.$broadcast('tab-inventory-updated', { "tabid" : parenttabid } ); 

            //                 resolve( nodeobj['_id'] ); // RESOLVE DATA IS A NODEID

            //                 return;
            //              }, function( data ) {
            //                 console.log('ERROR updateParentNodeTags FROM persistToMemory FUNCTION INSIDE RESOURCE CTRL');
            //              }); 
        });
    };

    
    // rollLeafTab( nodeidnumber, linkinputobjarg) {

    //     // ID OF NEW TAB           // THIS FUNCTION AUTOMATICALLY ADDS TAB REFERENCE TO ITS PARENT NODE FOR FREE
    //     let newpostertabidnumber = undefined; // revision was made here
    //         _self = this;

    //     // NEW POSTER TAB ADDED TO tabsInMemory -- CAN'T BE REALIZED UPON DEMAND 
    //     // WITH tabservice.memoizeTab BECAUSE WE CAN'T WRITE TO JSON FILE
    //     // NECCESARY BECAUSE WE'VE NEVER POSTED TO REMOTE DATASTORE
    //     // RECONSIDER IN FUTURE WHEN I HAVE A BETTER IDEA OF LOCAL STORAGE & GARBAGAE COLLECTION
    //     this.tabService.memoizeTab( newpostertabidnumber, "poster")
    //         .subscribe(args => {

    //             // ADD RESOURCE TO NEW POSTER TAB IN MEMORY
    //             // THIS HAS BEEN DELAYED UNTIL NOW IN ORDER TO PACAKAGE A POSTER TAB WITH URL INVENTORY ELEMENT
    //             _self.tabService.updateResourceIndexFromTab( args._id, 0, { "type" : "url", "url" : linkinputobjarg.url } );
    //             // tabservice.updateResourceIndexFromTab( data['_id'], 0, {
    //             //                             "inventory"     : [{ "type" : "url", "url" : linkinputobjarg.url }],
    //             //                             "nodes"         : [ nodeobjectdetails ]
    //             //                        });


    //             // tabservice.persistTabsToServer( data['_id'] );

    //             // INCREMENT NODE'S QUANTITY OF RESOURCES
    //             _self.nodeService.incrementLeafCount( nodeidnumber, 'ALLRESOURCES' );

    //             // resolve( nodeidnumber );
    //         });  
    // }


    // updateLeafCount( linkinputurl, resourcetype, parentnodeobj, targetdate) { // targetdate is optional

    //     if (( linkinputurl     !== '' && resourcetype === 'stub') ||
    //         ( linkinputurl     === '' && resourcetype === 'poster')) { return; }

    //     // INCREMENT NODE'S QUANTITY OF RESOURCES
    //     if( parentnodeobj.type === 'calendar') { this.nodeService.incrementLeafCount( parentnodeobj['_id'], targetdate ); } 
    //     else                                   { this.nodeService.incrementLeafCount( parentnodeobj['_id'], 'ALLRESOURCES' ); }
    // }

    // // var updateParentNodeTags = function( nodeid, parentnodeid, originaltagarray, resourceobjecttags ) {

    // //     var _self = this;

    // //     return $q(function(resolve, reject) {

    // //         nodeservice.memoizeNode( nodeid )
    // //             .then(function( data ) {

    // //                 if( originaltagarray === undefined ) { // TEMP VACANT
    // //                     var beforearray = []
    // //                 } else { var beforearray = Object.keys( originaltagarray ); }
    // //                 var afterarray      = Object.keys( resourceobjecttags );

    // //                 var additions       = _.difference( afterarray, beforearray);
    // //                 var subtractions    = _.difference( beforearray, afterarray);

    // //                 if( additions.length === 0 && subtractions.length === 0 ) { resolve(); }

    // //                 nodeservice.updateNodeTags( parentnodeid, additions, subtractions )
    // //                     .then(function( data) {
    // //                         resolve( nodeid );
    // //                     }, function( data ) {
    // //                         console.log('ERROR FROM updateParentNodeTags FUNCTION INSIDE RESOURCE SERVICES');
    // //                     }); 

    // //             }, function( data ) {

    // //                 console.log('ERROR MEMOIZING NODE FROM updateParentNodeTags FUNCTION INSIDE RESOURCE CTRL');

    // //             });
    // //     });
    // // };

    fetchHoverColor( parentnode, bool ) {

        let _self = this;

        return Observable.create((observer) => {

            if( bool === true && _self.configService.getGlobalHoverState() === 'calendar' ) {
                
                _self.calendarService.getCurrentCalendarColor()
                    .subscribe(args => { 
                        observer.next( args );
                        observer.complete();
                    });
            }

            if ( bool === true && _self.configService.getGlobalHoverState() === 'folder') {
                
                _self.categoryService.getCurrentCategoryColor()
                    .subscribe(args => { 
                        observer.next( args );
                        observer.complete();
                    });
            }

            if ( bool  === false ) { 
                observer.next( parentnode.color );
                observer.complete();
            }

        });
    };

    
    resetNode( parentnodeobj, originaltagarray, resourceobj, parenttabid, resourceindex, parenttabrefinearray, targetdate ) {

        let _self = this;

        return Observable.create((observer) => {

            if( resourceobj.type === 'stub' ) { _self.nodeService.deleteNodeInMemory( resourceobj._id ); }

            // REMOVE TAGS FROM THE RESOURCE'S PARENT NODE
            // nodeservice.updateNodeTags( parentnodeobj['_id'], 
            //                             [],                              // ADDITIONS
            //                             Object.keys( originaltagarray )) // SUBTRACTIONS
            //     .then(function( data) {

            //             // WE DELETE THE VACANT/STUB NODE FROM nodesInMemory
            //             if( resourceobj.type === 'stub' ) { nodeservice.deleteNodeInMemory( resourceobj['_id'] ); }
                        
            //         }, function( data ) { console.log('ERROR updateNodeTags FROM handleDeleteButton FUNCTION INSIDE RESOURCE CTRL'); });


            // NOW CREATE A NEW VACANT NODE IN MEMORY
            _self.addNewNode( {}, 
                              parenttabid, 
                              resourceindex, 
                              parentnodeobj,
                              parenttabrefinearray,
                              undefined )
                .subscribe(args => {

                        // DECREMENT PARENT NODE'S QUANTITY OF RESOURCES
                        let leafkey;

                        parentnodeobj.type === 'calendar' ? leafkey = targetdate : leafkey = 'ALLRESOURCES';

                        // _self.nodeService.decrementLeafCount( parentnodeobj._id, leafkey );

                        if( JSON.parse( localStorage.getItem("sessionobject") ) !== null &&
                            JSON.parse( localStorage.getItem("sessionobject") ) !== undefined &&
                            JSON.parse( localStorage.getItem("sessionobject") ).token !== undefined &&
                            JSON.parse( localStorage.getItem("sessionobject") ).token !== null )  {

                            _self.nodeService.persistDecrementLeafCount( parentnodeobj._id, leafkey, -1);
                        }

                        // _self._emitterPointerUpdated.next( { "nodeid" : args } ); 
                        
                        observer.next( args ); // args IS NODEID
                        observer.complete(); 

                    });
        });
    };
}
