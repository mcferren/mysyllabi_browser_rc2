import { Component, 
		 Input, 
		 Output,
         EventEmitter } 			from "@angular/core";

import { Observable } 				from "rxjs/Observable";

import { SSSAccountService } 		from "./../services/sss-account.service";
import { SSSConfigService } 		from "./../services/sss-config.service";
import { SSSNodeService } 			from "./../services/sss-node.service";
import { SSSTabService } 			from "./../services/sss-tab.service";

@Component({
    selector: 'sss-account',
    template: `
        <ul class="sortLinks"
            [ngStyle]="{'background-color': matryoshkanodecolor}">
        </ul>

        <div class="nodeBody editEnclosure superNodeBody"> 
            <span class="deletenode"
                  *ngIf="tabinformation.heightstate != 'collapsed'"
                  [ngStyle]="{'background-color': matryoshkanodecolor,
                              'display': 'block',
                              'width': '40px',
                              'height': '40px',
                              'border-radius': '6px',
                              'cursor': 'pointer',
                              'color': 'white',
                              'line-height': '40px',
                              'text-align': 'center'}"
                  (click)="nodezapper.emit( 'delete' )">X
            </span>

            <div *ngIf="loggedIn !== true;">
                <h1>LOGIN</h1>
                <form id="login">

                    <div>
                        <input id="username"
                               type="text" 
                               placeholder="username"
                               [(ngModel)]="loginform.username">
                    </div>

                    <div>
                        <input id="password"
                               type="password" 
                               placeholder="password"
                               [(ngModel)]="loginform.password">
                    </div>

                    <span>
                        <input type="submit" 
                               (click)="fulfillLogin(loginform.username, loginform.password)"
                               class="btn btn-success"
                               value="LOGIN"  >
                    </span>
                </form>

                <h1>REGISTRATION</h1>
                <form id="register">

                    <div>
                        <input id="username"
                               type="text" 
                               placeholder="username"
                               [(ngModel)]="registerform.username">
                    </div>
                    <div>
                        <input id="email"
                               type="email" 
                               placeholder="email"
                               [(ngModel)]="registerform.email">
                    </div>
                    <div>
                        <input id="password"
                               type="password" 
                               placeholder="password"
                               [(ngModel)]="registerform.password">
                    </div>
                    <div>
                        <input id="confirmpassword"
                               type="password" 
                               placeholder="confirm">
                    </div>


                    <span>
                        <input type="submit" 
                               class="btn btn-success"
                               (click)="fulfillRegistration(registerform.username, registerform.email, registerform.password)"
                               value="REGISTER" >
                    </span>

                </form>
            </div>
            
            
            <div *ngIf="loggedIn === true;">
                <h1>ACCOUNT DETAILS</h1>
                <form id="register">

                    <div>
                        <input id="username"
                               type="text" 
                               placeholder="username"
                               [(ngModel)]="userobject._id">
                    </div>
                    <div>
                        <input id="email"
                               type="email" 
                               placeholder="email"
                               [(ngModel)]="userobject.email">
                    </div>
                    <div>
                        <input id="role"
                               type="text" 
                               placeholder="role"
                               [(ngModel)]="userobject.level"
                               disabled>
                    </div>

                    <span>
                        <input type="submit" 
                               class="btn btn-success"
                               (click)="fulfillRegistration(registerform.username, registerform.email, registerform.password)"
                               value="CONFIRM" >
                    </span>

                </form>

                <hr>

                <h1>CHANGE PASSWORD</h1>
                <form id="register">
                    <div>
                        <input id="password"
                               type="password" 
                               placeholder="password"
                               [(ngModel)]="registerform.password">
                    </div>
                    <div>
                        <input id="confirmpassword"
                               type="password" 
                               placeholder="confirm">
                    </div>
                    <span>
                        <input type="submit" 
                               class="btn btn-success"
                               (click)="fulfillRegistration(registerform.username, registerform.email, registerform.password)"
                               value="SUBMIT" >
                    </span>

                </form>
                <button style="{display:inline-block}" (click)="fulfillLogout()">Logout</button>
            </div>
        </div>
    `
})
export class SSSAccountComponent {

    tabinformation                      : any;
    loginform                           : any;
    registerform                        : any;
    userobject                          : any;
    loggedIn                            : Boolean;

    // @Input's
    public matryoshkanodeindex          : String;
    public matryoshkanodecolor          : String;
    
    // @Output's
    nodezapper       				    = new EventEmitter();


    constructor( public configService    : SSSConfigService,
                 public nodeService      : SSSNodeService,
                 public tabService       : SSSTabService,
                 public accountService   : SSSAccountService) {

        this.tabinformation     		= {};
        this.loginform          		= {};
        this.registerform       		= {};
        this.userobject         		= {};
        this.loggedIn           		= false;

        // this.sidebarState         = this.configService.getSidebarState();

        // this.scope.$on('sidebar-state-updated', function() { 
        //     _self.scope.sidebarState = _self.configservice.getSidebarState(); 
        // });

        accountService._emitterAuthenticationStatusUpdated.subscribe(args => {

            this.loggedIn = accountService.getAuthenticationStatus();

            if( this.loggedIn ) {
                // _self.scope.templateurl = '/views/partials/tabSlides/myaccount-tab.html';
                this.userobject = accountService.getUserObject(); 
            } else {
                // _self.scope.templateurl = '/views/partials/tabSlides/authenticate-tab.html';
            } 
        });
    };


    ngAfterContentInit() { 

        let _self = this;

        // this.tabService.memoizeTab( "myaccount", null )
        //     .subscribe(args => {

        //     console.log("WELLWIND", _self.accountService.getAuthenticationStatus());

                _self.loggedIn = _self.accountService.getAuthenticationStatus();

                if( _self.loggedIn ) {
                    // _self.scope.templateurl = '/views/partials/tabSlides/myaccount-tab.html';
                    _self.userobject = _self.accountService.getUserObject(); 
                } else {
                    // _self.scope.templateurl = '/views/partials/tabSlides/authenticate-tab.html';
                } 

            //     _self.tabinformation.heightstate       = args.heightstate;
            //     _self.tabinformation.percentageheight  = args.percentageheight;
            // })
    }


    fulfillLogin( username, password ) {

        this.accountService.login( username, password )
            .subscribe(args => { console.log('HURRAY', args); });
    }


    fulfillLogout() {

        this.accountService.logout()
            .subscribe(args => { console.log('BUZZA', args); });
    }


    fulfillRegistration( username, email, password ) {
        
        let userobj = {
            "userid"    : username, 
            "email"     : email, 
            "level"     : "user", 
            "password"  : password
        };

        console.log("## username", username);
        console.log("## email", email);
        console.log("## password", password);
        console.log("## userobj", userobj);

        this.accountService.register( userobj )
            .subscribe(args => { console.log('BUZZA', args); });
    }


    toggleHeight() {

        let heightvalue = this.configService.toggleHeight( this.tabinformation.heightstate, 
                                                           this.tabinformation.percentageheight );

        this.tabinformation.heightstate       = heightvalue[ 0 ];
        this.tabinformation.percentageheight  = heightvalue[ 1 ];
    }


    showMore() {

        let heightvalue = this.configService.showMoreCalulate( this.tabinformation.heightstate, 
                                                               this.tabinformation.percentageheight );

        this.tabinformation.heightstate       = heightvalue[ 0 ];
        this.tabinformation.percentageheight  = heightvalue[ 1 ];
    }

}
