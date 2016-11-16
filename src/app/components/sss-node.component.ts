import { Component, 
         EventEmitter,
         ComponentRef,
         ComponentFactoryResolver,
         ViewChild, 
         ViewContainerRef,
         ElementRef,
         Renderer }         	    from "@angular/core";

import { Observable }       	    from "rxjs/Rx";

import { SSSAccountService }        from "./../services/sss-account.service";
import { SSSCalendarService }       from "./../services/sss-calendar.service";
import { SSSCategoryService }       from "./../services/sss-category.service";
import { SSSConfigService }         from "./../services/sss-config.service";
import { SSSDOMService }            from "./../services/sss-dom.service";
import { SSSNodeService }           from "./../services/sss-node.service";
import { SSSProxyService }          from "./../services/sss-proxy.service";
import { SSSTabService }            from "./../services/sss-tab.service";

import { SSSAccountComponent }      from './sss-account.component';
import { SSSBasicComponent }        from './sss-basic.component';
import { SSSButtonComponent }       from './sss-button.component';
import { SSSCalendarComponent }     from './sss-calendar.component';
import { SSSCardComponent }         from './sss-card.component';
import { SSSCoinComponent }         from './sss-coin.component';
import { SSSColumnComponent }       from './sss-column.component';
import { SSSEditComponent }         from './sss-edit.component';
import { SSSEggShellComponent }     from './sss-eggshell.component';
import { SSSGridComponent }         from './sss-grid.component';
import { SSSIframeComponent }       from './sss-iframe.component';
import { SSSLinkComponent }         from './sss-link.component';
import { SSSListComponent }         from './sss-list.component';
import { SSSMenuComponent }         from './sss-menu.component';
import { SSSModalComponent }        from './sss-modal.component';
import { SSSRelayComponent }        from './sss-relay.component';
import { SSSTableComponent }        from './sss-table.component';
import { SSSTextAreaComponent }     from './sss-textarea.component';



@Component({
  	selector: 'sss-node',
    template: `<!-- <h1 (click)="blahprompter.emit({'pointerindex':pointerindex,'cmprefindex':cmprefindex})"
                         style="position: absolute;
                                top: 160px;
                                left: 60px;
                                color: white;
                                background: pink;
                                width: 115px;
                                line-height: 100px;
                                border-radius: 50%;
                                font-size: 70px;
                                z-index: 100;
                                border: 10px solid white;
                                cursor: pointer;">
                                {{pointerindex}}</h1>

                <h1 (click)="blahprompter.emit({'pointerindex':pointerindex,'cmprefindex':cmprefindex})"
                     style="position: absolute;
                            top: 160px;
                            right: 0px;
                            color: white;
                            background: HOTPINK;
                            width: 115px;
                            line-height: 100px;
                            border-radius: 50%;
                            font-size: 70px;
                            z-index: 100;
                            border: 10px solid white;
                            cursor: pointer;">
                            {{cmprefindex}}</h1> -->

                <div class="node_template" #tabtarget></div>`
})
export class SSSNodeComponent {

    nodeobject                                      : any;
    favoritesSearchForm                             : Object;
    favoritesCreateForm                             : Object;
    taxonomySearchForm                              : Object;
    taxonomyCreateForm                              : Object;
    previousURLargs                                 : Array<any>;
    parentcmpreflength                              : any;
    cmprefindex                                     : Number;
    originaltagarray                                : Array<any>;

    @ViewChild('tabtarget', {read: ViewContainerRef}) tabtarget : ViewContainerRef;

    // @Inputs
    public pointerindex            			        : String;
    public pointerobj              			        : any;
    public matryoshkapointerobj    			        : any;
    public parenttabid             			        : String;
    public parenttemplateobj       			        : any;
    public matryoshkanodeobj       			        : any;
    public tagset 							        : String;
    public tabset                                   : Array<any>;

    // @Outputs
    deletethisnode          				        = new EventEmitter();
    modalprompter           				        = new EventEmitter();
    blahprompter            				        = new EventEmitter();
    cmppersister                                    = new EventEmitter();
    cmpreplacer                                     = new EventEmitter();

    cmpRef                                          : ComponentRef<any>;

    constructor( public  configService              : SSSConfigService,
                 public  accountService             : SSSAccountService,
                 public  nodeService                : SSSNodeService,
                 public  tabService                 : SSSTabService,
                 public  calendarService            : SSSCalendarService,
                 public  proxyService               : SSSProxyService,
                 public  categoryService            : SSSCategoryService,
                 public  domService                 : SSSDOMService,
                 private componentFactoryResolver   : ComponentFactoryResolver,
                 private elementRef                 : ElementRef, 
                 private renderer                   : Renderer ) {

        this.favoritesSearchForm                    = {};
        this.favoritesCreateForm                    = {};
        this.taxonomySearchForm                     = {};
        this.taxonomyCreateForm                     = {};

        // this.renderer                        = renderer;
        // this.elementRef                      = elementRef;

        this.nodeobject  = {};


        this.previousURLargs                        = []; // CAN"T CENTRALIZE THIS VARIABLE IN CONFIGSERVICE
                                                          // BC THERE ARE MULTIPLE LISTENING EVENTS FOR EACH URL CHANGE
                                                          // AND THE VALUE OF THE VARIABLE WOULD BECOME OFFSYNC THERE

        this.tagset                                 = "mysyllabi_grade-tags_ALLRESOURCES";

        let _self = this;

        configService._emitterInstanceUpdated.subscribe(args => {

            if( args.oldnodeid == _self.pointerobj._id ) { 

                _self.interpetNode( _self.pointerobj._id ).subscribe(args => { });
            }
        });

        // tabService._emitterTabCurrentTabUpdated.subscribe(args => {

        //     if( args.nodeid == _self.pointerobj._id ) {

        //         _self.interpetNode( _self.pointerobj._id );
        //     }
        // });
    };

	// ngAfterViewInit() {
    ngAfterContentInit() {

        this.interpetNode( this.pointerobj._id ).subscribe(args => { });

        this.renderer.setElementAttribute( this.elementRef.nativeElement, 'id', this.pointerobj._id);

        let _self = this;

        // THERE IS NO HASH CHANGE HANDLER FOR TABS THAT DON"T HAVE DATA INSTRUCTIONS TO LISTEN
        if( this.pointerobj.urlnodelistener ) {

            // _self.domService.setListenerInMemoryByKey( _self.pointerobj._id );

        	window.addEventListener("hashchange", (args) => { 

                _self.cmpRef.instance.handleParentHashChangeEvent(); 

            }, false);
        }

        this.drawStyles();
	}


    drawStyles() {

        let _self = this;

        if( this.pointerobj.style ) {

            Object.keys( this.pointerobj.style ).forEach(function(key,index) {

                if( _self.matryoshkapointerobj.layoutbehavior === "row" && 
                    ( key === "width" || key === "height" ) ) {

                } else {
                    
                    _self.renderer.setElementStyle( _self.elementRef.nativeElement, 
                                                     key, 
                                                   _self.pointerobj.style[ key ]);
                }
            });

            switch( _self.matryoshkapointerobj.layoutbehavior ) {

                case "row"      : _self.renderer.setElementStyle( _self.elementRef.nativeElement, "display", "block" ); break;
                case "float"    : _self.renderer.setElementStyle( _self.elementRef.nativeElement, "float", "left" ); break;
                case "free"     : _self.renderer.setElementStyle( _self.elementRef.nativeElement, "display", "block" ); break;
                // default         : debugger;
            }
        }
    }


