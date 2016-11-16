import { Injectable,
		 EventEmitter } 	from '@angular/core';

import { Observable } 	 	from "rxjs/Observable";

import * as _ 				from "underscore";

import { SSSAPIService }    from "./sss-api.service";

@Injectable()
export class SSSNodeService {

    nodesInMemory 			: Object;

    constructor( public apiService: SSSAPIService ) {

        if ( !JSON.parse( localStorage.getItem("nodesInMemory") ) ) {
             localStorage.setItem("lastUpdate", JSON.stringify( Date.now() ) );
             localStorage.setItem("nodesInMemory", JSON.stringify( {} ) );
        }

        this.nodesInMemory   = JSON.parse( localStorage.getItem("nodesInMemory") );
    }


    addNodesInBatch( nodearray ) {

        let _self = this;

        return Observable.create((observer) => {

            nodearray.forEach( function(element) {

                element.instancebatch = true;

                _self.nodesInMemory[ element._id ] = element;
            });

            _self.localUpdateNodesInMemory( _self.nodesInMemory );

            observer.next();
            observer.complete();
        });
    }


    assembleNodeObject( nodeobj ) {

        let propertyobject = {

            "_id"                       : nodeobj._id,
            "name"                      : nodeobj.name,
            "type"                      : nodeobj.type,
            "heightstate"               : "super",
            "color"                     : nodeobj.color,
            "auxtabs"                   : nodeobj.auxtabs       || [],
            "tags"                      : nodeobj.tags          || {},
            "background"                : nodeobj.background    || "",
            "custom"                    : nodeobj.custom        || "",
            "url"                       : nodeobj.url           || "",
            "subscribers"               : [],
            "instantiations"            : {
                "history"               : [ nodeobj._id ]
                // "history"     : [ nodeobj['_id'] ],
                // "favorites"     : [ nodeobj['_id'] ]
            }
        }
          
        return propertyobject;
    }

    memoizeNode( nodeid ) {

        if(!nodeid) {
            debugger;    
        }

        let _self = this;

        return Observable.create((observer) => {

            if ( _self.nodesInMemory[ nodeid ] === undefined )  {

                _self.apiService.fetchNode( nodeid )
                     .subscribe(arg => {

                        // console.log("CANDY 52n", nodeid);
                        // console.log("CANDY 52n", arg);

                        _self.setNodeInMemoryByKey( nodeid, arg.body[0] );

                        observer.next( arg.body[0] );
                        observer.complete();
                    });

            } else if( _self.nodesInMemory[ nodeid ].instancebatch ) { // IF THE SYSTEM RECENTLY FETCHED NODE IN BATCH

                // REMOVE FLAG SO FUTURE CALLS WITH CHOOSE CONDITION BELOW
                delete _self.nodesInMemory[ nodeid ].instancebatch; 

                // uPDATE THE LOCAL DATA STORE IN MEMORY WITH THE FETCHED INFORMATION
                _self.localUpdateNodesInMemory( _self.nodesInMemory );


                // fETCH TAB FROM MEMORY
                observer.next( _self.nodesInMemory[ nodeid ] );
                observer.complete();

            } else {

                observer.next( _self.nodesInMemory[ nodeid ] );
                observer.complete();
            }
        });
    }

    fetchIfNodeExists( nodeid ) {

        if(!nodeid) {
            debugger;    
        }

        let _self = this;

        return Observable.create((observer) => {

            if ( _self.nodesInMemory[ nodeid ] === undefined)  {

                _self.apiService.fetchNode( nodeid )
                     .subscribe(arg => {

                        if( arg.body[0] ) {

                            _self.setNodeInMemoryByKey( nodeid, arg.body[0] );

                            observer.next( arg.body[0] );
                            observer.complete();

                        } else {

                            observer.next( false );
                            observer.complete();
                        }
                    });

            } else {

                observer.next( _self.nodesInMemory[ nodeid ] );
                observer.complete();
            }
        });
    }


    persistNodeEdits( nodeid, linkobject ) {

        this.apiService.editNodeFromPointer( nodeid, linkobject )
            .subscribe(args => { console.log('* new persistNodeEdits *', args); });
    }


    persistDecrementLeafCount( nodeid, leaftype, decamount ) {
        this.apiService.decrementLeafCount( nodeid, leaftype, decamount )
                .subscribe(args => { console.log('* new decrementation *', args); });
    };


