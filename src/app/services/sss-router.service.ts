import { Injectable }             from '@angular/core';

import { Observable } 	 	      from "rxjs/Observable";

import { SSSConfigService }       from "./../services/sss-config.service";

@Injectable()
export class SSSRouterService {

    listenersInMemory          				: Object;
    previousURLargs                         : Array<String>;

    constructor( public  configService      : SSSConfigService ) { 

        this.listenersInMemory = {};
        this.previousURLargs   = [];

        let _self = this;

    	window.addEventListener("hashchange", (args) => { 

            _self.handleHashChangeEvent(); 

        }, false);
    }


    handleHashChangeEvent() {

        let _self = this;

        this.checkFreshUrl().subscribe(freshurlargs => {

        	_self

		        	
        });
    }


    // batchProcessMutations() {

    //     let _self = this;

    //     Object.keys( this.listenersInMemory ).forEach(key => { // key IS A NODEID


    //     	let targetinstructions 		= _self.listenersInMemory[key][0].instance.fetchTargetInstructions( "url" ),
    //     	    predeccessorpointerobj  = _self.listenersInMemory[key][0].instance.fetchPredeccessorPointerObj( targetinstructions, false ),
    //     	    followingpointerobj 	= _self.listenersInMemory[key][0].instance.fetchFollowingPointerObj( targetinstructions, false ),
    //     	    cmprefcount 			= _self.listenersInMemory[key][0].instance.nodetarget.length,
    //     	    inventorycount 			= _self.listenersInMemory[key][0].instance.localinventory.length;

		  //  _self.configService.processTabInventoryMutations( _self.pointerobject, 
    //                                                           mutationarray,         // NEEDS A NEW FETCH TO BE SURE WE HAVE A FRESH predeccessorpointerobj
    //                                                        { "predeccessorpointerobj" : predeccessorpointerobj, 
    //                                                          "followingpointerobj"    : followingpointerobj,
    //                                                        { "cmprefcount"            : cmprefcount,
    //                                                          "inventorycount"         : inventorycount,
    //                                                           targetinstructions,
    //                                                           source ).subscribe(pointerchildrenarray => {


    //             _self.notifyHashChangeToCmpRefs();
    //     	});
    //     });
    // }


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


    notifyHashChangeToCmpRefs() {

        let _self = this;

        Object.keys( this.listenersInMemory ).forEach(key => {

            _self.listenersInMemory[ key ].forEach(cmpRef => {

                cmpRef.instance.handleParentHashChangeEvent();
            });
        });
    }


    setListenerInMemoryByKey( nodeid, cmprefobjectarg ) {

        if( !this.listenersInMemory[ nodeid ] ) { this.listenersInMemory[ nodeid ] = []; }

        this.listenersInMemory[ nodeid ].push( cmprefobjectarg );
    }


    deleteListenerInMemoryByKey( nodeid, cmprefobjectarg ) {

        let targetindex = this.listenersInMemory[ nodeid ].indexOf( cmprefobjectarg );

        this.listenersInMemory[ nodeid ].splice( targetindex, 1 );

        if( this.listenersInMemory[ nodeid ].length === 0 ) { delete this.listenersInMemory[ nodeid ]; }
    }
}