    interpetNode( nodeid ) {

        let _self = this;

        return Observable.create((observer) => {

            _self.bindListeners();

            _self.updateNodeInformation( nodeid ).subscribe(args => {
            // *** RETURNS args IS THE NEWLY UPDATED/CREATED _self.NODEOBJ


                _self.tabService.rollTabArray( args.auxtabs, args.type ).subscribe(subargs => {
                // *** RETURNS subargs IS AN ARRAY OF TAB TEMPLATE OBJS 


                    // STOCK SETS OF TAB TEMPLATE SO WE DONT HAVE TO 
                    // PERSIST THIS WEIGHT INSIDE OF THE MONGO DATA STORE NOR LOCAL STORAGE
                    _self.tabset = subargs;

                    _self.dispatchTabArrayIntoView();

                    observer.next("node-interpretation-complete");
                    observer.complete();

                    // _self.nodeobject.filtration = {};

                    // if( args..ALLRESOURCES ) {
                    //     _self.tabService.fetchTagReport( _self.nodeid, args.ALLRESOURCES._id, true );
                    // }
                });
            });
        });
    }



    bindListeners() { // LISTEN TO EVENTS IN THE COMPONENT

        let _self = this;

        // consider this: http://stackoverflow.com/questions/36349362/how-to-use-hostlistener

        // TODO
        // if( _self.parenttemplateobj.hovermenu ) { ... }

        // this.renderer.listen( this.elementRef.nativeElement, 'mouseenter', (event) => { 

        //     if( _self.pointerobj.currenttab === "basic") {

        //         _self.pointerobj.localhoverstate = true;

        //         _self.changeTab( _self.configService.getGlobalHoverState() );

        //     } else if( _self.pointerobj.currenttab === "headline" ||
        //                _self.pointerobj.currenttab === "calendar" ) {

        //         _self.pointerobj.localhoverstate = true;
        //     }
        // }

        // this.renderer.listen( this.elementRef.nativeElement, 'mouseleave', (event) => { 

        //     if( ( _self.pointerobj.localhoverstate !== false && _self.pointerobj.currenttab === "basic" ) ||
        //         ( _self.pointerobj.localhoverstate !== false && _self.pointerobj.currenttab === "destinations" ) ||
        //         ( _self.pointerobj.localhoverstate === false && _self.pointerobj.currenttab === "destinations" ) ||
        //         ( _self.nodeobject.type !== 'calendar'       && _self.pointerobj.currenttab === "calendar" ) ) {

        //         _self.pointerobj.localhoverstate = false;

        //         _self.changeTab( "basic" );

        //     } else if ( ( _self.pointerobj.localhoverstate !== false && _self.pointerobj.currenttab === "calendar" ) ||
        //                 ( _self.pointerobj.localhoverstate === false && _self.pointerobj.currenttab === "calendar" ) ) {

        //         _self.pointerobj.localhoverstate = false;

        //         _self.changeTab( "calendar" );

        //     } else if( _self.pointerobj.localhoverstate !== false && _self.pointerobj.currenttab === "headline" ) {

        //         _self.pointerobj.localhoverstate = false;
        //     }
        // }
    }


    updateNodeInformation( nodeid ) {

        let _self = this;

        return Observable.create((observer) => {

            if( !nodeid || nodeid === null ) { // IT IS A TEMP VACANT BC IT DOES NOT HAVE A NODEID

                // DEFAULTS FOR TEMP VACANT
                _self.nodeobject  = {
                    type        : "vacant",                        
                    color       : _self.matryoshkanodeobj.color,
                    auxtabs     : []
                };

                observer.next( _self.nodeobject );
                observer.complete();


            } else { // FALLS THOUGHT BC ITS A PERSISTANT VACANT NODE &&|| ANY OTHER KIND OF NODE 

                _self.nodeService.memoizeNode( nodeid ).subscribe(args => {

                    // _self.nodeobject        = Object.assign({}, arg);
                    _self.nodeobject = args; // THIS ALSO NEEDS TO BE A NEW OBJECT ???

                    _self.originaltagarray  = Object.assign({}, args.tags);

                    switch ( _self.nodeobject.type )
                    {
                        case 'calendar'     :   _self.calendarService.pushCalendarInMemory( _self.nodeobject._id ); 
                                                break;
                        case 'category'     :   if( _self.nodeobject.instantiations.taxonomy ) {
                                                        _self.categoryService.pushCategoryInMemory( _self.nodeobject.instantiations.taxonomy[0] );
                                                }
                                                break;
                    }

                    observer.next( _self.nodeobject );
                    observer.complete();
                });
            }
        });
    }

//     qualifyCurrentTab() {

//         let i = 0;
// if( this.nodeobject._id === "sample-class-empty") { debugger; }
//         for( i = 0; i < this.tabset.length; ++i ) {


// // if ( !this.tabset[i] ) { debugger; }
//             if( this.tabset[i].name == this.pointerobj.currenttab ) {
//                 return this.pointerobj.currenttab;
//             } else {
//                 ++i;
//             }
//         }
//         return this.nodeobject.type === 'calendar' ? "day" : "all";
//     }


    dispatchTabArrayIntoView( ) {

        let _self = this,
             completeflag;
             // workingtabstate = this.qualifyCurrentTab(); // MAKE SURE WE CAN SATISFY STATE OR REVERT TO DEFAULT

        this.tabset.forEach((element) => { // CAN CHANGE THIS TO A FOR LOOP IN THE FUTURE SO WE CAN BREAK OUT WHEN MATCH IS FOUND

            // if( element.name === workingtabstate ) {
            if( element.name === _self.pointerobj.currenttab ) {

                // WE COULD GENERALIZE THE INSTANTIATION FUNCTION WITH A TYPE VARIABLE
                // BUT THE PROBLEM IS THAT EACH TEMPLATE COMPONENT HAS ITS OWN @INPUTS AND @OUTPUTS
                switch ( element.template )
                {
                    case 'menu_template'              : _self.instantiateMenuTemplate( element );                   break;
                    case 'relay_template'             : _self.instantiateRelayTemplate( element );                  break;
                    case 'card_template'              : _self.instantiateCardTemplate( element );                   break;
                    case 'grid_template'              : _self.instantiateGridTemplate( element );                   break;
                    case 'list_template'              : _self.instantiateListTemplate( element );                   break;
                    case 'column_template'            : _self.instantiateColumnTemplate( element );                 break;
                    case 'iframe_template'            : _self.instantiateIFrameTemplate( element );                 break;
                    case 'grid-three-column_template' : _self.instantiateGridThreeColumnTemplate( element );        break;
                    case 'grid-seven-column_template' : _self.instantiateGridSevenColumnTemplate( element );        break;
                    case 'columntab_template'         : _self.instantiateColumnTabTemplate( element );              break;
                    case 'eggshell_template'          : !_self.nodeobject._id ? _self.instantiateEasterEggShellTemplate( element ) : _self.instantiateEggShellTemplate( element );       break;
                    case 'link_template'              : _self.instantiateLinkTemplate( element );                   break;
                    case 'basic_template'             : _self.instantiateBasicTemplate( element );                  break;
                    case 'button_template'            : _self.instantiateButtonTemplate( element );                 break;
                    case 'sss-modal_template'         : _self.instantiateSSSModalTemplate( element );               break;
                    case 'sss-calendar_template'      : _self.nodeobject.type === 'calendar' ? _self.instantiateSSSCalendarTemplate( element ) : _self.instantiateSSSCalendarTemplateHover( element );   break;
                    case 'coin_template'              : _self.instantiateCoinTemplate( element );                   break;
                    case 'textarea_template'          : _self.instantiateTextAreaTemplate( element );               break;
                    case 'myaccount_template'         : _self.instantiateMyAccountTemplate( element );              break;
                    case 'edit_template'              : _self.instantiateEditTemplate( element );                   break;
                    case 'table_template'             : _self.instantiateTableTemplate( element );                  break;
                    default                           : return;
                }
            } 
        });
    }


