import { Component, 
		 Input, 
		 Output,
		 EventEmitter } 		    from "@angular/core";

import { Observable } 				from "rxjs/Observable";

import { SSSConfigService } 		from "./../services/sss-config.service";
import { SSSNodeService } 			from "./../services/sss-node.service";
import { SSSTabService } 			from "./../services/sss-tab.service";


@Component({
    selector: 'sss-table',
    template: ``
})
export class SSSTableComponent {

    tabinformation                      : any;
    tabid 								: String;

    // @Input's
    public templateobject               : any;
    public parentnodeobject             : any;
    public matryoshkanodeindex          : String;
    public pointerobject                : any;


    constructor(public configService    : SSSConfigService,
                public nodeService      : SSSNodeService,
                public tabService       : SSSTabService) {

        this.tabinformation             = {};

        let _self = this;

        tabService._emitterTabInventoryUpdated.subscribe(args => {

            if( args.tabid == _self.tabid ) {
                _self.updateTabInformation();
            }
        });

        tabService._emitterTabCurrentDateUpdated.subscribe(args => {

            alert(args.tabid);

            if( args.tabid == _self.tabid ) {

                _self.pointerobject.currentdate = args.currentdate; // WHY ???

                _self.updateTabInformation();
            }
        });
    };


    ngAfterContentInit() { 

        this.updateTabInformation();
    }


    updateTabInformation() {

        let _self = this;


        this.tabService.memoizeTab( this.tabid, this.parentnodeobject.type )
            .subscribe(arg => {

                _self.tabinformation.heightstate        = arg.heightstate;
                _self.tabinformation._id                = arg._id;
                _self.tabinformation.percentageheight   = arg.percentageheight;
                _self.tabinformation.type               = arg.type;

                _self.tabinformation.inventory          = _self.rollBlanks( arg.inventory );  // TEMPORARY
// debugger;
                // _self.nodearray = arg.inventory;

                // IF THERE IS NO FILTER - - - IE. ALL TAB
                // if( _self.templateobject.refine.length === 0 ) { 

                    // _self.fetchedCount = arg.inventory.length;

                    // _self.tabinformation.inventory = _self.rollBlanks( arg.inventory ); // CALL ROLL BLANKS FUNCTION HERE

                                // console.log("o MY GOD", arg);
                                // console.log("O MAYONAISE", _self.tabid);
                                // console.log("O MEETS", arg.inventory);
                                // console.log("O MATS", _self.tabinformation.inventory);

                // } else {

                    // _self.filterOutput( arg.inventory )
                    //      .subscribe(subarg => {

                                // _self.fetchedCount = subarg.length;

                                // _self.tabinformation.inventory = _self.rollBlanks( subarg ); 

                                // console.log("U MY GOD", arg);
                                // console.log("U MAYONAISE", _self.tabid);
                                // console.log("U MEETS", subarg);
                                // console.log("U MATS", _self.tabinformation.inventory);

                            // });
                // }
            });
    }


//     filterOutput( outputarray ) {

//         let _self = this;

//         return Observable.create((observer) => {
// debugger
//             // REMOVE ALL TEMP VACANTS BY FILTERING INPUT 
//             let fetcharray = outputarray.filter( function ( filterobject ) { 
//                 if( filterobject._id )  
//                      { return true; } 
//                 else { return false}
//             });

//             let nodearray = [];
//                 console.log("U FETCH ARRAY", fetcharray);

//             fetcharray.forEach( function( element ) {

//                 _self.nodeService.memoizeNode( element._id ) // WHY MEMOIE HERE ???
//                     .subscribe(arg => {

//                         // CONTRAST THE TAGS FROM THE TEMPLATE WITH THE TAGS FROM THE RESOURCE
//                         if( _.intersection( _self.templateobject.refine, Object.keys( arg.tags ) ).length > 0 ) {
//                             nodearray.push( { 
//                                                 "_id"           : element._id, 
//                                                 "isFavorite"    : element.isFavorite,
//                                                 "isOpen"        : element.isOpen,
//                                                 "currenttab"    : element.currenttab,
//                                                 "currentdate"   : element.currentdate
//                                             } ); 
//                         }

//                         ++i;

//                         // RESOLVE WHEN THE ITERATION IS COMPLETE
//                         if( i === fetcharray.length ) { 
//                         	observer.next( nodearray );
//                             observer.complete();
//                         }
//                     });
//             });
//         });
//     }


    rollBlanks( rawarrayarg ) { // RETURNS NEW ARRAY BECAUSE WE DON"T WANT TO ADD BLANKS TO THE TABS IN MEMORY
// debugger;
        if( rawarrayarg.length === 0 ) { return this.arrayFullOfBlanksFactory( 6 ); }
        if( rawarrayarg.length === 1 ) { return rawarrayarg.concat( this.arrayFullOfBlanksFactory( 5 ) ); }
        if( rawarrayarg.length === 2 ) { return rawarrayarg.concat( this.arrayFullOfBlanksFactory( 4 ) ); }

        switch ( rawarrayarg.length % 3 )
        {
            case 0:    return rawarrayarg.concat( this.arrayFullOfBlanksFactory( 3 ) ); 
            case 1:    return rawarrayarg.concat( this.arrayFullOfBlanksFactory( 5 ) );
            case 2:    return rawarrayarg.concat( this.arrayFullOfBlanksFactory( 4 ) );   
        }
    }


    arrayFullOfBlanksFactory( int ) {
        
        let returnArray = [];

        for(let i = 0; i < int; ++i) { returnArray.unshift( { 
                                                                "_id"           : null,
                                                                "type"          : "vacant", 
                                                                "isFavorite"    : false,
                                                                "isOpen"        : true,
                                                                "currentdate"   : null,
                                                                "currenttab"    : "vacant" 
                                                            } ); }
        return returnArray;
    }


    // SHOULD MOVE THIS TO SOME ExTENDS DESIGN PATTERN
    toggleHeight(event) {

        console.log(event);

        let heightvalue = this.tabService.toggleHeight( this.tabid,
                                                        this.tabinformation.heightstate, 
                                                        this.tabinformation.percentageheight );

        this.tabinformation.heightstate       = heightvalue[ 0 ];
        this.tabinformation.percentageheight  = heightvalue[ 1 ];
    }


    // SHOULD MOVE THIS TO NODE CTRL WHEN WE MASTER OUTPUTS
    deleteNodeAtIndex( index ) { 

        // let _self = this;

        // this.tabService.removeNodeAtIndex( index, this.configService.getHistoryNodeID() )
        //     .subscribe(args => { // data IS THE HISTORY NODE'S TAB'S INVENTORY ARRAY

        //         if( index === 0 && args.length !== 0) { 
        //         // IF YOU DELETED THE TOP NODE OFF THE ARRAY (AND IT IS NOT THE ONLY NODE IN THE ARRAY)
        //             let pathstring = location.origin + 
        //                              '/#/' + location.hash.split("/")[1] + 
        //                              '/'   + args[0]['_id'];

        //             window.location.href = pathstring;

        //         } else if( args.length === 0 ) {

        //             window.location.href = location.origin + '/#/';
        //         }

        //     });
    }

}
