import { Injectable, 
		 EventEmitter } 		from "@angular/core";

import { Http } 				from "@angular/http";

import { Observable } 			from "rxjs/Observable";
import "rxjs/Rx";

import { SSSAPIService } 		from "./sss-api.service";
import { SSSTabService } 		from "./sss-tab.service";
import { SSSNodeService } 		from "./sss-node.service";
import { SSSCalendarService } 	from "./sss-calendar.service";
import { SSSConfigService } 	from "./sss-config.service";


@Injectable()
export class SSSAccountService {

    _emitterAuthenticationStatusUpdated 	: EventEmitter<any> = new EventEmitter();
    http 									: Http;
    userobject 								: any;
    sessionobject 							: any;

    constructor( http: Http,
                 public apiService 			: SSSAPIService,
                 public nodeService 		: SSSNodeService,
                 public tabService 			: SSSTabService,
                 public calendarService 	: SSSCalendarService,
                 public configService 		: SSSConfigService ) {

        this.http = http;

        if ( !JSON.parse( localStorage.getItem("userobject") ) ) {
             localStorage.setItem("lastUpdate", JSON.stringify( Date.now() ) );
             localStorage.setItem("userobject", JSON.stringify( {

                 _id         : "GUEST",
                 email       : null,
                 level       : null,
                 password    : null
             } ) ); 
        }

        if ( !JSON.parse( localStorage.getItem("sessionobject") ) ) {
             localStorage.setItem("lastUpdate", JSON.stringify( Date.now() ) );
             localStorage.setItem("sessionobject", JSON.stringify( {} ) ); 
        }

        this.userobject     = JSON.parse( localStorage.getItem("userobject") );
        this.sessionobject  = JSON.parse( localStorage.getItem("sessionobject") );
    }


	dummyTest() {
		return "van slyke";
	}


    login( username, password ) {

        let _self = this;

        return Observable.create((observer) => {

            let urlstatearray = location.hash.split("/"),
                historyobj = {};

            historyobj["history"] = {
                "nodes" : _self.tabService.getTabInMemoryByKey( this.configService.getHistoryNodeID() + "_ALLRESOURCES" )["inventory"].map( element => {
                    return _self.nodeService.getNodesInMemoryByKey( element._id );
                }),
                "inventory" : _self.tabService.getTabInMemoryByKey( this.configService.getHistoryNodeID() + "_ALLRESOURCES" )["inventory"]
            };

            _self.apiService.login( username, password, urlstatearray, historyobj )
                .subscribe(args => {

                    console.log("instanceobj", args);

                    _self.sessionobject.token = args["auth-token"];

                    _self.setSessionObject( _self.sessionobject );

                    let packagedUserObj = {

                        _id         : args.userobject._id,
                        email       : args.userobject.email,
                        level       : args.userobject.level,
                        password    : null
                    }

                    _self.setUserObject( packagedUserObj );

                    _self.calendarService.resetCalendarsInMemory();

                    _self.configService.setApplicationMetaData( args.userobject._id ) // , args.instanceobj
                         .subscribe(subargs => {

                            _self._emitterAuthenticationStatusUpdated.next( 'authentication-status-updated' );

                            observer.next( args );
                            observer.complete();

                         });

                });
        });  
    }


    logout() {

        let _self = this;

        return Observable.create((observer) => {

            let urlstatearray = location.hash.split("/");

            _self.apiService.logout( _self.sessionobject.token, urlstatearray )
                 .subscribe(args => {

                    _self.setUserObject( {} );

                    _self.sessionobject.token = null;

                    _self.setSessionObject( _self.sessionobject );

                    _self.calendarService.resetCalendarsInMemory();

                    _self.configService.setApplicationMetaData( "mysyllabi" ) // , args.instanceobj
                         .subscribe(subargs => {

                            _self._emitterAuthenticationStatusUpdated.next( 'authentication-status-updated' );

                            let pathstring;

                            if( urlstatearray[3] === undefined ) {
                                pathstring = location.origin + 
                                             '/#/' + urlstatearray[1] + 
                                             '/' + urlstatearray[2];
                            } else {
                                pathstring = location.origin + 
                                             '/#/' + urlstatearray[1] + 
                                             '/' + urlstatearray[2] + 
                                             '/' + urlstatearray[3];
                            }

                            window.location.href = pathstring;

                            observer.next();
                            observer.complete();

                         });
                });
        });  
    }


