import { Component, 
		 Input, 
		 Output,
		 EventEmitter } 		    from "@angular/core";

import { Observable } 				from "rxjs/Observable";

import { SSSConfigService } 		from "./../services/sss-config.service";
import { SSSNodeService } 			from "./../services/sss-node.service";
import { SSSTabService } 			from "./../services/sss-tab.service";


@Component({
    selector: 'sss-textarea',
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
                              top: 38px;
                              z-index: 1;
                              border: 3px solid white;"
                      [ngStyle]="{'background-color': matryoshkanodeobject.color}"
                      (click)="tabchanger.emit( 'menu' )">?
                </span>

                
                <div class="textarea_template"
                     style="cursor: pointer;
                            text-align: center;
                            font-size: 40px;
                            height: calc(100% - 23px);
                            border-radius: 20px;
                            border: 8px solid;
                            color: orange;
                            background-size: cover;
                            background: white;
                            box-sizing: border-box;
                            margin-top: 23px;
                            overflow: hidden;"
                     (click)="tabchanger.emit( 'edit' )"
                 [ngStyle]="{'color': matryoshkanodeobject.color,
                             'border-color': matryoshkanodeobject.color,
                             'background': 'url(' + parentnodeobject.background + ') no-repeat center center',
                             'background-size': 'cover'}">

                     <span style="height: 140px;
                                  width: 240px;
                                  display: block;
                                  position: relative;
                                  top: 50%;
                                  left: 50%;
                                  transform: translate(-50%,-50%);
                                  line-height: initial;">{{parentnodeobject.name}}</span>
                </div>
    `
})
export class SSSTextAreaComponent {

    tabinformation                   : any;

    // @Input's
    public parentnodeobject          : any;
    public matryoshkanodeobject      : any;

    // @Output's
    tabchanger                    	 = new EventEmitter();


    constructor() {

    };


    ngAfterContentInit() { 

    }


    changeNodeCurrentTab( tabname ) {

        let pathstring = location.origin + 
                                         '/#/' + location.hash.split("/")[1] + 
                                         '/'   + location.hash.split("/")[2] + 
                                         '/'   + tabname;

        window.location.href = pathstring;
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
