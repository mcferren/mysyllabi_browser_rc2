import { Component, 
         EventEmitter,
         ComponentRef, 
         ComponentFactoryResolver,
         ViewChild, 
         ViewContainerRef }         from "@angular/core";

import { Observable }               from "rxjs/Observable";
import "rxjs/Rx";

import { SSSConfigService } 		from "./../services/sss-config.service";
import { SSSAccountService }        from "./../services/sss-account.service";
import { SSSNodeService } 			from "./../services/sss-node.service";
import { SSSTabService } 			from "./../services/sss-tab.service";
import { SSSCalendarService } 	    from "./../services/sss-calendar.service";

import { SSSListComponent }         from './sss-list.component';

@Component({
    selector: 'sss-column',
    template: `
        <a class="logo" 
          *ngIf="parentnodeobject.type === 'topcategories'"
           href="#/language-arts/language-arts-resources">
            <span style="color:red;">m</span><span style="color:blue;">y</span><span style="color:rgb(240, 216, 92);">s</span><span style="color:green;">y</span><span style="color:purple;">l</span><span style="color:orange;">l</span><span style="color:blue;">a</span><span style="color:red;">b</span><span style="color:green;">i</span>
        </a>

        <form class="search">

            <input id="sidebarAutoComplete" 
                   class="autoComplete"
                   type="text" 
                   placeholder="Search in All Classrooms">
                   <!-- [(ngModel)]="taxonomySearchForm.name"> -->

            <button (click)="addNewChildNode(taxonomySearchForm.name)"
                    class="btn btn-mini autoCompletePlaciboButtonTop">
                 <i class="icon-heart"></i>
            </button>
        </form>

        <div class="list_template" #listtarget></div>

        <form class="contribution">

            <input id="nodeAutoCompleteBottom" 
                   class="autoComplete"
                   type="text" 
                   placeholder="Create a Classroom Calendar"  >
                   <!-- [(ngModel)]="taxonomyCreateForm.name"> -->

            <button (click)="addNewChildNode(taxonomyCreateForm.name)"
                    class="btn btn-mini autoCompletePlaciboButtonBottom">
                 <i class="icon-plus"></i>
            </button>
        </form>
    `
})
export class SSSColumnComponent {

    listCmpRef                               			: ComponentRef<any>;

    @ViewChild('listtarget',    {read: ViewContainerRef}) listtarget : ViewContainerRef;
    
    // @Input's
    public templateobject                 				: any;
    public parentnodeobject               				: any;
    public matryoshkanodeindex            				: String;
    public matryoshkanodeobject           				: any;
    public pointerobject                  				: any;
    public tabset                                       : Array<any>;

    // @Output's
    tabchanger                                          = new EventEmitter();
    nodepersister                                       = new EventEmitter();
    nodeeditor                                          = new EventEmitter();
    nodezapper                                          = new EventEmitter();
    modalprompter                                       = new EventEmitter();

    constructor( public  configService              	: SSSConfigService,
                 public  accountService                 : SSSAccountService,
                 public  nodeService                	: SSSNodeService,
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

        this.listCmpRef.location.nativeElement.style.overflowX    = "hidden";
        this.listCmpRef.location.nativeElement.style.overflowY    = "scroll";
        this.listCmpRef.location.nativeElement.style.bottom       = "40px";
        this.listCmpRef.location.nativeElement.style.height       = "92.5%";
        this.listCmpRef.location.nativeElement.style.display      = "block";
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
