import { Component, 
		 EventEmitter } 			from "@angular/core";

import { Observable } 				from "rxjs/Observable";

import { SSSConfigService } 		from "./../services/sss-config.service";
import { SSSNodeService } 			from "./../services/sss-node.service";
import { SSSTabService } 			from "./../services/sss-tab.service";

@Component({
    selector: 'sss-modal',
    template: `
        <div class="modal_template"
             style="cursor:pointer;
                    text-align:justify;
                    font-size:14px;
                    background-size: cover;
                    display:block;
                    height: 250px;
                    width: 250px;
                    margin-top: 30px;
                    border-radius: 20px;
                    border: 8px solid;
                    position: relative;
                    overflow:hidden;"
             (click)="tabchanger.emit( 'basic' )"
             [ngStyle]="{'background': parentnodecolor,
                         'border-color': parentnodecolor}">

            <div [innerHTML]="modalobject"></div>

            <button style="line-height:initial;
                           font-size: 16px;
                           margin: 5px 10%;
                           width: 80%;
                           color:white;
                           border:2px solid white;"
                   (click)="tabchanger.emit( 'globalhoverstate' )"
                   [ngStyle]="{'background': parentnodecolor}">OK</button>
        </div>
    `
})
export class SSSModalComponent {

	// @Input's
    public parentnodecolor          : String;
    public modalobject              : any;

	// @Output's 
	tabchanger 						= new EventEmitter();


    constructor( public tabService  : SSSTabService) {

    };


    ngAfterContentInit() {  }

}