    instantiateIFrameTemplate( element ) {
    // WE COULD GENERALIZE THE INSTANTIATION FUNCTION WITH A TYPE VARIABLE
    // BUT THE PROBLEM IS THAT EACH TEMPLATE COMPONENT HAS ITS OWN @INPUTS AND @OUTPUTS

        if( this.cmpRef ) { this.cmpRef.destroy(); }

        let factory = this.componentFactoryResolver.resolveComponentFactory( SSSIframeComponent ); 

        this.cmpRef = this.tabtarget.createComponent( factory, 0, this.tabtarget.injector );

        this.cmpRef.instance.matryoshkanodeindex            = this.pointerindex;
        this.cmpRef.instance.parentnodeobject               = this.nodeobject;
        this.cmpRef.instance.matryoshkanodecurrentdate      = this.pointerobj.currentdate;
        this.cmpRef.instance.templateobject                 = element;
        this.cmpRef.instance.pointerobject                  = this.pointerobj;
        this.cmpRef.instance.tabset                         = this.tabset;


        let _self = this;

        this.cmpRef.instance.tabchanger.subscribe(($event)  => { _self.changeTab($event) });

        this.cmpRef.instance.nodezapper.subscribe(($event)  => { _self.deletethisnode.emit( 'deletethis' ); });
    }


    instantiateLinkTemplate( element ) {
    // WE COULD GENERALIZE THE INSTANTIATION FUNCTION WITH A TYPE VARIABLE
    // BUT THE PROBLEM IS THAT EACH TEMPLATE COMPONENT HAS ITS OWN @INPUTS AND @OUTPUTS

        if( this.cmpRef ) { this.cmpRef.destroy(); }

        let factory = this.componentFactoryResolver.resolveComponentFactory( SSSLinkComponent ); 

        this.cmpRef = this.tabtarget.createComponent( factory, 0, this.tabtarget.injector );

        this.cmpRef.instance.parentnodeobject      = this.nodeobject;
        this.cmpRef.instance.parentpointerobject   = this.pointerobj;
        // debugger;
        // NECESSARRY ???   
        // cmpRef.instance.parentpointerobject.localhoverstate = true;
        if( this.nodeobject.type === "calendar" ) {
            this.cmpRef.instance.displaytabdestination = "calendar";
        // } else if( _self.pointerobj.localhoverstate ) {
        //     cmpRef.instance.displaytabdestination = "basic";
        } else {
            this.cmpRef.instance.displaytabdestination = this.configService.getGlobalHoverState();
        }

        switch ( this.matryoshkanodeobj.type )
        {
            case 'subcategories'    :    this.cmpRef.instance.calltoactionbuttons  = "hover";    // "hover", "constant", "absent"
                                         this.cmpRef.instance.leftcta              = "favorite"; // "favorite", "display", "none"
                                         this.cmpRef.instance.rightcta             = "display";  // "favorite", "display", "none"
                                         break; 
            case 'favorites'        :    this.cmpRef.instance.calltoactionbuttons  = "hover";    // "hover", "constant", "absent"
                                         this.cmpRef.instance.leftcta              = "display";  // "favorite", "display", "none"
                                         this.cmpRef.instance.rightcta             = "favorite"; // "favorite", "display", "none"
                                         break; 
            default                 :    this.cmpRef.instance.calltoactionbuttons  = "absent";   // "hover", "constant", "absent"
                                         this.cmpRef.instance.leftcta              = "none";     // "favorite", "display", "none"
                                         this.cmpRef.instance.rightcta             = "none";     // "favorite", "display", "none"
                                         break; 
        }


        let _self = this;

        this.cmpRef.instance.tabchanger.subscribe(($event) => { _self.changeTab($event) });

        this.cmpRef.instance.nodeintroducer.subscribe(($event) => {  _self.handleIntroductionEvent() });

        this.cmpRef.instance.favoritemarker.subscribe(($event) => {  _self.changeFavoriteState($event) }); 
    }


    instantiateButtonTemplate( element ) {
    // WE COULD GENERALIZE THE INSTANTIATION FUNCTION WITH A TYPE VARIABLE
    // BUT THE PROBLEM IS THAT EACH TEMPLATE COMPONENT HAS ITS OWN @INPUTS AND @OUTPUTS

        if( this.cmpRef ) { this.cmpRef.destroy(); }

        let factory = this.componentFactoryResolver.resolveComponentFactory( SSSButtonComponent ); 

        this.cmpRef = this.tabtarget.createComponent( factory, 0, this.tabtarget.injector );

        this.cmpRef.instance.matryoshkanodeobject = this.matryoshkanodeobj;
        this.cmpRef.instance.parentnodeobject     = this.nodeobject;
        this.cmpRef.instance.parentpointerobject  = this.pointerobj;

        let _self = this;

        this.cmpRef.instance.modalprompter.subscribe(($event) => { 

                // _self.changeTab( "modal" ); 
                _self.modalprompter.emit($event);
        });
    }


    instantiateBasicTemplate( element ) {
    // WE COULD GENERALIZE THE INSTANTIATION FUNCTION WITH A TYPE VARIABLE
    // BUT THE PROBLEM IS THAT EACH TEMPLATE COMPONENT HAS ITS OWN @INPUTS AND @OUTPUTS

        if( this.cmpRef ) { this.cmpRef.destroy(); }

        let factory = this.componentFactoryResolver.resolveComponentFactory( SSSBasicComponent ); 

        this.cmpRef = this.tabtarget.createComponent( factory, 0, this.tabtarget.injector );

        this.cmpRef.instance.matryoshkanodeobject = this.matryoshkanodeobj;
        this.cmpRef.instance.parentnodeobject     = this.nodeobject;
        this.cmpRef.instance.parentpointerobject  = this.pointerobj;
        this.cmpRef.instance.matryoshkanodetype   = this.matryoshkanodeobj.type;

        this.cmpRef.location.nativeElement.style.position = "relative";

        let _self = this;

        this.cmpRef.instance.tabchanger.subscribe(($event) => { _self.changeTab($event) });

        this.cmpRef.instance.nodeintroducer.subscribe(($event) => {  _self.handleIntroductionEvent() });

        this.cmpRef.instance.favoritemarker.subscribe(($event) => {  _self.changeFavoriteState($event) });
    }


    instantiateMenuTemplate( element ) {
    // WE COULD GENERALIZE THE INSTANTIATION FUNCTION WITH A TYPE VARIABLE
    // BUT THE PROBLEM IS THAT EACH TEMPLATE COMPONENT HAS ITS OWN @INPUTS AND @OUTPUTS

        if( this.cmpRef ) { this.cmpRef.destroy(); }

        let factory = this.componentFactoryResolver.resolveComponentFactory( SSSMenuComponent ); 

        this.cmpRef = this.tabtarget.createComponent( factory, 0, this.tabtarget.injector );

        this.cmpRef.instance.matryoshkanodeobject = this.matryoshkanodeobj;
        this.cmpRef.instance.parentnodeobject     = this.nodeobject;
        this.cmpRef.instance.matryoshkanodeindex  = this.pointerindex;
        this.cmpRef.instance.pointerobject        = this.pointerobj;

        this.cmpRef.location.nativeElement.style.position = "relative";

        let _self = this;

        this.cmpRef.instance.tabchanger.subscribe(($event)   => { _self.changeTab($event); });

        this.cmpRef.instance.noderesetter.subscribe(($event) => { _self.handleResetEvent(); });

        this.cmpRef.instance.favoritemarker.subscribe(($event)  => { _self.changeFavoriteState($event) });

        this.cmpRef.instance.nodeintroducer.subscribe(($event)  => { _self.handleIntroductionEvent() });
    }





    getComponentLocalInputObject() {

        return this.pointerobj.localinputobj // TEMP FIX
                   ? {
                        "url"            : this.pointerobj.localinputobj.url         || "",
                        "background"     : this.pointerobj.localinputobj.background  || "",
                        "name"           : this.pointerobj.localinputobj.name        || ""
                     }
                   : {
                        "url"            : this.nodeobject.url         /* || this.pointerobj.localinputobj.url        */ || "",
                        "background"     : this.nodeobject.background  /* || this.pointerobj.localinputobj.background */ || "",
                        "name"           : this.nodeobject.name        /* || this.pointerobj.localinputobj.name       */ || ""
                     };
    }



