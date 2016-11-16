import { Injectable,
		 EventEmitter } 		from '@angular/core';

import { Http } 				from "@angular/http";

import { Observable } 			from "rxjs/Observable";

import { SSSAPIService } 	    from "./sss-api.service";
import { SSSNodeService } 	    from "./sss-node.service";

@Injectable()
export class SSSCategoryService {

    _emitterNodeButtonsPaginationUpdated 	: EventEmitter<any> = new EventEmitter();
    http 									: Http;
    currentHoverCategoryIndex 				: any;
    currentHoverCategoryID 					: String;
    currentSidebarCategoryTitle 			: String;
    nodeButtonsPagination 					: any;
    categoriesInMemory 						: Array<String>;

    constructor( http: Http,
                 public apiService 			: SSSAPIService,
                 public nodeService 		: SSSNodeService ) {

        let todaydate = new Date(); 

        if ( !JSON.parse( localStorage.getItem("currentHoverCategoryIndex") ) ) {
             localStorage.setItem("lastUpdate", JSON.stringify( Date.now() ) );
             localStorage.setItem("currentHoverCategoryIndex", JSON.stringify( 0 ) ); }
        if ( !JSON.parse( localStorage.getItem("nodeButtonsPagination") ) ) {
             localStorage.setItem("lastUpdate", JSON.stringify( Date.now() ) );
             localStorage.setItem("nodeButtonsPagination", JSON.stringify( 0 ) ); }
        if ( !JSON.parse( localStorage.getItem("categoriesInMemory") ) ) {
             localStorage.setItem("lastUpdate", JSON.stringify( Date.now() ) );
             localStorage.setItem("categoriesInMemory", JSON.stringify( [] ) ); }

        this.currentHoverCategoryIndex      = JSON.parse( localStorage.getItem("currentHoverCategoryIndex") );
        this.currentHoverCategoryID         = localStorage.getItem("currentHoverCategoryID");
        this.currentSidebarCategoryTitle    = localStorage.getItem("currentSidebarCategoryTitle");
        this.nodeButtonsPagination          = JSON.parse( localStorage.getItem("nodeButtonsPagination") );
        this.categoriesInMemory             = JSON.parse( localStorage.getItem("categoriesInMemory") ) || [];
    }


    pushCategoryInMemory( categorynodeid ) {

        let originalposition = this.categoriesInMemory.indexOf( categorynodeid );   
        
        if( originalposition !== -1 ) { this.categoriesInMemory.splice( originalposition, 1 ); } // NO DUPLICATES                              

        this.categoriesInMemory.push( categorynodeid );

        this.localUpdateCategoriesInMemory( this.categoriesInMemory );
    }


    unshiftCategoryInMemory( categorynodeid ) {

        let originalposition = this.categoriesInMemory.indexOf( categorynodeid ); 
        
        if( originalposition !== -1 ) { this.categoriesInMemory.splice( originalposition, 1 ); } // NO DUPLICATES

        this.categoriesInMemory.unshift( categorynodeid ); 

        this.localUpdateCategoriesInMemory( this.categoriesInMemory );
    }


    goToPreviousCategory() {

        let _self = this;

        return Observable.create((observer) => {

            let oldtarget = this.categoriesInMemory.pop();

            this.unshiftCategoryInMemory( oldtarget );

            observer.next( "category-change-success" );
            observer.complete();
        });
    }

    
    goToNextCategory() {

        let _self = this;

        return Observable.create((observer) => {

            let oldtarget = this.categoriesInMemory[0];

            this.categoriesInMemory.splice( 0, 1 );

            this.pushCategoryInMemory( oldtarget );

            observer.next( "category-change-success" );
            observer.complete();
        });
    };


    setNodeButtonsPagination( intarg )             { 
        this.nodeButtonsPagination     = intarg; 
        this.localUpdateNodeButtonsPagination( this.nodeButtonsPagination ); 
        this._emitterNodeButtonsPaginationUpdated.next({});
    };  


    forwardpagination( nodeoptionslength ) {           

        if( this.nodeButtonsPagination < nodeoptionslength - 6) 
             { this.setNodeButtonsPagination( this.nodeButtonsPagination + 6 ); } 
        else { this.setNodeButtonsPagination( 0 ); }
    };

    
    backwardpagination( nodeoptionslength )                    {

             if( this.nodeButtonsPagination > 6 )        { this.setNodeButtonsPagination( this.nodeButtonsPagination - 6 ); } 
        else if( this.nodeButtonsPagination == 0 )       { this.setNodeButtonsPagination( nodeoptionslength - 6 ); } 
        else if( this.nodeButtonsPagination <= 6 )       { this.setNodeButtonsPagination( 0 ); }
    };


    getNodeButtonsPagination()  { return this.nodeButtonsPagination; };
    getCurrentCategoryID()      { return this.categoriesInMemory[0]; };


    getCurrentCategoryColor()   { 

        let _self = this;

        return Observable.create((observer) => {
            _self.nodeService.getNodeColor( _self.categoriesInMemory[0] )
                .subscribe( args => { 
                    observer.next( args );
                    observer.complete();
                });
        }); 
    };


    localUpdateNodeButtonsPagination( intarg )           { 
        localStorage.setItem("nodeButtonsPagination", JSON.stringify( intarg ) );
        localStorage.setItem("lastUpdate", JSON.stringify( Date.now() ) );
    };


    localUpdateCategoriesInMemory( arrayarg ) {
        localStorage.setItem("categoriesInMemory", JSON.stringify( arrayarg ) );
        localStorage.setItem("lastUpdate", JSON.stringify( Date.now() ) );
    };
}
