import { Component, 
		 Input, 
		 Output, 
		 EventEmitter } 			from "@angular/core";

import { Observable } 				from "rxjs/Observable";

import { SSSConfigService } 		from "./../services/sss-config.service";
import { SSSNodeService } 			from "./../services/sss-node.service";
import { SSSTabService } 			from "./../services/sss-tab.service";



@Component({
    selector: 'sss-link',
    template: `
                <div class="leftTool"
                     style="display: inline-block;
                            position: relative;
                            top: -3px;"
                    *ngIf="calltoactionbuttons==='hover' || calltoactionbuttons==='constant'">

                    <i *ngIf="leftcta==='favorite' && parentpointerobject.localhoverstate"
                       [ngClass]="{'icon-star':parentpointerobject.isFavorite==true && leftcta==='favorite', 
                                   'icon-star-empty':parentpointerobject.isFavorite==false && leftcta==='favorite'}"
                       (click)="favoritemarker.emit( parentpointerobject.isFavorite )"
                       [ngStyle]="{'color': parentnodeobject.color,
                                   'border-color': parentpointerobject.color}"
                        style="cursor: pointer;
                               height: 20px;
                               width: 20px;
                               display: block;
                               text-align: center;
                               line-height: 14px;
                               font-size: 20px;
                               margin-left: 1px;">&#9824;</i>

                    <sss-button *ngIf="leftcta==='display' && parentpointerobject.localhoverstate"
                                     class="display-collapse-button"
                                     type="button" 
                                    (click)="tabchanger.emit( displaytabdestination )"
                                    [ngStyle]="{'background-color': parentnodeobject.color}"
                                     style="height: 16px;
                                            width: 16px;
                                            text-align: right;
                                            position:relative;
                                            top:-4px;">
                        <i class="icon-white"
                          [ngClass]="pointerbutton"></i>
                    </sss-button>
                </div>


                <h1 style="cursor: pointer;
                           font-size: 14px;
                           width: 95%;
                           text-align: center;
                           color: red;
                           margin: 0;
                           display: inline-block;
                           height: 18px;
                           overflow: hidden;"
                   (click)="nodeintroducer.emit( 'ladiesandgentlemen' )"
                   [ngStyle]="{'color': parentnodeobject.color}">{{parentnodeobject.name}}</h1>

                       
                <div class="rightTool"
                     style="display: inline-block;
                            position: relative;
                            top: -3px;" 
                     *ngIf="calltoactionbuttons==='hover' || calltoactionbuttons==='constant'">

                   <button type="button" 
                            class="display-collapse-button"
                            *ngIf="rightcta==='display' && parentpointerobject.localhoverstate"
                            [ngStyle]="{'background-color': parentnodeobject.color}"
                            (click)="tabchanger.emit( displaytabdestination )"
                            style="height: 16px;
                                   width: 16px;    
                                   text-align: left;
                                   position:relative;
                                   top:-4px;">
                         <i class="icon-white"
                            [ngClass]="pointerbutton"></i>
                    </button>

                    <i [ngClass]="{'icon-star':parentpointerobject.isFavorite==true && rightcta==='favorite', 
                                   'icon-star-empty':parentpointerobject.isFavorite==false && rightcta==='favorite'}"
                       (click)="favoritemarker.emit( parentpointerobject.isFavorite )"
                       *ngIf="rightcta==='favorite' && parentpointerobject.localhoverstate"
                       [ngStyle]="{'color': parentnodeobject.color,
                                   'border-color': parentpointerobject.color}"
                        style="cursor: pointer;
                               height: 20px;
                               width: 20px;
                               display: block;
                               text-align: center;
                               line-height: 14px;
                               font-size: 20px;
                               margin-left: 1px;">&#9824;</i>
                </div>
    `
})
export class SSSLinkComponent {

    localhoverstate                     : String;
    pointerbutton                       : String;

    // @Input's
    public parentnodeobject 			: any;
    public parentpointerobject          : any;
    public calltoactionbuttons          : String; // "hover", "constant", "absent"
    public leftcta                      : String; // "favorite", "display", "none"
    public rightcta                     : String; // "favorite", "display", "none"
    public displaytabdestination        : String; 

	// @Output's
	tabchanger                    		= new EventEmitter();
	nodeintroducer                		= new EventEmitter();
	favoritemarker                		= new EventEmitter();

    constructor() { }

    ngAfterContentInit() { 

        switch ( this.parentnodeobject.type )
        {
            case 'folder'       		:   this.pointerbutton = 'icon-folder-open';   break;
            case 'sponsor'      		:   this.pointerbutton = 'icon-heart';         break;
            case 'promo'        		:   this.pointerbutton = 'icon-wrench';        break;
            case 'calendar'     		:   this.pointerbutton = 'icon-calendar';      break;
            case 'category'     		:   this.pointerbutton = 'icon-asterisk';      break;
            default             		:   return;
        }
    }
}
