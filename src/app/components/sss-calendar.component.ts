import { Component, 
		 EventEmitter,
         ComponentRef,
         ComponentFactoryResolver, 
         ViewChild, 
         ViewContainerRef, 
         ElementRef }        		from "@angular/core";

import { Observable } 				from "rxjs/Observable";

import { SSSConfigService } 		from "./../services/sss-config.service";
import { SSSNodeService } 			from "./../services/sss-node.service";
import { SSSTabService } 			from "./../services/sss-tab.service";
import { SSSCalendarService } 	    from "./../services/sss-calendar.service";

import { SSSLinkComponent }         from './sss-link.component';


@Component({
    selector: 'sss-calendar',
    template: `
        <span class="menuprompt"
              style="display: block;
                     width: 30px;
                     height: 30px;
                     border-radius: 50%;
                     cursor: pointer;
                     color: white;
                     line-height: 26px;
                     text-align: center;
                     position: absolute;
                     z-index: 1;
                     border: 3px solid white;"
              [ngStyle]="{'background-color': calcolor}"
              (click)="tabchanger.emit( 'menu' )">?
        </span>

        <div class="link-placeholder" #linktarget></div>

        <div class="calendar_template"
             style="cursor: pointer;
                    border-radius: 20px;
                    border: 8px solid;
                    background-size: cover;
                    overflow:hidden;
                    box-sizing: border-box;"
             [ngStyle]="{'color': calcolor,
                         'border-color': calcolor,
                         'background': calcolor}">


                <span class="topbanner"
                      *ngIf="topcontrols == true"
                      style="display:block;
                             color: white;
                             padding-bottom: 5px;
                             width: 95%;
                             text-align:center;
                             border-top-left-radius: 10px;
                             border-top-right-radius: 10px;
                             border: 0px solid;
                             font-size: 14px;"
                     [ngStyle]="{'background-color': calcolor}">

                      <em style="font-style:normal;"
                         (click)="gotopreviousmonth()">&#10094;</em>
                      <em style="font-style: normal;
                                 text-align: center;
                                 width: 140px;
                                 display: inline-block;
                                 text-overflow: ellipsis;">{{getCalendarDateString()}}</em>
                      <em style="font-style:normal;"
                         (click)="gotonextmonth()">&#10095;</em>
                </span>

                <ul class="calendardaycollection"
                    style="padding: 0;
                           margin: 0;">

                <!-- IMPORTANT TO NOT CALL A FUNCTION IN THIS NG-REPEAT -->
                <!-- INSTEAD STORE WHAT IT RETURNS IN A $SCOPE VARIABLE -->

                <!-- You could calculate the width of the containing element and apply font-size 
                     based on that document.getElementById('text-container').offsetWidth 

                     or iFRAME https://plnkr.co/edit/X2FQGzxjeDFiYHXlQFFg?p=preview -->

                    <li *ngFor="let day of calendararray"
                        (click)="dateclicked( day.datestamp )"
                        [ngClass]="{'darkpast':day.position == 'previous',
                                    'light':day.position == 'current',
                                    'darkfuture':day.position == 'following'}"
                        style="width: 14.28%;
                               padding: 6.88% 0;
                               border: 1px solid #000;
                               box-sizing: border-box;
                               background-color: #fff;
                               float: left;
                               list-style: none;
                               position: relative;
                               display:block;"
                        [ngStyle]="{'border': '1px solid ' + calcolor}">

                        <em [ngClass]="{'activeday':!day.isEmpty}"
                             style="position: absolute;
                                    font-size: calc(100% - 0.3em);
                                    font-weight: 700;
                                    text-align: center;
                                    width: 100%;
                                    line-height: 0%;">{{day.daynumber}}</em>

                    </li>
                </ul>

                <span class="bottombanner"
                     *ngIf="bottomcontrols == true"
                      [ngStyle]="{'background-color':  calcolor}"
                       style="display:block;
                              color: white;
                              position: absolute;
                              bottom: 0px;
                              width: 100%;
                              padding-top: 5px;">
                      <em (click)="backwardCalendar()"
                           style="font-style:normal;
                                  color:white;">&#10094;</em>
                      <em style="font-style:normal;
                                 margin: 0 10px;
                                 text-align: center;
                                 width: 150px;
                                 display: inline-block;
                                 text-overflow: ellipsis;">{{calendarTitle}}</em>
                      <em (click)="forwardCalendar()"
                           style="font-style:normal;
                                  color:white;">&#10095;</em>
                </span>
        </div>
    `
})
export class SSSCalendarComponent {

    @ViewChild('linktarget', {read: ViewContainerRef}) linktarget : ViewContainerRef;

    calendararray                        : Array<any>;
    calendarTitle                        : String;

    // @Input's
    public matryoshkanodeobj   			 : any;
    public parentnodeobject    			 : any;
    public pointerobject       			 : any;
    public caltype             			 : String;
    public calcolor            			 : String;
    public calid               			 : String;
    public calendarindex       			 : String;
    public topcontrols         			 : String;
    public bottomcontrols      			 : String;
    public calinstantiations   			 : any;
    public matryoshkanodetype  			 : any;

