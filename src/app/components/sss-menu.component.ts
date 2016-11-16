import { Component, 
         EventEmitter,
         ComponentRef,
         ComponentFactoryResolver, 
         ViewChild, 
         ViewContainerRef }         from "@angular/core";

import { Observable }               from "rxjs/Observable";

import { SSSConfigService } 		from "./../services/sss-config.service";

import { SSSNodeComponent }         from './sss-node.component';
import { SSSLinkComponent }         from './sss-link.component';


@Component({
    selector: "menu_template",
    template: `
            <div class="link-placeholder" #linktarget></div>

            <div class="menu_template"
                 style="cursor:pointer;
                        text-align:center;
                        background-size: cover;
                        border-radius: 20px;
                        border: 8px solid;
                        overflow:hidden;
                        position:relative;
                        box-sizing: border-box;
                        height: calc(100% - 23px);"
                 [ngStyle]="{'color': parentnodeobject.color,
                             'border-color': parentnodeobject.color,
                             'background': 'url(' + parentnodeobject.background + ') no-repeat center center'
                         }">

                <button (click)="handleScheduleButton();"
                        [ngStyle]="{'color': parentnodeobject.color}"
                        style="margin-top: 25px;
                               width: 80%;
                               font-size:14px;
                               cursor:pointer;"
                        *ngIf="parentnodeobject.type != 'stub'">
                        Schedule</button>
                <button (click)="handleAddToFolderButton();"
                        [ngStyle]="{'color': parentnodeobject.color}"
                        style="margin-top: 8px;
                               width: 80%;
                               font-size:14px;
                               cursor:pointer;"
                        *ngIf="parentnodeobject.type != 'stub'">Add to Folder</button>
                <button (click)="tabchanger.emit( 'privacy' )"
                        [ngStyle]="{'color': parentnodeobject.color}"
                        style="margin-top: 8px;
                               width: 80%;
                               font-size:14px;
                               cursor:pointer;"
                        *ngIf="parentnodeobject.type != 'stub'">Privacy</button>
                <button (click)="tabchanger.emit( 'tags' )"
                        [ngStyle]="{'color': parentnodeobject.color}"
                        style="margin-top: 8px;
                               width: 80%;
                               font-size:14px;
                               cursor:pointer;">Tags</button>
                <button (click)="tabchanger.emit( 'edit' )"
                        style="margin-top: 8px;
                               width: 80%;
                               font-size:14px;
                               cursor:pointer;"
                        [ngStyle]="{'color': parentnodeobject.color}">Edit</button>
                <button (click)="noderesetter.emit( 'reset' )"
                        style="margin-top: 8px;
                               width: 80%;
                               font-size:14px;
                               cursor:pointer;"
                        [ngStyle]="{'color': parentnodeobject.color}">Reset</button>


                <!-- <div style="display:block;
                            opacity:.5;
                            position:absolute;
                            height:100%;
                            width:100%;"
                    [ngStyle]="{'background-color': parentnodeobject.color}">
                </div> -->
            </div>
    `
})
 
export class SSSMenuComponent {

    @ViewChild('linktarget', {read: ViewContainerRef}) linktarget : ViewContainerRef;

    // @Input's
    public parentnodeobject              : any;
    public matryoshkanodeobject          : any;
    public matryoshkanodeindex           : String;
    public pointerobject                 : any;

    // @Output's
    tabchanger                           = new EventEmitter();
    noderesetter                         = new EventEmitter();
    nodeintroducer                       = new EventEmitter();
    favoritemarker                       = new EventEmitter();

    cmpRef                               : ComponentRef<any>;


    constructor( public  configService              : SSSConfigService,
                 private componentFactoryResolver   : ComponentFactoryResolver ) {

    };


    ngAfterContentInit() { 

        this.instantiateLinkTemplate();
    }


    instantiateLinkTemplate( ) {

        if( this.cmpRef ) { this.cmpRef.destroy(); }

        let factory = this.componentFactoryResolver.resolveComponentFactory( SSSLinkComponent ); 

        this.cmpRef = this.linktarget.createComponent( factory, 0, this.linktarget.injector );

        this.cmpRef.instance.parentnodeobject      = this.parentnodeobject;
        this.cmpRef.instance.parentpointerobject   = this.pointerobject;
        this.cmpRef.instance.displaytabdestination = "headline";
        this.cmpRef.instance.calltoactionbuttons   = "absent";
        this.cmpRef.instance.leftcta               = "none";
        this.cmpRef.instance.rightcta              = "none";

        let _self = this;

        this.cmpRef.instance.tabchanger.subscribe(($event)      => { _self.tabchanger.emit($event) });

        this.cmpRef.instance.nodeintroducer.subscribe(($event)  => {  _self.nodeintroducer.emit($event) });

        this.cmpRef.instance.favoritemarker.subscribe(($event)  => {  _self.favoritemarker.emit($event) });
    }


    handleScheduleButton() {

        this.configService.setGlobalHoverState( 'calendar' );

        this.tabchanger.emit( 'calendar' );
    }


    handleAddToFolderButton() {

        this.configService.setGlobalHoverState( 'destinations' );

        this.tabchanger.emit( 'destinations' );
    }
}