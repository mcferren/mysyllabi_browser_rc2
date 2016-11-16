import { Component, 
         EventEmitter,
         ComponentRef,
         ComponentFactoryResolver, 
         ViewChild, 
         ViewContainerRef }         from "@angular/core";

import { Observable }               from "rxjs/Observable";

import * as _                       from "underscore";
import * as THREE                   from 'three';

import { SSSAccountService }        from "./../services/sss-account.service";
import { SSSCategoryService } 		from "./../services/sss-category.service";
import { SSSConfigService } 		from "./../services/sss-config.service";
import { SSSNodeService } 			from "./../services/sss-node.service";
import { SSSTabService } 			from "./../services/sss-tab.service";

import { SSSNodeComponent }         from './sss-node.component';
import { SSSLinkComponent }         from './sss-link.component';

@Component({
    selector: 'sss-relay',
    template: `
        <span class="menuprompt"
               style="display: block;
                      width: 30px;
                      height: 30px;
                      border-radius: 50%;
                      cursor: pointer;
                      color: white;
                      line-height: 36px;
                      text-align: center;
                      position: absolute;   
                      z-index: 1;
                      border: 3px solid white;"
              [ngStyle]="{'background-color': relaycolor}"
              (click)="tabchanger.emit( 'menu' )">?
        </span>

        <div class="link-placeholder" #linktarget></div>

        <div class="relay_template"
             style="cursor:pointer;
                    background-size: cover;
                    display:block;
                    border-radius: 20px;
                    border: 8px solid;
                    overflow: hidden;
                    box-sizing: border-box;
                    height: calc(100% - 23px);"
            [ngStyle]="{'color': relaycolor,
                        'border-color': relaycolor}">


                <span class="topbanner"
                      style="display:block;
                             color: white;
                             padding-bottom: 5px;
                             width: 100%;"
                     [ngStyle]="{'background-color': relaycolor}">

                      <em style="font-style:normal;"
                         (click)="localGoToPreviousCategory()">&#10094;</em>
                      <em style="font-style: normal;
                                 margin: 0 10px;
                                 text-align: center;
                                 width: 188px;
                                 display: inline-block;
                                 text-overflow: ellipsis;">{{relaytitle}}</em>
                      <em style="font-style:normal;"
                         (click)="localGoToNextCategory()">&#10095;</em>
                </span>

                <span class="sss-button-container"
                      style="position: relative;
                             overflow:scroll;
                             display:block;
                             height: 206px;">

                    <div class="button-list" #nodetarget></div>
                </span>

                <span class="bottombanner"
                      [ngStyle]="{'background-color':  relaycolor}"
                       style="display:block;
                              color: white;
                              position: absolute;
                              bottom: 0px;
                              width: 100%;
                              padding-top: 5px;">
                      <em style="font-style:normal;">&#10094;</em>
                      <em style="font-style:normal;
                                 margin: 0 10px;
                                 text-align: center;
                                 width: 150px;
                                 display: inline-block;
                                 text-overflow: ellipsis;">boots</em>
                      <em style="font-style:normal;">&#10095;</em>
                </span>
        </div>
    `
})
export class SSSRelayComponent {

    localinventory                                  : Array<any>;
 
    @ViewChild('nodetarget', {read: ViewContainerRef}) nodetarget : ViewContainerRef;
    @ViewChild('linktarget', {read: ViewContainerRef}) linktarget : ViewContainerRef;

    // @Input's
    public templateobject                 			: any;
    public parentnodeobject               			: any;
    public matryoshkapointerindex         			: String;
    public tabid 				         			: String;
    public relaytitle								: String;
    public relaycolor								: String;
    public pointerobject                  			: any;
    public matryoshkanodetype             			: any;

	// @Output's 
    modalprompter                  					= new EventEmitter();
    tabchanger                                      = new EventEmitter();
    nodeintroducer                                  = new EventEmitter();
    favoritemarker                                  = new EventEmitter();

    linkcmpRef                                      : ComponentRef<any>;

    constructor( public  configService              : SSSConfigService,
                 public  accountService             : SSSAccountService,
                 public  nodeService                : SSSNodeService,
                 public  tabService                 : SSSTabService,
                 public  categoryService            : SSSCategoryService,
                 private componentFactoryResolver   : ComponentFactoryResolver ) {

        this.localinventory                         = [];

        let _self = this;

        tabService._emitterTabInventoryUpdated.subscribe(args => {

            if( args.tabid == _self.tabid ) {

                _self.nodetarget.clear();

                // _self.setTabID();

                _self.updateLocalInventory( args.tabid );
            }
        });

        tabService._emitterTabCurrentDateUpdated.subscribe(args => {

            if( args.tabid == _self.tabid ) {

                _self.pointerobject.currentdate = args.currentdate; // WHY ???
                
                _self.nodetarget.clear();

                // _self.setTabID();

                _self.updateLocalInventory( args.tabid );
            }
        });
    };


