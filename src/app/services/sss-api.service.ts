import { Injectable, 
		 EventEmitter } 	from '@angular/core';

import { Http, 
		 Headers } 	     	from "@angular/http"; 

import 'rxjs/add/operator/map';


const DEVELOPMENT_SERVER 	= "http://localhost:3000/";
const PRODUCTION_SERVER 	= "https://mysyllabi-proxy-server.herokuapp.com/";

@Injectable()
export class SSSAPIService {

    http 					: Http;
    SERVER_ENVIRONMENT 		: String;

    constructor( http: Http ) {

        this.http = http;

        // this.SERVER_ENVIRONMENT = PRODUCTION_SERVER;
        false ? this.SERVER_ENVIRONMENT = PRODUCTION_SERVER
              : this.SERVER_ENVIRONMENT = DEVELOPMENT_SERVER;
    }

    fetchInstance( instanceid, argarray ) {

        let headers = new Headers();

        headers.append("Content-Type", "application/json");

        return this.http.post(this.SERVER_ENVIRONMENT + "instance",
                        JSON.stringify({
                            instanceid      : instanceid,
                            argarray        : argarray,
                            appinstance     : "mysyllabi",
                            username        : "GUEST"
                       }),
                       {headers: headers})
                   .map(res => res.json());
    }


    fetchTabInstance( tabid, tabprefix ) {

        let headers = new Headers();

        headers.append("Content-Type", "application/json");

        return this.http.post(this.SERVER_ENVIRONMENT + "tab-instance",
                        JSON.stringify({
                            tabid                   : tabid,
                            tabprefix               : tabprefix,
                            application_instance    : "mysyllabi",
                            username                : "GUEST"
                       }),
                       {headers: headers})
                   .map(res => res.json());
    }


    fetchNode( nodeid ) {

        return this.http.get( this.SERVER_ENVIRONMENT + "node/" + nodeid)
                   .map(res => res.json());

    }


    fetchTabObj( tabid ) {

        return this.http.get( this.SERVER_ENVIRONMENT + "tab/" + tabid)
                   .map(res => res.json());
    }


    fetchUser( username ) { 

        return this.http.get( this.SERVER_ENVIRONMENT + "user/" + username)
                   .map(res => res.json());
    }


    updateIsFavorite( tabid, index, bool ) {

        let headers = new Headers();

        headers.append('Authorization', 'Token ' + JSON.parse( localStorage.getItem("sessionobject") ).token);

        headers.append("Content-Type", "application/json");

        return this.http.post(this.SERVER_ENVIRONMENT + "tab/update-is-favorite",
                        JSON.stringify({
                            tabid             : tabid,
                            index             : index,
                            bool              : bool
                       }),
                       {headers: headers})
                   .map(res => res.json());
    }


    updateIsOpen( tabid, index, bool ) {

        let headers = new Headers();

        headers.append('Authorization', 'Token ' + JSON.parse( localStorage.getItem("sessionobject") ).token);

        headers.append("Content-Type", "application/json");

        return this.http.post(this.SERVER_ENVIRONMENT + "tab/update-is-open",
                              JSON.stringify({
                                    tabid             : tabid,
                                    index             : index,
                                    bool              : bool
                              }),
                             {headers: headers})
                        .map(res => res.json());
    }


    createCalendar( batchobj ) {

        let headers = new Headers();

        headers.append('Authorization', 'Token ' + JSON.parse( localStorage.getItem("sessionobject") ).token);

        headers.append("Content-Type", "application/json");

        return this.http.post(this.SERVER_ENVIRONMENT + "calendar/create",
                        JSON.stringify({
                            batchobj        : batchobj
                       }),
                       {headers: headers})
                   .map(res => res.json());
    }


    unshiftNodeBatch( tabid, tabtype, batchobj, shouldinstantiate ) {

    	let authorid;

        if( JSON.parse( localStorage.getItem("userobject") ) ) {
            authorid = JSON.parse( localStorage.getItem("userobject") )._id;
        } else {
            authorid = null;
        }

        let headers = new Headers();

        headers.append('Authorization', 'Token ' + JSON.parse( localStorage.getItem("sessionobject") ).token);

        headers.append("Content-Type", "application/json");

        return this.http.post(this.SERVER_ENVIRONMENT + "tab/unshift-node-batch",
                        JSON.stringify({
                            tabid             : tabid,
                            tabtype           : tabtype,
                            batchobj          : batchobj,
                            shouldinstantiate : shouldinstantiate,
                            authorid          : authorid
                       }),
                       {headers: headers})
                   .map(res => res.json());
    }