    instantiateGridTemplate( element ) {
    // WE COULD GENERALIZE THE INSTANTIATION FUNCTION WITH A TYPE VARIABLE
    // BUT THE PROBLEM IS THAT EACH TEMPLATE COMPONENT HAS ITS OWN @INPUTS AND @OUTPUTS

        let _self = this;

        this.pointerobj.localinputobj = this.getComponentLocalInputObject(); // THIS NEEDS TO GO OR CHANGE

        this.nodeobject.background = this.pointerobj.localinputobj.background; // ??? THIS IS PERMANANT AND NEEDS FIXED

        this.tabService.memoizeTab( _self.tagset, null ).subscribe(args => {

            _self.nodeService.generateDefaultVacantTags( _self.nodeobject, 
                                                         _self.parenttemplateobj.refine, 
                                                         _self.matryoshkanodeobj.tags, 
                                                         args.inventory ).subscribe( args => {

                if( _self.cmpRef ) { _self.cmpRef.destroy(); }

                let factory = _self.componentFactoryResolver.resolveComponentFactory( SSSGridComponent ); 

                _self.cmpRef = _self.tabtarget.createComponent( factory, 0, _self.tabtarget.injector );
         
                _self.cmpRef.instance.parentnodeobject     = _self.nodeobject;
                _self.cmpRef.instance.pointerobject        = _self.pointerobj;
                _self.cmpRef.instance.templateobject       = element;
                _self.cmpRef.instance.matryoshkanodeindex  = _self.pointerindex;
                _self.cmpRef.instance.matryoshkanodeobject = _self.matryoshkanodeobj;

                // this.cmpRef._hostElement.nativeElement.style.display     = "block";
                // this.cmpRef._hostElement.nativeElement.style.position    = "relative";
                // this.cmpRef._hostElement.nativeElement.style.background  = "blue";

                _self.cmpRef.instance.nodezapper.subscribe(($event)    => { 

                    // cmpRef.instance.matryoshkanodeindex = _self.pointerindex;

                    _self.deletethisnode.emit( 'deletethis' );
                });

                _self.cmpRef.instance.nodepersister.subscribe(($event) => { _self.persistNodeToMemory(); });

                _self.cmpRef.instance.nodeeditor.subscribe(($event)    => { _self.editNode(); });
        
            });
        }); 
    }


    instantiateCoinTemplate( element ) {
    // WE COULD GENERALIZE THE INSTANTIATION FUNCTION WITH A TYPE VARIABLE
    // BUT THE PROBLEM IS THAT EACH TEMPLATE COMPONENT HAS ITS OWN @INPUTS AND @OUTPUTS

        if( this.cmpRef ) { this.cmpRef.destroy(); }

        let factory = this.componentFactoryResolver.resolveComponentFactory( SSSCoinComponent ); 

        this.cmpRef = this.tabtarget.createComponent( factory, 0, this.tabtarget.injector );

        this.cmpRef.instance.matryoshkanodeobject = this.matryoshkanodeobj;
        this.cmpRef.instance.parentnodeobject     = this.nodeobject;
    }


    instantiateTextAreaTemplate( element ) {
    // WE COULD GENERALIZE THE INSTANTIATION FUNCTION WITH A TYPE VARIABLE
    // BUT THE PROBLEM IS THAT EACH TEMPLATE COMPONENT HAS ITS OWN @INPUTS AND @OUTPUTS

        if( this.cmpRef ) { this.cmpRef.destroy(); }

        let factory = this.componentFactoryResolver.resolveComponentFactory( SSSTextAreaComponent ); 

        this.cmpRef = this.tabtarget.createComponent( factory, 0, this.tabtarget.injector );

        this.cmpRef.instance.matryoshkanodeobject = this.matryoshkanodeobj;
        this.cmpRef.instance.parentnodeobject     = this.nodeobject;
        
        this.cmpRef.location.nativeElement.style.position = "relative";

        let _self = this;

        this.cmpRef.instance.tabchanger.subscribe(($event) => { _self.changeTab($event) });
    }


    instantiateMyAccountTemplate( element ) {
    // WE COULD GENERALIZE THE INSTANTIATION FUNCTION WITH A TYPE VARIABLE
    // BUT THE PROBLEM IS THAT EACH TEMPLATE COMPONENT HAS ITS OWN @INPUTS AND @OUTPUTS

        if( this.cmpRef ) { this.cmpRef.destroy(); }

        let factory = this.componentFactoryResolver.resolveComponentFactory( SSSAccountComponent ); 

        this.cmpRef = this.tabtarget.createComponent( factory, 0, this.tabtarget.injector );

        this.cmpRef.instance.matryoshkanodecolor = this.nodeobject.color;
        this.cmpRef.instance.matryoshkanodeindex = this.pointerindex;

        let _self = this;

        this.cmpRef.instance.nodezapper.subscribe(($event) => { _self.deletethisnode.emit( 'deletethis' ); });
    }


    instantiateSSSModalTemplate( element ) {
    // WE COULD GENERALIZE THE INSTANTIATION FUNCTION WITH A TYPE VARIABLE
    // BUT THE PROBLEM IS THAT EACH TEMPLATE COMPONENT HAS ITS OWN @INPUTS AND @OUTPUTS

        if( this.cmpRef ) { this.cmpRef.destroy(); }

        let factory = this.componentFactoryResolver.resolveComponentFactory( SSSModalComponent ); 

        this.cmpRef = this.tabtarget.createComponent( factory, 0, this.tabtarget.injector );
                
        this.cmpRef.instance.parentnodecolor         = this.nodeobject.color; // DIFFERENCE
        this.cmpRef.instance.modalobject             = this.pointerobj.localmodalobj;

        let _self = this;

        this.cmpRef.instance.tabchanger.subscribe(($event) => { 

            _self.changeTab( _self.configService.getGlobalHoverState() ) 
        });
    }


    instantiateEggShellTemplate( element ) {
    // WE COULD GENERALIZE THE INSTANTIATION FUNCTION WITH A TYPE VARIABLE
    // BUT THE PROBLEM IS THAT EACH TEMPLATE COMPONENT HAS ITS OWN @INPUTS AND @OUTPUTS

        if( this.cmpRef ) { this.cmpRef.destroy(); }

        let factory = this.componentFactoryResolver.resolveComponentFactory( SSSEggShellComponent ); 

        this.cmpRef = this.tabtarget.createComponent( factory, 0, this.tabtarget.injector );
                
        this.cmpRef.instance.matryoshkanodeindex     = this.pointerindex;
        this.cmpRef.instance.eggshellcolor           = this.matryoshkanodeobj.color; 
        this.cmpRef.instance.nodeid                  = this.pointerobj._id;

        this.cmpRef.location.nativeElement.style.position = "relative";

        let _self = this;

        this.cmpRef.instance.tabchanger.subscribe(($event) => { _self.changeTab($event) });
    }


    instantiateEasterEggShellTemplate( element ) { // BC ITS HOLLOW && A TEMP VACANT
    // WE COULD GENERALIZE THE INSTANTIATION FUNCTION WITH A TYPE VARIABLE
    // BUT THE PROBLEM IS THAT EACH TEMPLATE COMPONENT HAS ITS OWN @INPUTS AND @OUTPUTS

        if( this.cmpRef ) { this.cmpRef.destroy(); }

        let factory = this.componentFactoryResolver.resolveComponentFactory( SSSEggShellComponent ); 

        this.cmpRef = this.tabtarget.createComponent( factory, 0, this.tabtarget.injector );
                    
        this.cmpRef.instance.matryoshkanodeindex     = this.pointerindex;
        this.cmpRef.instance.eggshellcolor           = this.matryoshkanodeobj.color;
        this.cmpRef.instance.nodeid                  = this.pointerobj._id;

        this.cmpRef.location.nativeElement.style.position = "relative";

        let _self = this;

        this.cmpRef.instance.tabchanger.subscribe(($event) => {

            // IF THE INDEX IS LARGER THAN THE INVENTORY LENGTH 
            // THEN IT IS A TEMP VACANT AND 
            // THEN WE JUST CHANGE THE (PARENT) POINTER REFERENCE 
            // AND REINTERPRET THE NODE
            // debugger;
            _self.pointerobj.currenttab = "edit";

            _self.interpetNode( this.pointerobj._id ).subscribe(args => { });

       });
    }


