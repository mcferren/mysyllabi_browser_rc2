import { Component, 
         EventEmitter,
         ComponentRef, 
         ComponentFactoryResolver,
         ViewChild, 
         ViewContainerRef }         from "@angular/core";

import { Observable }               from "rxjs/Observable";
import "rxjs/Rx";

import { SSSAccountService }        from "./../services/sss-account.service";
import { SSSConfigService } 		from "./../services/sss-config.service";
import { SSSNodeService } 			from "./../services/sss-node.service";
import { SSSTabService } 			from "./../services/sss-tab.service";
import { SSSCalendarService } 	    from "./../services/sss-calendar.service";

import { SSSListComponent }         from './sss-list.component';

@Component({
    selector: 'sss-grid',
    template: `
        <div class="tags_template"
             style="cursor:pointer;
                    text-align:center;
                    background-size: cover;
                    border-radius: 20px;
                    border: 8px solid;
                    position: relative;
                    overflow:hidden;
                    box-sizing: border-box;
                    height: calc(100% - 23px);
                    margin-top:23px;"
             [ngStyle]="{'color': parentnodeobject.color,
                         'border-color': parentnodeobject.color,
                         'background': 'url(' + parentnodeobject.background + ') no-repeat center center'
                     }">

            <span class="topbanner"
                  style="display:block;
                         color: white;
                         padding-bottom: 5px;
                         width: 100%;"
                 [ngStyle]="{'background-color': parentnodeobject.color}">

                  <em style="font-style:normal;">&nbsp;</em>
                  <em style="font-style:normal;">Tag by Grade</em>
                  <em style="font-style:normal;">&nbsp;</em>
            </span>
            
            <span>
                <div class="grid_template" #listtarget></div>
            </span>

            <p style="clear: both;"></p>

            <button (click)="handleConfirmButton();"
                    [ngStyle]="{'color': parentnodeobject.color}"
                     style="display:block;
                            width:100px;
                            margin: 0 auto;">Confirm</button>

            <span class="bottombanner"
                  [ngStyle]="{'background-color':  parentnodeobject.color}"
                   style="display:block;
                          color: white;
                          position: absolute;
                          bottom: 0px;
                          width: 100%;
                         padding-top: 5px;">
                  <em style="font-style:normal;">&nbsp;</em>
                  <em style="font-style:normal;">do this later</em>
                  <em style="font-style:normal;">&nbsp;</em>
            </span>
        </div>
    `
})
export class SSSGridComponent {

    listCmpRef                               			: ComponentRef<any>;

    @ViewChild('listtarget', {read: ViewContainerRef}) listtarget : ViewContainerRef;
    
    // Input's
    public templateobject                 				: any;
    public parentnodeobject               				: any;
    public matryoshkanodeindex            				: String;
    public matryoshkanodeobject           				: any;
    public pointerobject                  				: any;

    // Output's
    nodepersister                                       = new EventEmitter();
    nodeeditor                                          = new EventEmitter();
    nodezapper                                          = new EventEmitter();
    modalprompter                                       = new EventEmitter();

    constructor( public  configService              	: SSSConfigService,
                 public  accountService               : SSSAccountService,
                 public  nodeService                	: SSSNodeService,
                 public  tabService                 	: SSSTabService,
                 private componentFactoryResolver   	: ComponentFactoryResolver ) {

    }


    ngAfterContentInit() { 

    	this.instantiateList();
    }


    instantiateList() {

        let factory 	   = this.componentFactoryResolver.resolveComponentFactory( SSSListComponent ),

            tabid        = this.tabService.fetchTabid( this.configService.getTagsNodeID(), 
                                                      "ALLRESOURCES", 
                                                      "master",
                                                       this.accountService.getUserObject()._id);
            // BE SURE THAT EACH POINTER IN tagsnodeid HAS A AUXTAB THAT SUPPORTS COIN TEMPLATE
            
        this.listCmpRef  = this.listtarget.createComponent( factory, 0, this.listtarget.injector );

        this.listCmpRef.instance.parentnodeobject       = this.parentnodeobject;
        this.listCmpRef.instance.pointerobject          = {};
        this.listCmpRef.instance.templateobject         = this.templateobject;
        this.listCmpRef.instance.matryoshkanodeindex    = this.matryoshkanodeindex;
        this.listCmpRef.instance.matryoshkanodeobject   = this.matryoshkanodeobject;
        this.listCmpRef.instance.tabid                  = tabid;

        let _self = this;

        this.listCmpRef.instance.nodepersister.subscribe(($event) => { _self.nodepersister.emit( $event ); });
        this.listCmpRef.instance.nodeeditor.subscribe(($event)    => { _self.nodeeditor.emit( $event ); });
        this.listCmpRef.instance.nodezapper.subscribe(($event)    => { _self.nodezapper.emit( $event ); });
        this.listCmpRef.instance.modalprompter.subscribe(($event) => { _self.modalprompter.emit( $event ); });
    }

    handleConfirmButton() { 

        if( this.parentnodeobject.type === 'vacant' ||        // CREATING A NEW NODE
            this.parentnodeobject.type === 'stub'   ||
            ( this.pointerobject.localinputobj.url     === '' && this.parentnodeobject.type === 'poster') ) { 
            // THIS IS A POSTER WHEN WE REMOVE A URL FROM componentlocalinputobjobject 
        
            this.nodepersister.emit( "persistme" );
        }

        if( this.parentnodeobject.type !== 'vacant' ) {       // EDITING AN EXISITNG NODE

            this.nodeeditor.emit( "editme" );
        }
    }


    replaceChildCmpRefByIndex( replacementobj ) {

        let _self = this;

        return Observable.create((observer) => {
        
            this.listCmpRef.instance.replaceChildCmpRefByIndex( replacementobj ).subscribe(args => {});

            observer.next( true ); observer.complete();
        });
    }


    addToChildCmpRef( additionpointerid ) {

        let _self = this;

        return Observable.create((observer) => {
        
            this.listCmpRef.instance.addToChildCmpRef( additionpointerid ).subscribe(args => {});

            observer.next( true ); observer.complete();
        });
    }
}