    ngAfterContentInit() { 

        // this.setTabID();

        this.updateLocalInventory( this.tabid );

        this.refreshNodeReference();
    }


    setTabID() {

        this.tabid = this.tabService.fetchTabid( this.pointerobject._id, 
                                                "ALLRESOURCES", 
                                                "master",
                                                 this.accountService.getUserObject()._id );
    }


    updateLocalInventory( tabidarg ) {

        let _self = this;

        this.tabService.memoizeTab( this.tabid, this.parentnodeobject.type )
            .subscribe(arg => {

                // // IF THERE IS NO FILTER - - - IE. ALL TAB
                // if( _self.templateobject.refine.length === 0 ) { 

                    _self.localinventory = arg.inventory;

                    _self.rollNodeArray( _self.localinventory );

                    _self.instantiateLinkTemplate();

                // } else {

                //     _self.filterOutput( arg.inventory ).subscribe(subarg => {

                //         _self.localinventory = subarg;

                //         _self.rollNodeArray( _self.localinventory );

                //         _self.instantiateLinkTemplate();
                //      });
                // }

                // if( _self.templateobject.name !== "tags" ) {

                //     _self.rollBlanks( arg.inventory )
                //          .subscribe( args => {

                //             _self.localinventory  = args;

                //             _self.rollNodeArray( _self.localinventory );

                //          });

                // } else {

                //     _self.localinventory = arg.inventory;

                //     _self.rollNodeArray( _self.localinventory );
                // }
            });
    }


    refreshNodeReference() {

        let _self = this;

        this.nodeService.memoizeNode( this.categoryService.getCurrentCategoryID() ).subscribe(args => {

                _self.relaytitle = args.name;
                _self.relaycolor = args.color;
        });
    }



    rollNodeArray( rollingarray ) {

        let _self = this;

        rollingarray.forEach((element, i) => {

            let factory     = _self.componentFactoryResolver.resolveComponentFactory( SSSNodeComponent ),
                cmpRef      = _self.nodetarget.createComponent( factory, 
                                                               _self.nodetarget.length === 0 ? 0 : _self.nodetarget.length, 
                                                               _self.nodetarget.injector );

            cmpRef.instance.pointerindex            = i;
            cmpRef.instance.parenttabid             = _self.tabid;
            cmpRef.instance.parenttemplateobj       = _self.templateobject;
            cmpRef.instance.matryoshkanodeobj       = _self.parentnodeobject; 
            cmpRef.instance.matryoshkapointerobj    = {}; // HACK TO SOLVE layoutbehavior PROBLEM IN NODE COMPONENT 
            cmpRef.instance.pointerobj              = {
                "_id"            : element._id,
                "isFavorite"     : element.isFavorite,
                "isOpen"         : element.isOpen,
                "currenttab"     : "button",
                "currentdate"    : element.currentdate,
                "style"          : {
                    "width"      : "180px", 
                    "height"     : "23px", 
                    "position"   : "relative",
                    "text-align" : "center",
                    "padding"    : "10px"
                }
            };

            cmpRef.instance.modalprompter.subscribe(($event) => { _self.modalprompter.emit($event); });
        });
    }


    instantiateLinkTemplate( ) {

        if( this.linkcmpRef ) { this.linkcmpRef.destroy(); }

        let factory = this.componentFactoryResolver.resolveComponentFactory( SSSLinkComponent ); 

        this.linkcmpRef = this.linktarget.createComponent( factory, 0, this.linktarget.injector );

        this.linkcmpRef.instance.parentnodeobject      = this.parentnodeobject;
        this.linkcmpRef.instance.parentpointerobject   = this.pointerobject;
        this.linkcmpRef.instance.displaytabdestination = "headline";
        this.linkcmpRef.instance.calltoactionbuttons   = "absent";
        this.linkcmpRef.instance.leftcta               = "none";
        this.linkcmpRef.instance.rightcta              = "none";

        let _self = this;

        this.linkcmpRef.instance.tabchanger.subscribe(($event)      => { _self.tabchanger.emit($event) });

        this.linkcmpRef.instance.nodeintroducer.subscribe(($event)  => { _self.nodeintroducer.emit($event) });

        this.linkcmpRef.instance.favoritemarker.subscribe(($event)  => { _self.favoritemarker.emit($event) });
    }


    localGoToPreviousCategory() {

        let _self = this;

        this.categoryService.goToPreviousCategory().subscribe(args => {

            _self.nodetarget.clear();

            _self.setTabID();

            _self.updateLocalInventory( this.tabid );

            _self.refreshNodeReference();
        });
    }

    
    localGoToNextCategory() {

        let _self = this;

        this.categoryService.goToNextCategory().subscribe(args => {

            _self.nodetarget.clear();

            _self.setTabID();

            _self.updateLocalInventory( this.tabid );

            _self.refreshNodeReference();
        });
    }
}