    instantiateEditTemplate( element ) {
    // WE COULD GENERALIZE THE INSTANTIATION FUNCTION WITH A TYPE VARIABLE
    // BUT THE PROBLEM IS THAT EACH TEMPLATE COMPONENT HAS ITS OWN @INPUTS AND @OUTPUTS

        this.pointerobj.localinputobj = this.getComponentLocalInputObject(); 

        if( this.cmpRef ) { this.cmpRef.destroy(); }

        let factory = this.componentFactoryResolver.resolveComponentFactory( SSSEditComponent ); 

        this.cmpRef = this.tabtarget.createComponent( factory, 0, this.tabtarget.injector );

        this.cmpRef.instance.matryoshkanodeindex = this.pointerindex;
        this.cmpRef.instance.parentnodeobject    = this.nodeobject;
        this.cmpRef.instance.templateobject      = element;
        this.cmpRef.instance.pointerobject       = this.pointerobj;
        this.cmpRef.instance.localinputobject    = this.pointerobj.localinputobj;
// debugger;

        let _self = this;

        this.cmpRef.instance.matryoshkaUpdateLocalInputObject.subscribe(($event) => {

            // DO I ALSO NEED TO RERENDER THE VIEW?
            _self.pointerobj.localinputobj = _self.getComponentLocalInputObject();
        });


        this.cmpRef.instance.tabchanger.subscribe(($event) => {

            if( !_self.nodeobject._id ) {

                _self.pointerobj.currenttab = "tags";

                _self.interpetNode( this.pointerobj._id ).subscribe(args => { });

            } else {

                _self.changeTab($event)
            }
        });
        

        this.cmpRef.instance.nodepersister.subscribe(($event)   => { _self.persistNodeToMemory(); });

        this.cmpRef.instance.nodeeditor.subscribe(($event)      => { _self.editNode(); });
    }


    instantiateTableTemplate( element ) {
    // WE COULD GENERALIZE THE INSTANTIATION FUNCTION WITH A TYPE VARIABLE
    // BUT THE PROBLEM IS THAT EACH TEMPLATE COMPONENT HAS ITS OWN @INPUTS AND @OUTPUTS

        if( this.cmpRef ) { this.cmpRef.destroy(); }

        let factory = this.componentFactoryResolver.resolveComponentFactory( SSSTableComponent ); 

        this.cmpRef = this.tabtarget.createComponent( factory, 0, this.tabtarget.injector );

        this.cmpRef.instance.matryoshkanodeindex = this.pointerindex;
        this.cmpRef.instance.parentnodeobject    = this.nodeobject;
        this.cmpRef.instance.templateobject      = element;
        this.cmpRef.instance.pointerobject       = this.pointerobj;
    }  


    instantiateRelayTemplate( element ) {
    // WE COULD GENERALIZE THE INSTANTIATION FUNCTION WITH A TYPE VARIABLE
    // BUT THE PROBLEM IS THAT EACH TEMPLATE COMPONENT HAS ITS OWN @INPUTS AND @OUTPUTS

        if( this.cmpRef ) { this.cmpRef.destroy(); }

        let factory = this.componentFactoryResolver.resolveComponentFactory( SSSRelayComponent ),
            
            tabid   = this.tabService.fetchTabid( this.categoryService.getCurrentCategoryID(), 
                                                 "ALLRESOURCES", 
                                                 "master",
                                                  this.accountService.getUserObject()._id );

        this.cmpRef = this.tabtarget.createComponent( factory, 0, this.tabtarget.injector );

        this.cmpRef.instance.matryoshkanodeindex  = this.pointerindex;
        this.cmpRef.instance.parentnodeobject     = this.nodeobject;
        this.cmpRef.instance.templateobject       = element;
        this.cmpRef.instance.pointerobject        = this.pointerobj;
        this.cmpRef.instance.matryoshkanodetype   = this.matryoshkanodeobj.type;
        this.cmpRef.instance.tabid                = tabid; 

        // cmpRef._hostElement.nativeElement.style.display     = "block";
        // cmpRef._hostElement.nativeElement.style.position    = "relative";

        let _self = this;

        this.cmpRef.instance.nodeintroducer.subscribe(($event)  => { _self.handleIntroductionEvent() });

        this.cmpRef.instance.tabchanger.subscribe(($event)      => { _self.changeTab($event) });

        this.cmpRef.instance.favoritemarker.subscribe(($event)  => { _self.changeFavoriteState($event) });

        this.cmpRef.instance.modalprompter.subscribe(($event)   => { 

            _self.pointerobj.localmodalobj = $event;
           
            _self.changeTab( "modal" ); 
        });
    }


    instantiateSSSCalendarTemplate( element ) {
    // WE COULD GENERALIZE THE INSTANTIATION FUNCTION WITH A TYPE VARIABLE
    // BUT THE PROBLEM IS THAT EACH TEMPLATE COMPONENT HAS ITS OWN @INPUTS AND @OUTPUTS

        if( this.cmpRef ) { this.cmpRef.destroy(); }

        let factory = this.componentFactoryResolver.resolveComponentFactory( SSSCalendarComponent ); 

        this.cmpRef = this.tabtarget.createComponent( factory, 0, this.tabtarget.injector );

        this.cmpRef.instance.parentnodeobject     = this.nodeobject;
        this.cmpRef.instance.pointerobject        = this.pointerobj;
        this.cmpRef.instance.caltype              = "sidebar";
        this.cmpRef.instance.calcolor             = this.nodeobject.color;
        this.cmpRef.instance.calendarindex        = this.pointerindex;
        this.cmpRef.instance.calid                = this.pointerobj._id;
        this.cmpRef.instance.topcontrols          = true;
        this.cmpRef.instance.bottomcontrols       = false;
        this.cmpRef.instance.calinstantiations    = this.nodeobject.instantiations;
        this.cmpRef.instance.matryoshkanodetype   = this.matryoshkanodeobj.type;
        this.cmpRef.instance.matryoshkanodeobj    = this.matryoshkanodeobj;

        this.cmpRef.location.nativeElement.style.position = "relative";

        // this.cmpRef._hostElement.nativeElement.style.display     = "block";
        // this.cmpRef._hostElement.nativeElement.style.position    = "relative";

        let _self = this;

        // this.cmpRef.instance.nodeunshifter.subscribe(($event) => { _self.unshiftNode(); });

        this.cmpRef.instance.nodeintroducer.subscribe(($event)  => { _self.handleIntroductionEvent() });

        this.cmpRef.instance.tabchanger.subscribe(($event)      => { _self.changeTab($event) });

        this.cmpRef.instance.favoritemarker.subscribe(($event)  => { _self.changeFavoriteState($event) });

        this.cmpRef.instance.modalprompter.subscribe(($event)   => { 

            _self.pointerobj.localmodalobj = $event;

            _self.changeTab( "modal" );  

        });       
    }


