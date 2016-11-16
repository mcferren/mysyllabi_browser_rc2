import { Component, 
         EventEmitter,
         ComponentRef, 
         ComponentFactoryResolver,
         ViewChild, 
         ViewContainerRef }         from "@angular/core";

import { Observable }               from "rxjs/Observable";
import "rxjs/Rx";

import { SSSConfigService }         from "./../services/sss-config.service";
import { SSSAccountService }        from "./../services/sss-account.service";
import { SSSNodeService } 			from "./../services/sss-node.service";
import { SSSTabService } 			from "./../services/sss-tab.service";
import { SSSCalendarService } 	    from "./../services/sss-calendar.service";

import { SSSListComponent }         from './sss-list.component';

@Component({
    selector: 'sss-card',
    template: `
        <!-- *ngIf="tabinformation.heightstate != 'collapsed'" DELETED FOR MIGRATION -->
        <span class="deletenode"
              [ngStyle]="{'background-color': parentnodeobject.color}"
               style="display: block;
                      width: 40px;
                      height: 40px;
                      border-radius: 6px;
                      cursor: pointer;
                      color: white;
                      line-height: 40px;
                      text-align: center;
                      position: absolute;
                      top: 33px;
                      z-index: 1;
                      border: 2px solid white;"
              (click)="nodezapper.emit( $event )">X
        </span>


        <div class="nodeHeader"
             style="height: 32px;
                    overflow: hidden;
                    margin-right: -1px;">
            <h1 [ngStyle]="{'color': parentnodeobject.color}"
                 style="overflow: hidden;
                        text-overflow: ellipsis;
                        float: left;
                        font-size: 20px;
                        margin: 2px 0 3px;
                        color: orange;">{{parentnodeobject.name}}
            </h1>   
            <ul>       
                <li *ngFor="let tabHeader of tabset"
                     style="list-style:none;
                            font-size:11px;
                            float:right"
                    [ngStyle]="{'border-color': parentnodeobject.color}"> 
                <!-- | filterTabsByGrade:parentnodeobject.filtration -->
                    
                    <span *ngIf="pointerobject.currenttab === tabHeader.name && 
                                 tabset.length > 1 &&
                                 tabHeader.visible"
                          [ngClass]="{'active':pointerobject.currenttab === tabHeader.name}"
                          [ngStyle]="{'background-color': parentnodeobject.color,
                                      'border-color': parentnodeobject.color}"
                          (click)="tabchanger.emit(tabHeader.name)"
                          style="cursor:pointer;
                                 margin:0 1px;
                                 text-align:center;
                                 padding:0 4px;
                                 border:1px solid;
                                 border-bottom:0px solid transparent;
                                 border-top-left-radius:6px;
                                 border-top-right-radius:6px;
                                 border-color:#ccc;
                                 display: block;
                                 color:white">{{tabHeader.name}}</span>
                                           
                    <!-- MORE THAN ONE SO THAT IF IT DOESNT SHOW TABS ON HOMEPAGE PROMO NODE -->                     
                    <span *ngIf="pointerobject.currenttab != tabHeader.name && 
                                 tabset.length > 1 &&
                                 tabHeader.visible"
                          (click)="tabchanger.emit(tabHeader.name)"
                          style="cursor:pointer;
                                 margin:0 1px;
                                 text-align:center;
                                 padding:0 4px;
                                 border:1px solid;
                                 border-bottom:0px solid transparent;
                                 border-top-left-radius:6px;
                                 border-top-right-radius:6px;
                                 border-color:#ccc;
                                 display: block;"
                          [ngStyle]="{'color': parentnodeobject.color}">{{tabHeader.label}}</span>
                </li>
            </ul>
        </div>
        <p style="clear: both;
                  margin: 0;"></p>
        <!--  | filterTabsByGrade:parentnodeobject.filtration -->

        <div class="list_template" #listtarget></div>
    `
})
export class SSSCardComponent {

    listCmpRef                               			: ComponentRef<any>;

    @ViewChild('listtarget',    {read: ViewContainerRef}) listtarget : ViewContainerRef;
    
    // @Input's
    public templateobject                 				: any;
    public parentnodeobject               				: any;
    public matryoshkanodeindex            				: String;
    public matryoshkanodeobject              		    : any;
    public pointerobject                  				: any;
    public tabset                                       : Array<any>;

    // @Output's
    tabchanger                                          = new EventEmitter();
    nodepersister                                       = new EventEmitter();
    nodeeditor                                          = new EventEmitter();
    nodezapper                                          = new EventEmitter();
    modalprompter                                       = new EventEmitter();

    constructor( public  configService              	: SSSConfigService,
                 public  nodeService                    : SSSNodeService,
                 public  accountService                 : SSSAccountService,
                 public  tabService                 	: SSSTabService,
                 private componentFactoryResolver   	: ComponentFactoryResolver ) {

    }


    ngAfterContentInit() { 

    	this.instantiateList();
    }


    instantiateList() {

        let factory 	 = this.componentFactoryResolver.resolveComponentFactory( SSSListComponent ),

            tabid        = this.tabService.fetchTabid( this.pointerobject._id, 
                                                       this.pointerobject.currenttab === "day" ? this.pointerobject.currentdate: "ALLRESOURCES",
                                                       this.pointerobject.instance,
                                                       this.accountService.getUserObject()._id );
            
        this.listCmpRef  = this.listtarget.createComponent( factory, 0, this.listtarget.injector );

        this.listCmpRef.instance.parentnodeobject       = this.parentnodeobject;
        this.listCmpRef.instance.pointerobject          = this.pointerobject;
        this.listCmpRef.instance.templateobject         = this.templateobject;
        this.listCmpRef.instance.matryoshkanodeindex    = this.matryoshkanodeindex;
        this.listCmpRef.instance.matryoshkanodeobject   = this.matryoshkanodeobject;
        this.listCmpRef.instance.tabid                  = tabid;

        let _self = this;

        this.listCmpRef.instance.nodepersister.subscribe(($event) => { _self.nodepersister.emit( $event ); });
        this.listCmpRef.instance.nodeeditor.subscribe(($event)    => { _self.nodeeditor.emit( $event ); });
        this.listCmpRef.instance.nodezapper.subscribe(($event)    => { _self.nodezapper.emit( $event ); });
        this.listCmpRef.instance.modalprompter.subscribe(($event) => { _self.modalprompter.emit( $event ); });

        this.listCmpRef.location.nativeElement.style.display                    = "block";
        this.listCmpRef.location.nativeElement.style.border                     = "4px solid " + this.parentnodeobject.color;
        this.listCmpRef.location.nativeElement.style.overflow                   = "hidden";
        this.listCmpRef.location.nativeElement.style.borderBottomLeftRadius     = "10px";
        this.listCmpRef.location.nativeElement.style.borderBottomRightRadius    = "10px";
        this.listCmpRef.location.nativeElement.style.height                     = "calc(100% - 32px)";
        this.listCmpRef.location.nativeElement.style.width                      = "100%";
        this.listCmpRef.location.nativeElement.style.boxSizing                  = "border-box";
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
