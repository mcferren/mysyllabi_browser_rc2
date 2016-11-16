import { Component, 
		 Input, 
		 Output } 					from "@angular/core";

import { Observable } 				from "rxjs/Observable";

import { SSSConfigService } 		from "./../services/sss-config.service";
import { SSSNodeService } 			from "./../services/sss-node.service";
import { SSSTabService } 			from "./../services/sss-tab.service";


@Component({
    selector: 'sss-coin',
    template: `
                <div class="coin_template"
                     style="cursor: pointer;
                            text-align: center;
                            display: block;
                            width: 25%;
                            height: 25%;
                            border-radius: 50%;
                            border: 2px solid;
                            position: relative;
                            overflow: hidden;
                            float: left;
                            box-sizing: border-box;"
                     [ngClass]="{'unselected':isTagged(parentnodeobject._id) == false,
                                 'selected':isTagged(parentnodeobject._id) == true}"
                     [ngStyle]="{'background-color': isTagged(parentnodeobject._id) == false ? matryoshkanodeobject.color : 'white',
                                 'border': isTagged(parentnodeobject._id) == false ? '2px solid white' : '2px solid ' + matryoshkanodeobject.color }"
                     (click)="handleIndividualTagButton(parentnodeobject._id)">

                    <span style="position:absolute;
                                  font-size: 9px;
                                  top:2%;
                                  left:1%;"
                         [ngStyle]="{'color': isTagged(parentnodeobject._id) == false ? 'white' : matryoshkanodeobject.color }">
                     
                        {{parentnodeobject.name}}
                    </span>
                </div>
    `
})
export class SSSCoinComponent {

    // @Input's
    public parentnodeobject               : any;
    public matryoshkanodeobject           : any;


    constructor() {

	};


    ngAfterContentInit() { 

    }


    isTagged( stringarg ) {

        if( this.matryoshkanodeobject.tags[ stringarg ] === undefined ) {
            return false;
        } else {
            return true;
        }
    }


    handleIndividualTagButton( tagarg ) {

        if( this.matryoshkanodeobject.tags[ tagarg ] === undefined ) {

            this.matryoshkanodeobject.tags[ tagarg ] = 1;     // ADD THE KEY TO THE OBJECT SO THE TAG IS REPRESENTED

        }  else {
            
            delete this.matryoshkanodeobject.tags[ tagarg ];  // REMOVE THE PROPERTY FROM THE OBJECT
        }
    }


    // SHOULD MOVE THIS TO SOME ExTENDS DESIGN PATTERN
    toggleHeight(event) {

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
