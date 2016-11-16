import { Component, 
         Input, 
         Output,
         EventEmitter,
         ComponentRef,
         ComponentFactoryResolver, 
         ViewChild, 
         ViewContainerRef }         from "@angular/core";

import { Observable }               from "rxjs/Observable";

import { SSSLinkComponent }         from './sss-link.component';

@Component({
    selector: 'sss-basic',
    template: `
            <span class="menuprompt"
                   style="display: block;
                          width: 40px;
                          height: 40px;
                          border-radius: 50%;
                          cursor: pointer;
                          color: white;
                          line-height: 36px;
                          text-align: center;
                          position: absolute;   
                          top: 53px;
                          z-index: 1;
                          border: 3px solid white;"
                  [ngStyle]="{'background-color': parentnodeobject.color}"
                  (click)="tabchanger.emit( 'menu' )">?
            </span>
            
            <div class="link-placeholder" #linktarget></div>

            <div class="basic_template"
                 style="cursor: pointer;
                        padding-bottom: calc(100% - 18px);
                        border-radius: 20px;
                        border: 8px solid;
                        color: orange;
                        background-size: cover;
                        background: white;
                        box-sizing: border-box;"
                 (click)="nodeintroducer.emit( 'ladiesandgentlemen' )"
                 [ngStyle]="{'color': parentnodeobject.color,
                             'border-color': parentnodeobject.color,
                             'background': 'url(' + parentnodeobject.background + ') no-repeat center center',
                             'background-size': 'cover'}"></div>
    `
})
export class SSSBasicComponent {

    tabinformation                       : any;
    localhoverstate                      : Boolean;

    @ViewChild('linktarget', {read: ViewContainerRef}) linktarget : ViewContainerRef;

    // @Input's
    public parentnodeobject              : any;
    public parentpointerobject           : any;
    public matryoshkanodeobject          : any;
    public matryoshkanodetype            : any;
           
    // @Output's
    tabchanger                    		 = new EventEmitter();
    nodeintroducer                		 = new EventEmitter();
    favoritemarker                		 = new EventEmitter();

    cmpRef                               : ComponentRef<any>;

    constructor( private componentFactoryResolver: ComponentFactoryResolver ) {

    };


    ngAfterContentInit() { this.instantiateLinkTemplate(); }


    instantiateLinkTemplate( ) {

        if( this.cmpRef ) { this.cmpRef.destroy(); }

        let factory = this.componentFactoryResolver.resolveComponentFactory( SSSLinkComponent ); 

        this.cmpRef = this.linktarget.createComponent( factory, 0, this.linktarget.injector );

		this.cmpRef.instance.parentnodeobject      = this.parentnodeobject;
        this.cmpRef.instance.parentpointerobject   = this.parentpointerobject;
        this.cmpRef.instance.displaytabdestination = "headline";

        switch ( this.matryoshkanodetype )
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

        this.cmpRef.instance.tabchanger.subscribe(($event)     => { _self.tabchanger.emit($event) });

        this.cmpRef.instance.nodeintroducer.subscribe(($event) => {  _self.nodeintroducer.emit($event) });

        this.cmpRef.instance.favoritemarker.subscribe(($event) => {  _self.favoritemarker.emit($event) });
    }
}
