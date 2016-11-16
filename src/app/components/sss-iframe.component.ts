import { Component, 
		 Input, 
		 Output, 
		 EventEmitter } 			from "@angular/core";

import { SSSAccountService }        from "./../services/sss-account.service";
import { SSSConfigService } 		from "./../services/sss-config.service";
import { SSSNodeService } 			from "./../services/sss-node.service";
import { SSSTabService } 			from "./../services/sss-tab.service";

import { SSSCalendarComponent }     from './sss-calendar.component';


@Component({
    selector: 'sss-iframe',
    template: `
                <span class="deletenode"
                      *ngIf="tabinformation.heightstate != 'collapsed'"
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
                              right: 10px;
                              top: 93px;
                              z-index: 1;
                              border: 2px solid white;"
                      (click)="nodezapper.emit( 'delete' )">X
                </span>


                <ul class="nodeHeader"
                    style="width: 883px;
                           text-align: left;
                           margin: 0;
                           padding: 0 0 0 23px;
                           position: relative;
                           top: 15px;
                           left: 1px;">
                    <li [ngStyle]="{'color': parentnodeobject.color}"
                         style="width: 240px;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                float:left;
                                position: relative;
                                top: -16px;"><h1>{{parentnodeobject.name}}</h1></li>
                    <li *ngFor="let tabHeader of tabset"
                         style="list-style:none;
                                font-size:11px;
                                float:right">
                    <!-- [ngStyle]="{'border-color': parentnodeobject.color}"> 
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
                <!--  | filterTabsByGrade:parentnodeobject.filtration -->


                <div class="poster_template"
                     style="display:block;
                            height: 990px;
                            width: 870px;
                            border-top: 32px solid;
                            border-bottom-right-radius: 20px;
                            border-bottom-left-radius: 20px;
                            border-left: 3px solid;
                            border-right: 3px solid;
                            border-bottom: 3px solid;
                            margin-left:5%;
                            position: relative;
                            overflow:hidden;"
                    [ngStyle]="{'border-color': parentnodeobject.color,
                                'padding-bottom': tabinformation.percentageheight + '%'}"> 
                    
                    <!-- YOU CANT INFER THE HEIGHT OF AN IFRAME WITH CROSS DOMAN CONTENT
                         SO I TRIED TO MAKE THIS DYNAMIC EARLIER WITH THE BELOW SNIPPET 
                         AND PARENT WRAPPER DIV WITH CSS RULES FOR HEIGHT:0 AND POSITION: RELATIVE
                         BUT IT HAD CONFLICT WITH A PADDING BOTTOM AND DISPLAYING THE IFRAME CONTENT 
                         ABOVE THE PADDING VIEW AREA..... SO I THINK ITS JUST EASIER TO JUST
                         MAKE THE HEIGHT REALLY REALLY BIG AND HIDE IT VERTICALLY INSDIE THE NODES DIV

                         [ngStyle]="{\'padding-bottom\': tabinformation.percentageheight + \'%\'}"
                    -->

                    <iframe width='100%'  
                            height='100000px'
                            frameBorder='0' 
                            sandbox='allow-same-origin allow-scripts'
                            [src]="parentnodeobject.url"
                            scrolling='no'>
                    </iframe>

                    <!-- <gutter *ngIf="tabinformation.heightstate != 'collapsed'"
                            [searchbar]="true"
                            [matryoshkanodecolor]="parentnodeobject.color"
                            (showMore)="toggleHeight($event)"></gutter> -->

                </div>
            `
})
export class SSSIframeComponent {

    tabinformation                       : any;

    // @Inputs
    public templateobject                : any;
    public parentnodeobject              : any;
    public matryoshkanodeindex           : String;
    public matryoshkanodecurrentdate     : String;
    public pointerobject                 : any;
    public tabset                        : Array<any>;

    // @Outputs
    tabchanger                    		 = new EventEmitter();
    nodezapper                    		 = new EventEmitter();

    constructor( public configService    : SSSConfigService,
                 public accountService   : SSSAccountService,
                 public nodeService      : SSSNodeService,
                 public tabService       : SSSTabService ) {

        this.tabinformation = {};
    };


    ngAfterContentInit() { 

        let _self = this;

        this.memoizeTab();
    }


    memoizeTab() {

        let _self  = this,
        
             tabid = this.tabService.fetchTabid( this.parentnodeobject._id, 
                                                 this.parentnodeobject.currenttab === "day" ? this.parentnodeobject.currentdate : "ALLRESOURCES",
                                                 this.parentnodeobject.instance,
                                                 this.accountService.getUserObject()._id );

        this.tabService.memoizeTab( tabid, 'poster' ).subscribe(args => {

            _self.tabinformation = args;
        });
    }


    // SHOULD MOVE THIS TO SOME ExTENDS DESIGN PATTERN
    toggleHeight() {

        // console.log(event);

        // let heightvalue = this.tabService.toggleHeight( this.tabid,
        //                                                 this.tabinformation.heightstate, 
        //                                                 this.tabinformation.percentageheight );

        // this.tabinformation.heightstate       = heightvalue[ 0 ];
        // this.tabinformation.percentageheight  = heightvalue[ 1 ];
    }


    // SHOULD MOVE THIS TO NODE CTRL WHEN WE MASTER OUTPUTS
    deleteNodeAtIndex( index ) { 

        // let _self = this;

        // this.tabService.removeNodeAtIndex( index, this.configService.getHistoryNodeID() )
        //     .subscribe(args => { // data IS THE HISTORY NODE'S TAB'S INVENTORY ARRAY

        //         if( index === 0 && args.length !== 0) { 
        //         // IF YOU DELETED THE TOP NODE OFF THE ARRAY (AND IT IS NOT THE ONLY NODE IN THE ARRAY)
        //             let pathstring = location.origin + 
        //                              '/#/' + location.hash.split("/")[1] + 
        //                              '/'   + args[0]['_id'];

        //             window.location.href = pathstring;

        //         } else if( args.length === 0 ) {

        //             window.location.href = location.origin + '/#/';
        //         }

        //     });
    }

}