    instantiateSSSCalendarTemplateHover( element ) {
    // WE COULD GENERALIZE THE INSTANTIATION FUNCTION WITH A TYPE VARIABLE
    // BUT THE PROBLEM IS THAT EACH TEMPLATE COMPONENT HAS ITS OWN @INPUTS AND @OUTPUTS

        if( this.cmpRef ) { this.cmpRef.destroy(); }

        let factory = this.componentFactoryResolver.resolveComponentFactory( SSSCalendarComponent ); 

        this.cmpRef = this.tabtarget.createComponent( factory, 0, this.tabtarget.injector );

        this.cmpRef.instance.parentnodeobject     = this.nodeobject;
        this.cmpRef.instance.pointerobject        = this.pointerobj;
        this.cmpRef.instance.caltype              = "linkhover";
        this.cmpRef.instance.calcolor             = this.nodeobject.color;
        this.cmpRef.instance.calendarindex        = null;
        this.cmpRef.instance.calid                = this.pointerobj._id;
        this.cmpRef.instance.topcontrols          = true;
        this.cmpRef.instance.bottomcontrols       = true;
        this.cmpRef.instance.calinstantiations    = this.nodeobject.instantiations;
        this.cmpRef.instance.matryoshkanodetype   = this.matryoshkanodeobj.type;
        this.cmpRef.instance.matryoshkanodeobj    = this.matryoshkanodeobj;

        // this.cmpRef._hostElement.nativeElement.style.display     = "block";
        // this.cmpRef._hostElement.nativeElement.style.position    = "relative";

        let _self = this;

        // this.cmpRef.instance.nodeunshifter.subscribe(($event) => { _self.unshiftNode(); });

        this.cmpRef.instance.nodeintroducer.subscribe(($event)  => { _self.handleIntroductionEvent() });

        this.cmpRef.instance.tabchanger.subscribe(($event)      => { _self.changeTab($event) });

        this.cmpRef.instance.favoritemarker.subscribe(($event)  => { _self.changeFavoriteState($event) });

        this.cmpRef.instance.modalprompter.subscribe(($event)   => { 

            _self.pointerobj.localmodalobj = $event;

            _self.changeTab( "modal" );  

        });
    }


    instantiateListTemplate( element ) {
    // WE COULD GENERALIZE THE INSTANTIATION FUNCTION WITH A TYPE VARIABLE
    // BUT THE PROBLEM IS THAT EACH TEMPLATE COMPONENT HAS ITS OWN @INPUTS AND @OUTPUTS

        if( this.cmpRef ) { this.cmpRef.destroy(); }

        let factory = this.componentFactoryResolver.resolveComponentFactory( SSSListComponent ),

            tabid   = this.tabService.fetchTabid( this.pointerobj._id, 
                                                  this.pointerobj.currenttab === "day" ? this.pointerobj.currentdate: "ALLRESOURCES",
                                                  this.pointerobj.instance,
                                                  this.accountService.getUserObject()._id );

        this.cmpRef = this.tabtarget.createComponent( factory, 0, this.tabtarget.injector );
  
        this.cmpRef.instance.parentnodeobject     = this.nodeobject;
        this.cmpRef.instance.pointerobject        = this.pointerobj;
        this.cmpRef.instance.templateobject       = element;
        this.cmpRef.instance.matryoshkanodeindex  = this.pointerindex;
        this.cmpRef.instance.matryoshkanodeobject = this.matryoshkanodeobj;
        this.cmpRef.instance.tabid                = tabid;

        // if( this.pointerobj.style ) { 

        //     Object.keys( this.pointerobj.style ).forEach(function(key,index) {

        //         _self.cmpRef.location.nativeElement.style[ key ] = _self.pointerobj.style[ key ];
        //     });
        // }
        // this.cmpRef.location.nativeElement.style.display     = "block";
        // this.cmpRef.location.nativeElement.style.position    = "relative";
        // this.cmpRef.location.nativeElement.style.background  = "blue";
    }


    instantiateColumnTemplate( element ) {
    // WE COULD GENERALIZE THE INSTANTIATION FUNCTION WITH A TYPE VARIABLE
    // BUT THE PROBLEM IS THAT EACH TEMPLATE COMPONENT HAS ITS OWN @INPUTS AND @OUTPUTS

        if( this.cmpRef ) { this.cmpRef.destroy(); }

        let factory = this.componentFactoryResolver.resolveComponentFactory( SSSColumnComponent ); 

        this.cmpRef = this.tabtarget.createComponent( factory, 0, this.tabtarget.injector );
        // debugger;
        this.cmpRef.instance.parentnodeobject     = this.nodeobject;
        this.cmpRef.instance.pointerobject        = this.pointerobj;
        this.cmpRef.instance.templateobject       = element;
        this.cmpRef.instance.matryoshkanodeindex  = this.pointerindex;
        this.cmpRef.instance.matryoshkanodeobject = this.matryoshkanodeobj;

        // let _self = this;

        // if( this.pointerobj.style ) { 

        //     Object.keys( this.pointerobj.style ).forEach(function(key,index) {

        //         _self.cmpRef.location.nativeElement.style[ key ] = _self.pointerobj.style[ key ];
        //     });
        // }

        // this.cmpRef._hostElement.nativeElement.style.display     = "block";
        // this.cmpRef._hostElement.nativeElement.style.position    = "relative";
        // this.cmpRef._hostElement.nativeElement.style.background  = "blue";
    }



    instantiateGridSevenColumnTemplate( element ) {

        // let _self = this;

        // // this.pointerobj.localinputobj = this.getComponentLocalInputObject() || {};

        // this.nodeobject.background = this.pointerobj.localinputobj.background;

        // this.tabService.memoizeTab( _self.tagset, null ).subscribe(args => {

        //         _self.nodeService.generateDefaultVacantTags( _self.nodeobject, 
        //                                                      _self.parenttemplateobj.refine, 
        //                                                      _self.matryoshkanodeobj.tags, 
        //                                                      args.inventory ).subscribe( args => {

        //                 // WE COULD GENERALIZE THE INSTANTIATION FUNCTION WITH A TYPE VARIABLE
        //                 // BUT THE PROBLEM IS THAT EACH TEMPLATE COMPONENT HAS ITS OWN @INPUTS AND @OUTPUTS
        //                 this.dcl.loadNextToLocation( GridSevenColumn_Template, this.tabtarget)
        //                         .then( cmpRef => {

        //                             if( _self.cmpRef ) { _self.cmpRef.destroy(); }

        //                             _self.cmpRef = cmpRef;

        //                             cmpRef.instance.matryoshkapointerindex  = _self.pointerindex;
        //                             cmpRef.instance.matryoshkanodeobject = _self.matryoshkanodeobj;
        //                             cmpRef.instance.parentnodeobject        = _self.nodeobject;
        //                             cmpRef.instance.templateobject          = element;
        //                             cmpRef.instance.pointerobject           = _self.pointerobj;

        //                             cmpRef.instance.nodezapper
        //                                            .subscribe(($event) => { 

        //                                                 // cmpRef.instance.matryoshkanodeindex = _self.pointerindex;

        //                                                 _self.deletethisnode.emit( 'deletethis' );
        //                                             });

        //                             cmpRef.instance.nodepersister
        //                                            .subscribe(($event) => { _self.persistNodeToMemory(); });

        //                             cmpRef.instance.nodeeditor
        //                                            .subscribe(($event) => { _self.editNode(); });
        //                         });


        //     });
        // }); 
    }    



