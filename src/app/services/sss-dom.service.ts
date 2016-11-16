import { Injectable } 		    from "@angular/core";

import { Observable } 			from "rxjs/Observable";
import "rxjs/Rx";

import { SSSNodeService }       from "./../services/sss-node.service";
import { SSSTabService }        from "./../services/sss-tab.service";
import { SSSRouterService }     from "./../services/sss-router.service";


@Injectable()
export class SSSDOMService {

    cmpRefsInMemory : Object;

    constructor( public  nodeService                : SSSNodeService,
                 public  tabService                 : SSSTabService,
                 public  routerService              : SSSRouterService ) {

        this.cmpRefsInMemory = {};
    }


    // getCmpRefInMemoryByLocationKey( sourceid, locationid ) { return this.cmpRefsInMemory[ sourceid ][ locationid ]; }

    // getCmpRefInMemoryBySourceKey( sourceid ) { return this.cmpRefsInMemory[ sourceid ]; }


    setCmpRefInMemoryByKey( sourceid, parentid, cmprefobjectarg ) {

        if( !this.cmpRefsInMemory[ sourceid ] ) { this.cmpRefsInMemory[ sourceid ] = {}; }

        if( !this.cmpRefsInMemory[ sourceid ][ parentid ] ) { this.cmpRefsInMemory[ sourceid ][ parentid ] = []; }

        this.cmpRefsInMemory[ sourceid ][ parentid ].push( cmprefobjectarg );
    }



    refreshSpecificCmpRefs( sourceid, parentid ) {

        let _self = this;

        Object.keys( this.cmpRefsInMemory[ sourceid ] ).forEach(key => {

            _self.cmpRefsInMemory[ sourceid ][ key ].forEach(cmpRef => {

                cmpRef.instance.interpetNode( sourceid ).subscribe(args => { });
            });
        });
    }


    replaceSimilarCmpRefInstances( parentid, replacementobj ) {

        let _self = this;

        Object.keys( this.cmpRefsInMemory[ parentid ] ).forEach(key => {

            _self.cmpRefsInMemory[ parentid ][ key ].forEach(cmpRef => {

                cmpRef.instance.relayParentReplacementMsg( replacementobj );
            });
        });
    }


    addToSimilarCmpRefInstances( parentid, newpointerid ) {

        let _self = this;

        Object.keys( this.cmpRefsInMemory[ parentid ] ).forEach(key => {

            _self.cmpRefsInMemory[ parentid ][ key ].forEach(cmpRef => {

                cmpRef.instance.relayParentAdditionMsg( newpointerid );
            });
        });
    }


    // rerenderSimilarCmpRefInstance( sourceid, parentid ) {

    //     let _self = this;

    //     return Observable.create((observer) => {

    //         this.cmpRefsInMemory[ sourceid ][ parentid ].forEach(element => {

    //             element.instance.interpetNode( sourceid ).subscribe(args => { });
    //         });

    //         observer.next( true );
    //         observer.complete();
    //     });
    // }


    deleteCmpRefInMemoryByKey( cmprefobjectarg, oldnodeid, parentid ) {

        let _self = this;

        return Observable.create((observer) => {

            // JUSTIFY USING indexOf BC WE CAN COUNT ON THESE ARRAYS NEVER BEING VERY LONG
            // BUT THE FUNCTION RETURNS AN OBSERVABLE JUST IN CASE
            let targetindex           = this.cmpRefsInMemory[ oldnodeid ][ parentid ].indexOf( cmprefobjectarg ),
                shoulddeletereminance = false;


            this.cmpRefsInMemory[ oldnodeid ][ parentid ].splice( targetindex, 1 );

            if( this.cmpRefsInMemory[ oldnodeid ][ parentid ].length === 0 ) { delete this.cmpRefsInMemory[ oldnodeid ][ parentid ]; }

            if( Object.keys( this.cmpRefsInMemory[ oldnodeid ] ).length === 0 ) { 

                delete this.cmpRefsInMemory[ oldnodeid ]; 

                shoulddeletereminance = true; // IF ITS THE LAST APPEARANCE FROM THAT NODEID, 
            }                                 // THEN SEND MSG DOWNSTREAM TO REMOVE FROM NODESINMEMORY AND TABSINMEMORY


            _self.tabService.checkForDeleteTabInMemoryByKey( cmprefobjectarg.instance.pointerobj, shoulddeletereminance ).subscribe(subargs => {
            // *** RETURNS subargs IS NOTHING AND JUST TO CONTROL SEQUENCE OF EVENTS   


                _self.nodeService.checkForDeleteNodeInMemoryByKey( oldnodeid, shoulddeletereminance ).subscribe(grandargs => {
                // *** RETURNS grandargs IS NOTHING AND JUST TO CONTROL SEQUENCE OF EVENTS   


		            observer.next( shoulddeletereminance );
		            observer.complete();
                });
            });
        });
    }


    // setCmpRefInMemoryByParentIndex( sourceid, locationid, targetindex, cmprefobjectarg ) {

    //     // if( !this.cmpRefsInMemory[ sourceid ] ) { this.cmpRefsInMemory[ sourceid ] = {}; }

    //     // this.cmpRefsInMemory[ sourceid ][ locationid ] = cmprefobjectarg;
    // }
}