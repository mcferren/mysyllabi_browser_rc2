import { Component, 
         enableProdMode,
         EventEmitter,
         ComponentRef,
         ComponentFactoryResolver,
         ViewChild, 
         ViewContainerRef } from '@angular/core';


import { SSSConfigService }    from './../services/sss-config.service';
import { SSSNodeService }      from './../services/sss-node.service';
import { SSSTabService }       from './../services/sss-tab.service';
import { SSSAccountService }   from './../services/sss-account.service';

import { SSSNodeComponent }    from './sss-node.component';

@Component({
  selector: 'sss-application',
  template: `
            <div class="center"
                 style="position: absolute;
                        z-index: 10;">
                <img src='http://seasidesyndication.com/mysyllabi_logo.png'
                     style="height:20px;
                            cursor:pointer;"
                     (click)="handleClick()">
            </div> 

        	<div class="application_template" #nodetarget></div>
        `
})

export class SSSAppComponent {

    applicationinventory                            : Array<any>;
    hostname                                        : String;
    previousURLargs                                 : Array<any>;

    @ViewChild('nodetarget', {read: ViewContainerRef}) nodetarget : ViewContainerRef;

    constructor( public  configService              : SSSConfigService,
                 public  nodeService                : SSSNodeService,
                 public  tabService                 : SSSTabService,
                 public  accountService             : SSSAccountService,
                 private componentFactoryResolver   : ComponentFactoryResolver ) {

        this.hostname                               = location.href.split('/')[2];
        this.previousURLargs                        = location.href.split('/').splice(4);
    }

    ngAfterContentInit() { 

        let _self = this;
        
        // MAYBE AN IF CONDITION HERE TO CHECK LOCAL STORAGE 
        // OR SOME INDICATOR THAT A RENDER HAS ALREADY OCCURRED?

        console.log("this.previousURLargs", this.previousURLargs);
        this.configService.launchApplication( this.hostname, this.previousURLargs ).subscribe(args => { 

            let factory = this.componentFactoryResolver.resolveComponentFactory( SSSNodeComponent ),
                cmpRef  = this.nodetarget.createComponent( factory, 0, this.nodetarget.injector );

                cmpRef.instance.pointerobj = {

                    "_id"           : _self.configService.getApplicationNodeID(), 
                    "instance"      : "master",
                    "isFavorite"    : false, 
                    "currenttab"    : "all", 
                    "currentdate"   : null
                };
        });
    }


    handleClick() { this.configService.flushLocalStorage(); };
}