    instantiateCardTemplate( element ) {
    // WE COULD GENERALIZE THE INSTANTIATION FUNCTION WITH A TYPE VARIABLE
    // BUT THE PROBLEM IS THAT EACH TEMPLATE COMPONENT HAS ITS OWN @INPUTS AND @OUTPUTS

        if( this.cmpRef ) { this.cmpRef.destroy(); }

        let factory = this.componentFactoryResolver.resolveComponentFactory( SSSCardComponent ); 

        this.cmpRef = this.tabtarget.createComponent( factory, 0, this.tabtarget.injector );
 
        this.cmpRef.instance.parentnodeobject     = this.nodeobject;
        this.cmpRef.instance.pointerobject        = this.pointerobj;
        this.cmpRef.instance.templateobject       = element;
        this.cmpRef.instance.matryoshkanodeindex  = this.pointerindex;
        this.cmpRef.instance.matryoshkanodeobject = this.matryoshkanodeobj;
        this.cmpRef.instance.tabset               = this.tabset;

        let _self = this;

        this.cmpRef.instance.nodezapper.subscribe(($event)    => { 

            _self.cmpRef.instance.matryoshkanodeindex = _self.pointerindex;

            _self.deletethisnode.emit( $event );
        });

        this.cmpRef.location.nativeElement.style.position = "relative";

        this.cmpRef.instance.nodepersister.subscribe(($event) => { _self.persistNodeToMemory(); });

        this.cmpRef.instance.nodeeditor.subscribe(($event)    => { _self.editNode(); });

        this.cmpRef.instance.tabchanger.subscribe(($event)    => { 

            let urlboundindex = _self.matryoshkapointerobj.urlinstructions.position === -1 
                                     ? _self.parentcmpreflength() - 1
                                     : _self.matryoshkapointerobj.urlinstructions.position;

            _self.cmprefindex === urlboundindex ? _self.changeURL($event) : _self.changeTab($event);
        });

        // this.cmpRef._hostElement.nativeElement.style.display     = "block";
        // this.cmpRef._hostElement.nativeElement.style.position    = "relative";
        // this.cmpRef._hostElement.nativeElement.style.background  = "blue";
    }


    instantiateColumnTabTemplate( element ) {

//         let _self = this; 
//         // debugger;
// // if( _self.pointerobj._id === "language-arts") { debugger; } 
//         // WE COULD GENERALIZE THE INSTANTIATION FUNCTION WITH A TYPE VARIABLE
//         // BUT THE PROBLEM IS THAT EACH TEMPLATE COMPONENT HAS ITS OWN @INPUTS AND @OUTPUTS
//         this.dcl.loadNextToLocation( SSSColumnComponent, this.tabtarget)
//                 .then( cmpRef => { 
//                     // debugger;
// // if( _self.pointerobj._id === "language-arts") { debugger; } 
//                     if( _self.cmpRef ) { _self.cmpRef.destroy(); }

//                     _self.cmpRef = cmpRef;

//                     cmpRef.instance.matryoshkanodeindex  = _self.pointerindex;
//                     cmpRef.instance.matryoshkanodeobject = _self.matryoshkanodeobj;
//                     cmpRef.instance.parentnodeobject     = _self.nodeobject;
//                     cmpRef.instance.templateobject       = element;
//                     cmpRef.instance.pointerobject        = _self.pointerobj;

//                     // cmpRef._hostElement.nativeElement.style.display     = "block";
//                     // cmpRef._hostElement.nativeElement.style.position    = "relative";

//                     cmpRef.instance.nodezapper
//                                    .subscribe(($event) => { 

//                                         cmpRef.instance.matryoshkanodeindex = _self.pointerindex;

//                                         _self.deletethisnode.emit( 'deletethis' );
//                                     });

//                     cmpRef.instance.nodepersister
//                                    .subscribe(($event) => { _self.persistNodeToMemory(); });

//                     cmpRef.instance.nodeeditor
//                                    .subscribe(($event) => { _self.editNode(); });
//                 });
    }


    instantiateGridThreeColumnTemplate( element ) {

        // let _self = this;

        // // WE COULD GENERALIZE THE INSTANTIATION FUNCTION WITH A TYPE VARIABLE
        // // BUT THE PROBLEM IS THAT EACH TEMPLATE COMPONENT HAS ITS OWN @INPUTS AND @OUTPUTS
        // this.dcl.loadNextToLocation( GridThreeColumn_Template, this.tabtarget).then( cmpRef => {

        //     if( _self.cmpRef ) { _self.cmpRef.destroy(); }

        //     _self.cmpRef = cmpRef;

        //     cmpRef.instance.matryoshkanodeindex              = _self.pointerindex;
        //     cmpRef.instance.matryoshkanodeobject             = _self.matryoshkanodeobj;
        //     cmpRef.instance.parentnodeobject                 = _self.nodeobject;
        //     cmpRef.instance.templateobject                   = element;
        //     cmpRef.instance.pointerobject                    = _self.pointerobj;
        //     cmpRef.instance.tabset                           = _self.tabset;

        //     cmpRef.instance.nodezapper.subscribe(($event)    => { 

        //         cmpRef.instance.matryoshkanodeindex = _self.pointerindex;

        //         _self.deletethisnode.emit( $event );
        //     });

        //     cmpRef.instance.nodepersister.subscribe(($event) => { _self.persistNodeToMemory(); });

        //     cmpRef.instance.nodeeditor.subscribe(($event)    => { _self.editNode(); });

        //     cmpRef.instance.tabchanger.subscribe(($event)    => { 

        //         let urlboundindex = _self.matryoshkapointerobj.urlinstructions.position === -1 
        //                                  ? _self.parentcmpreflength() - 1
        //                                  : _self.matryoshkapointerobj.urlinstructions.position;

        //         _self.cmprefindex === urlboundindex ? _self.changeURL($event) : _self.changeTab($event);
        //     });
        // });
    }



    relayParentReplacementMsg( replacementobj ) {

        if( this.cmpRef.instance.replaceChildCmpRefByIndex ) {
            this.cmpRef.instance.replaceChildCmpRefByIndex( replacementobj ).subscribe(args => {}); // DOES THIS REALLY NEED SUBSCRIBE?
        }
    }


    relayParentAdditionMsg( additionpointerid ) {

        if( this.cmpRef.instance.addToChildCmpRef ) {
            this.cmpRef.instance.addToChildCmpRef( additionpointerid ).subscribe(args => {}); // DOES THIS REALLY NEED SUBSCRIBE?
        }
    }



    persistNodeToMemory() {

        let _self = this;

        // ADDS NEW NODE TO NODESINMEMORY, NEW TAB OBJ TO TABSINMEMORY, AND RETURNS NEW POINTER OBJ
        this.proxyService.persistToMemory( this.nodeobject, 
                                           this.parenttabid, 
                                           this.originaltagarray, 
                                           this.pointerindex, 
                                           this.matryoshkanodeobj, 
                                           this.parenttemplateobj.refine, 
                                           this.pointerobj ).subscribe( persistedpointerobj => { 
                                           // RESOLVE persistednodeid IS A NODEID 

            // REFERENCE CMPREFSINMEMORY TO ACCESS ALL CMPREFS AND 
            // CALL ON EACH CMPREF"S FUNCTION TO BROADCAST TO ITS PARENT LIST
            _self.domService.replaceSimilarCmpRefInstances( _self.matryoshkanodeobj._id,
                                                           {
                                                               "cmprefindex"    : this.cmprefindex,
                                                               "pointerindex"   : this.pointerindex,
                                                               "oldpointerid"   : this.pointerobj._id,
                                                               "newpointerobj"  : persistedpointerobj
                                                           } );
        });
    }


    editNode() {

        let _self = this;

        this.proxyService.editNode( this.pointerobj, 
                                    this.nodeobject,
                                    this.parenttabid,
                                    this.matryoshkanodeobj,
                                    this.originaltagarray,
                                    this.pointerobj,
                                    this.pointerindex ).subscribe( mutatednodeid => { 
                                    // RESOLVE mutatednodeid IS A NODEID 

            _self.domService.refreshSpecificCmpRefs( mutatednodeid, _self.matryoshkanodeobj._id );
        }); 
    }


    processTabLabel( labelstring ) {

        switch ( labelstring )
        {
            case null:    return this.calendarService.getCustomFullDateString( this.pointerobj.currentdate ); // ITS A DAY TAB 
            default:      return labelstring;
        }
    }


    handleResetEvent( ) { 

        let _self       = this;

        this.proxyService.resetNode( this.matryoshkanodeobj, 
                                     this.originaltagarray,
                                     this.nodeobject, 
                                     this.parenttabid, 
                                     this.pointerindex,
                                     this.parenttemplateobj.refine,
                                     this.pointerobj.currentdate ).subscribe(args => {

            _self.interpetNode( args ).subscribe(args => { });
        });
    }