    register( userobj ) {

        let _self = this;

        return Observable.create((observer) => {

            _self.nodeService.getNodeBatch([ // NEED TO CHANGE mysyllabi TO guest ONCE FUTURE FEATURES ARE ADDED
                "mysyllabi_application",
                "mysyllabi_history",
                "mysyllabi_taxonomy",
                "mysyllabi_favorites",
                "mysyllabi_categories"
            ])
                .subscribe(args => {

                    let guestnodearray = args;

                    _self.tabService.getTabBatch([
                        "mysyllabi_application_ALLRESOURCES",
                        "mysyllabi_history_ALLRESOURCES",
                        "mysyllabi_taxonomy_ALLRESOURCES",
                        "mysyllabi_favorites_ALLRESOURCES",
                        "mysyllabi_categories_ALLRESOURCES"
                    ])
                        .subscribe(subargs => {
                            
                            let guesttabarray = subargs;

                            let formattednodearray = guestnodearray.map( element => {
                            
                                                                        let nodesuffix = element._id.split("_")[1];
                                                                        element._id = userobj.userid + "_" + nodesuffix; 

                                                                        return element;
                                                            });

                            let formattedtabarray  = guesttabarray.map( element => {
                                                                        let tabsuffix = element._id.split("_")[1];
                                                                        let tableaf = element._id.split("_")[2];
                                                                        element._id = userobj.userid + "_" + tabsuffix + "_" + tableaf;
                                                                        return element;
                                                            } );


                            _self.apiService.register( userobj, {
                                                                    nodes : formattednodearray, 
                                                                    tabs  : formattedtabarray
                                                                })
                                .subscribe(supersubargs => {

                                    // THERE IS AN ISSUE HERE BECAUSE THE CLOJURE DOESN"T RETUN A TOKEN INSIDE supersubargs

                                    console.log("??BEFORE supersubargs", supersubargs);
                                    console.log("??BEFORE _self.userobject", _self.userobject);
                                    console.log("??BEFORE _self.sessionobject.token", _self.sessionobject.token);

                                    let packagedUserObj = {

                                        _id         : supersubargs.userobject._id,
                                        email       : supersubargs.userobject.email,
                                        level       : supersubargs.userobject.level,
                                        password    : null
                                    }

                                    _self.setUserObject( packagedUserObj );

                                    _self.sessionobject.token = supersubargs["auth-token"];
                                    
                                    _self.setSessionObject( _self.sessionobject );

                                    console.log("?? supersubargs", supersubargs);
                                    console.log("?? _self.userobject", _self.userobject);
                                    console.log("?? _self.sessionobject.token", _self.sessionobject.token);

                                    _self.calendarService.resetCalendarsInMemory();

                                    _self.configService.setApplicationMetaData(supersubargs.userobject._id) // , supersubargs.instanceobject
                                         .subscribe(screamingsupersubargs => {

                                            _self._emitterAuthenticationStatusUpdated.next( {name: 'authentication-status-updated'} );

                                            observer.next();
                                            observer.complete();

                                         });
                                });
                        });
                });
        });  
    }


    memoizeUser() {

        let _self = this;

        return Observable.create((observer) => {

            if( _self.userobject === undefined ||
                _self.userobject === null )  {

                _self.apiService.fetchUser( _self.userobject._id )
                     .subscribe(args => {
                        observer.next( args );
                        observer.complete();
                     });

            } else {
                observer.next( _self.userobject );
                observer.complete();
            }

        });  
    }

    getUserObject()             { return this.userobject; }

    getAuthenticationStatus()   { 

        console.log("PUNCE", this.sessionobject.token);

        return this.sessionobject.token !== undefined &&
               this.sessionobject.token !== null; 

    }

    setSessionObject( sessionobj ) {
        this.sessionobject = sessionobj;
        this.localUpdateSessionObject( this.sessionobject );
    }

    setUserObject( userobj ) {
        this.userobject = userobj;
        this.localUpdateUserObject( this.userobject );
    }

    localUpdateSessionObject( sessionobj ) {
        localStorage.setItem("sessionobject", JSON.stringify( sessionobj ) );
        localStorage.setItem("lastUpdate", JSON.stringify( Date.now() ) );
    }

    localUpdateUserObject( userobj ) {
        localStorage.setItem("userobject", JSON.stringify( userobj ) );
        localStorage.setItem("lastUpdate", JSON.stringify( Date.now() ) );
    }

}