    // @Output's
    nodeintroducer      				 = new EventEmitter();
    nodeunshifter       				 = new EventEmitter();
    tabchanger          				 = new EventEmitter();
    favoritemarker      				 = new EventEmitter();
    modalprompter       				 = new EventEmitter();

    cmpRef                               : ComponentRef<any>;

    constructor( public  configService    : SSSConfigService,
                 public  nodeService      : SSSNodeService,
                 public  tabService       : SSSTabService,
                 public  calendarService  : SSSCalendarService,
                 private componentFactoryResolver: ComponentFactoryResolver ) {

        let _self = this;

        calendarService._emitterCalendarUpdated.subscribe(args => {
            _self.calendararray = calendarService.getCalendarDayArray(); 
        });
    };


    ngAfterContentInit() { 

        this.refreshCalendar();
    }


    refreshCalendar() {

        this.calendararray = this.calendarService.getCalendarDayArray();

        this.getCalendarTitle();

        let _self = this;

        if( this.caltype === "linkhover") {
            
            this.calendarService.getCurrentCalendarColor().subscribe(args => {

                    _self.calcolor = args;

                    _self.instantiateLinkTemplate();
            });

        } else {

            _self.instantiateLinkTemplate();
        }
    }


    instantiateLinkTemplate( ) {

        if( this.cmpRef ) { this.cmpRef.destroy(); }

        let factory = this.componentFactoryResolver.resolveComponentFactory( SSSLinkComponent ); 

        this.cmpRef = this.linktarget.createComponent( factory, 0, this.linktarget.injector );

        this.cmpRef.instance.parentnodeobject      = this.parentnodeobject;
        this.cmpRef.instance.parentpointerobject   = this.pointerobject;
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

        // this.cmpRef._hostElement.nativeElement.style.color = _self.calcolor;

        this.cmpRef.instance.tabchanger.subscribe(($event) 		=> { _self.tabchanger.emit($event) });

        this.cmpRef.instance.nodeintroducer.subscribe(($event) 	=> {  _self.nodeintroducer.emit($event) });

        this.cmpRef.instance.favoritemarker.subscribe(($event) 	=> {  _self.favoritemarker.emit($event) });
    }



    getCalendarTitle() {

        let _self = this;

        this.calendarService.getCurrentCalendarName().subscribe( args => { _self.calendarTitle = args; });
    }

    
    gotopreviousmonth()            {

        this.calendarService.gotopreviousmonth();
        this.calendararray = this.calendarService.getCalendarDayArray();
    }


    gotonextmonth()            {

        this.calendarService.gotonextmonth();
        this.calendararray = this.calendarService.getCalendarDayArray();
    }


    getCalendarDateString()            { 

        return this.calendarService.getCalendarDateString(); 
    }


    forwardCalendar()            { 

        this.calendarService.forwardCalendar();
        this.refreshCalendar();
    }


    backwardCalendar()            { 

        this.calendarService.backwardCalendar();
        this.refreshCalendar();
    }


    dateclicked( datestamp ) {  

        this.calendarService.updateHighlightUTCDate( datestamp );
 
        if( this.caltype === 'sidebar')          {   // goto day page

            this.calendarService.unshiftCalendarInMemory( this.calid );

            // IF YOU WANT A SPECIFIC NODE TO CHANGE THE LEFT COLUMN MENU WHEN CLICKED, 
            // THEN SET THE NODES PROPERTY FOR THE mysyllabi_taxonomy KEY
            if( this.calinstantiations["taxonomy"] === undefined ||
                this.calinstantiations["taxonomy"].length === 0 ) { 
                
                let pathstring = location.origin + 
                                     '/#/' + location.hash.split("/")[1] + 
                                     '/' + this.calinstantiations["history"][0] + 
                                     '/' + datestamp;

                window.location.href = pathstring;

            } else { 
                
                let pathstring = location.origin +
                                     '/#/' + this.calinstantiations["taxonomy"][0] + 
                                     '/' + this.calinstantiations["history"][0] + 
                                     '/' + datestamp;

                window.location.href = pathstring;
            }   

            // $('html,body').scrollTop( 0 );

        } else { // linkhover || poster

            let _self = this,
                solidday = new Date( datestamp );

            this.tabService.addResourceToNode( this.calendarService.getCurrentCalendarID(), _self.parentnodeobject, datestamp, "calendar", undefined ) // ??? undefined for migration
                .subscribe(args => {

                    let message = "<h3 style='color:white;width:230px;margin:20px 0 0;text-align:center;'>Confirmed</h3><hr><ul style='color:white;'><li><span style='display:inline;'><b>scheduled: </b></span><span>" + _self.parentnodeobject.name + 
                                  "</span></li><li><span style='display:inline;'><b>date: </b></span><span>" + solidday.toDateString() +
                                  "</span></li><li><span style='display:inline;'><b>calendar: </b></span><span>" + _self.calendarTitle +
                                  "</span></li><li><span style='display:inline;'><b>method: </b></span><span>" + "copy/paste" +  
                                  "</span></li></ul>";
                    
                    _self.modalprompter.emit( message );
                    
                });
        } 
    }
}