    parentRerender() { this.interpetNode( this.pointerobj._id ).subscribe(args => { }); }

    changeURL( tabname ) {

        let pathstring = location.origin +
                                       '/#/' + location.hash.split("/")[1] + 
                                       '/'   + this.pointerobj._id +            // ??? THERE IS A PROBLEM ????
                                       '/'   + tabname;

        window.location.href = pathstring;
    }


    changeTab( tabname ) {
//debugger; 

        let urldestination, 
            tabdestination;

        if( this.nodeobject.type === 'calendar' && ( tabname === 'day' || tabname === 'chronology' ) ) {
            urldestination = this.calendarService.getUTCDateString();
            tabdestination = tabname;
        } else {
            urldestination = tabname;
            tabdestination = tabname;
        }

        // CHANGE HIGHLIGHTED TAB AND TEMPLATE DISPLAYED ON CANVAS
        // this.currenttab = tabdestination;


        // EASILY TO DEFINE WHICH PARENT (normally column tab) IS COUPLED TO THE BROWSER URL
        // if( this.pointerindex === 0 && _self.pointerobj.urlnodelistener) { 

        // if( this.pointerindex   === 0 && 
        //     this.pointerobj._id === this.configService.getHistoryNodeID()) { // FIX THIS IN FUTURE
        //                                                                      // SO WE CAN STANDADRDIZE 
        //                                                                      // AND EASILY DEFINE WHICH NODE 
        //                                                                      // IS COUPLED TO THE BROWSER URL
        //     debugger; let pathstring = location.origin +
        //                                '/#/' + location.hash.split("/")[1] + 
        //                                '/'   + this.pointerobj._id +            // ??? THERE IS A PROBLEM ????
        //                                '/'   + urldestination;

        //     window.location.href = pathstring;

        // } else {

            // UPDATE MEMORY AND LOCAL STORAGE SO WE CAN REMEMBER WHAT TABS ARE SELECTED WHEN USR RETURNS
            let _self = this;

            // debugger;

            // console.log("^^^^^^^ HOTSHOT", this.pointerindex);

        this.tabService.updateCurrentTabOfInventoryNodeByIndex( this.parenttabid, 
                                                                this.pointerindex, 
                                                                urldestination,
                                                                this.pointerobj.localhoverstate ).subscribe(args => { 

            _self.interpetNode( this.pointerobj._id ).subscribe(args => { });

        });  
        // }
    }


    addNewChildNode( nodetitlestring )   { 

        if( nodetitlestring.length == 0 ) { return; } // INPUT MODEL IN THE VIEW HTML TEMPLATE

        let _self = this,
            nodetypearg,
            idvariable;

        // IS THIS NECCESARY ???
        switch ( this.nodeobject.type )
        {
            case 'subcategories'    : nodetypearg = "folder";        break; 
            case 'history'          : nodetypearg = "folder";        break; 
            case 'favorites'        : nodetypearg = "calendar";      break; 
            case 'topcategories'    : nodetypearg = "folder";        break; 
            default                 : nodetypearg = "folder";
        }

        if( this.accountService.getUserObject()._id === undefined )  {

            idvariable = 'GUEST_' + nodetitlestring;

        } else if( this.accountService.getUserObject()._id === "mysyllabi" ) {

            idvariable = nodetitlestring;

        } else {

            idvariable = this.accountService.getUserObject()._id + '_' + nodetitlestring;
        }
        
        this.tabService.unshiftNewNodeIntoTabInventory( nodetitlestring, 
                                                        idvariable, 
                                                        this.nodeobject._id, 
                                                        nodetypearg ).subscribe(args => {
            // cmpRefA
            
            let pathstring = location.origin +
                                       '/#/' + location.hash.split("/")[1] + 
                                       '/'   + args;

            window.location.href = pathstring;

        });        
    }


    cloneAcopyIntoNode() { 

        var _self = this;

        this.tabService.addResourceToNode( this.pointerobj._id, 
                                           this.matryoshkanodeobj, 
                                           'ALLRESOURCES', 
                                           "folder", 
                                           this.nodeobject ).subscribe(args => { // ARGS IS A NODEID
                
                // SUCCESS RESULT RETURNS THE NODEID THAT WAS ORIGINALLY SENT
                // _self.modalservice.buildAddToFolderNotificationModal( data, _self.scope.resourceobject );  // DATA IS A NODEID

        });
    }


    handleIntroductionEvent() {

        if( [ 'form', 
              'tags' , 
              'stub', 
              'vacant' ].indexOf( this.pointerobj.template ) !== -1 ) { return; }


        // if( this.pointerobj.template           == 'form'       || 
        //     this.pointerobj.template           == 'menu'       ||
        //     this.pointerobj.template           == 'tags'       ||
        //     this.pointerobj.template           == 'stub'       ||
        //     this.pointerobj.template           == 'vacant') { return; }

        // if( $event.target.tagName    === "LI"        ||
        //     $event.target.tagName    === "EM"        ||
        //     $event.target.tagName    === "BUTTON"    ||
        //     $event.target.tagName    === "SPAN" ) {

        //     return;
        if( this.pointerobj.template==='menu' ) {

            switch ( this.nodeobject.type )
            {
                case 'folder'       :   this.cloneAcopyIntoNode();           break;
                case 'calendar'     :   this.cloneAcopyIntoNode();           break;
                case 'category'     :   this.cloneAcopyIntoNode();           break;
                case 'sponsor'      :   this.cloneAcopyIntoNode();           break;
                case 'promo'        :   this.cloneAcopyIntoNode();           break;
                default             :   this.cloneAcopyIntoNode();
            }

        } else {

            switch ( this.nodeobject.type )
            {
                case 'folder'       :   this.introducenode();           break;
                case 'calendar'     :   this.introducecalendarnode();   break;
                case 'category'     :   this.introducecategory();       break;
                case 'sponsor'      :   this.introducenode();           break;
                case 'promo'        :   this.introducenode();           break;
                default             :   this.introducenode();
            }
        }
    }


    introducenode() {

        window.location.href = location.origin + '/#/' + 
                               location.hash.split("/")[1] + '/' + 
                               this.pointerobj._id;
    }


    introducecategory() {

        window.location.href = location.origin + '/#/' +  
                               location.hash.split("/")[1] + '/' + 
                               this.pointerobj._id;
        
        // $('html,body').scrollTop( 0 );
    }


    introducecalendarnode() {

        let today = new Date();

        // UPDATE GLOBAL DATE VARIABLES
        this.calendarService
            .updateHighlightDate( today.getFullYear(), today.getMonth(), today.getDate() );

        // SETS A NE CURRENT CALENDAR
        this.calendarService.unshiftCalendarInMemory( this.pointerobj._id );

        // IF YOU WANT A SPECIFIC NODE TO CHANGE THE COLUMN WHEN CLICKED, 
        // THEN SET THE NODES PROPERTY FOR THE mysyllabi_taxonomy KEY
        if( this.nodeobject.instantiations["taxonomy"] === undefined ||
            this.nodeobject.instantiations["taxonomy"].length === 0 ) {

            window.location.href = location.origin + 
                                  '/#/' + location.hash.split("/")[1] +
                                   '/'  + this.nodeobject.instantiations["history"][0] +
                                   '/'  + this.calendarService.getUTCDateString();
        } else { 

            window.location.href = location.origin + 
                                   '/#/' + this.nodeobject.instantiations["taxonomy"][0] +
                                   '/'   + this.nodeobject.instantiations["history"][0] +
                                   '/'   + this.calendarService.getUTCDateString();

        } // CAN'T JUST USE today VARIABLE FOR DATE BECAUSE WE NEED TO IGNORE SECONDS
    }


    changeFavoriteState( favoritearg ) {

        this.pointerobj.isFavorite = !favoritearg;

        this.tabService.updateFavoriteStatusOfInventoryNodeByIndex( this.parenttabid, this.pointerindex, this.pointerobj.isFavorite );
    }
}