    replacePointerAtTabIndex( tabid, index, batchobj ) {

        let headers = new Headers();

        headers.append('Authorization', 'Token ' + JSON.parse( localStorage.getItem("sessionobject") ).token);

        headers.append("Content-Type", "application/json");

        return this.http.post(this.SERVER_ENVIRONMENT + "tab/replace-node-at-index-batch",
                        JSON.stringify({
                            tabid           : tabid,
                            pointerindex    : index,
                            batchobj        : batchobj
                       }),
                       {headers: headers})
                   .map(res => res.json());
    }


    pushBatch( tabid, index, batchobj ) {

        let headers = new Headers();

        headers.append('Authorization', 'Token ' + JSON.parse( localStorage.getItem("sessionobject") ).token);

        headers.append("Content-Type", "application/json");

        return this.http.post(this.SERVER_ENVIRONMENT + "tab/push-batch",
                        JSON.stringify({
                            tabid           : tabid,
                            pointerindex    : index,
                            batchobj        : batchobj
                       }),
                       {headers: headers})
                   .map(res => res.json());
    }


    editNodeFromPointer( nodeid, linkobject ) {

        let headers = new Headers();

        headers.append('Authorization', 'Token ' + JSON.parse( localStorage.getItem("sessionobject") ).token);

        headers.append("Content-Type", "application/json");

        return this.http.post(this.SERVER_ENVIRONMENT + "node/edit-node-from-pointer",
                        JSON.stringify({
                            nodeid            : nodeid,
                            linkobject        : linkobject
                       }),
                       {headers: headers})
                   .map(res => res.json());
    }


    decrementLeafCount( nodeid, leaftype, decamount ) {

        let headers = new Headers();

        headers.append('Authorization', 'Token ' + JSON.parse( localStorage.getItem("sessionobject") ).token);

        headers.append("Content-Type", "application/json");

        return this.http.post(this.SERVER_ENVIRONMENT + "tab/decrement-leaf-count",
                        JSON.stringify({
                            nodeid            : nodeid,
                            leaftype          : leaftype,
                            decamount         : decamount
                       }),
                       {headers: headers})
                   .map(res => res.json());
    }


    updateTabObj( tabid, tabobj ) {

        let headers = new Headers();

        headers.append('Authorization', 'Token ' + JSON.parse( localStorage.getItem("sessionobject") ).token);

        headers.append("Content-Type", "application/json");

        return this.http.post(this.SERVER_ENVIRONMENT + "tab/update",
                        JSON.stringify({
                            tabid             : tabid,
                            tabobj            : tabobj
                       }),
                       {headers: headers})
                   .map(res => res.json());
    }


    updateCurrentTab( tabid, index, tabname ) {

        let headers = new Headers();

        headers.append('Authorization', 'Token ' + JSON.parse( localStorage.getItem("sessionobject") ).token);

        headers.append("Content-Type", "application/json");

        return this.http.post(this.SERVER_ENVIRONMENT + "tab/update-current-tab",
                        JSON.stringify({
                            tabid             : tabid,
                            index             : index,
                            tabname           : tabname
                       }),
                       {headers: headers})
                   .map(res => res.json());
    }


    updateCurrentDate( tabid, index, utcdate ) {

        let headers = new Headers();

        headers.append('Authorization', 'Token ' + JSON.parse( localStorage.getItem("sessionobject") ).token);

        headers.append("Content-Type", "application/json");

        return this.http.post(this.SERVER_ENVIRONMENT + "tab/update-current-date",
                        JSON.stringify({
                            tabid             : tabid,
                            index             : index,
                            utcdate           : utcdate
                       }),
                       {headers: headers})
                   .map(res => res.json());
    }


    login( username, password, argarray, inheritpayload ) {

        let headers = new Headers();

        headers.append("Content-Type", "application/json");

        return this.http.post(this.SERVER_ENVIRONMENT + "login",
                        JSON.stringify({
                            userid              : username, 
                            password            : password,
                            argarray            : argarray,
                            inheritpayload      : inheritpayload
                       }),
                       {headers: headers})
                   .map(res => res.json());
    }


    logout( token, argarray ) { 

        let headers = new Headers();

        headers.append('Authorization', 'Token ' + JSON.parse( localStorage.getItem("sessionobject") ).token);

        headers.append("Content-Type", "application/json");

        return this.http.post(this.SERVER_ENVIRONMENT + "logout",
                        JSON.stringify({
                            token : token,
                            argarray : argarray
                       }),
                       {headers: headers})
                   .map(res => res.json());
    }


    register( userobj, instanceobj ) { 

        let headers = new Headers();

        headers.append("Content-Type", "application/json");

        return this.http.post(this.SERVER_ENVIRONMENT + "user",
                        JSON.stringify({
                            userobject      : {
                                userid      : userobj.userid, 
                                password    : userobj.password, 
                                level       : "user", 
                                email       : userobj.email 
                            },
                            instanceobject  : {
                                nodes       : instanceobj.nodes,
                                tabs        : instanceobj.tabs
                            }
                       }),
                       {headers: headers})
                   .map(res => res.json());
    }
}