    silentAddNewNode( nodeobj ) {
        this.setNodeInMemoryByKey( nodeobj._id, this.assembleNodeObject( nodeobj ) ); 
    }


    deleteNodeInMemory( nodeid ) {
        delete this.nodesInMemory[ nodeid ];
        this.localUpdateNodesInMemory( this.nodesInMemory );
    };


    generateDefaultVacantTags( nodeobject, parenttabrefinearray, matryoshkanodeobjtags, inventory ) {

        let _self = this;

        return Observable.create((observer) => {
// debugger;
            if( nodeobject.tags === undefined) { // POPULATE TAGS IF TEMP VACANT

                nodeobject.tags = {}; // OPERATING DIRECTLY ON OBJECT SO THE 
                                      // CHANGES WILL AUTO REFLECT FOR ALL OBJECT REFERENCES

                let defaulttags = parenttabrefinearray.concat( _.difference( Object.keys( matryoshkanodeobjtags ), 
                                                                             inventory.map( function( tag ) { return tag._id; } ) ) );
                let _self = this;

                defaulttags.forEach( function( tag ) {
                    nodeobject.tags[ tag ] = 1; // OPERATING DIRECTLY ON OBJECT SO THE 
                });                             // CHANGES WILL AUTO REFLECT FOR ALL OBJECT REFERENCES

                observer.next( nodeobject.tags );
                observer.complete();

            } else {

                observer.next( "complete" );
                observer.complete();
            }
        }); 
    }


    getNodeTitle( nodeid ) { 

        let _self = this;

        return Observable.create((observer) => {

            _self.memoizeNode( nodeid )
                 .subscribe(args => { 
                    observer.next( args.name );
                    observer.complete();
                });
        });  
    }

    
    getNodeColor( nodeid ) { 

        let _self = this;

        return Observable.create((observer) => {

            _self.memoizeNode( nodeid )
                 .subscribe(args => { 
                    observer.next( args.color );
                    observer.complete();
                });
        });  
    };


    getNodeBatch( nodeidarray ) {

        let _self = this;

        return Observable.create((observer) => {

            let returnarray = [];
            var i;
            for(i= 0; i < nodeidarray.length; ++i) {
                   returnarray.push( this.nodesInMemory[nodeidarray[i]]) ;
            }

            observer.next( returnarray );
            observer.complete();

            // console.log('WILEYYYYY', nodeidarray.map( function(element) {
            //         return nodesInMemory[element];
            // }));


            // return nodeidarray.map( function(element) {
            //         return nodesInMemory[element];
            // });
        });  
    }


    getNodesInMemoryByKey( nodeid ) { return this.nodesInMemory[nodeid]; };

    setNodeTagsInMemoryByKey( stringid, tagobject ) {
        this.nodesInMemory[ stringid ].tags          = tagobject;
        this.localUpdateNodesInMemory( this.nodesInMemory );
    }


    setNodeBackgroundInMemoryByKey( stringid, imagepathstring ) {
        this.nodesInMemory[ stringid ].background    = imagepathstring;
        this.localUpdateNodesInMemory( this.nodesInMemory );
    };


    setNodeNameInMemoryByKey( stringid, namestring ) {
        this.nodesInMemory[ stringid ].name          = namestring;
        this.localUpdateNodesInMemory( this.nodesInMemory );
    };


    setNodeInMemoryByKey( stringid, objectarg ) {
        this.nodesInMemory[ stringid ] = objectarg;
        this.localUpdateNodesInMemory( this.nodesInMemory );
    }


    checkForDeleteNodeInMemoryByKey( sourceid, shoulddeletereminance ) {

        if( !shoulddeletereminance ) { return Observable.create((observer) => { observer.next( false ); observer.complete(); }); }

        let _self = this;

        return Observable.create((observer) => {
   
            delete _self.nodesInMemory[ sourceid ];

            _self.deleteNodeInMemory( _self.nodesInMemory );

            observer.next( true );
            observer.complete();
        });
    }


    localUpdateNodesInMemory( objectarg ) {
        localStorage.setItem("nodesInMemory", JSON.stringify( objectarg ) );
        localStorage.setItem("lastUpdate", JSON.stringify( Date.now() ) );
    }
}
