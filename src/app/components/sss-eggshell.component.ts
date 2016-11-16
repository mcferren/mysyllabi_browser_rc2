import { Component, 
		 Input, 
		 Output,
		 EventEmitter } 		    from "@angular/core";

import { Observable } 				from "rxjs/Observable";

import { SSSConfigService } 		from "./../services/sss-config.service";
import { SSSNodeService } 			from "./../services/sss-node.service";
import { SSSTabService } 			from "./../services/sss-tab.service";

@Component({
    selector: 'sss-eggshell',
    template: `
        <div class="eggshell_template"
             style="cursor: pointer;
                    text-align: center;
                    font-size: 40px;
                    border-radius: 20px;
                    border: 8px solid;
                    background-size: cover;
                    background: white;
                    box-sizing: border-box;
                    height: calc(100% - 23px);
                    margin-top: 23px;
                    overflow: hidden;"
             (click)="tabchanger.emit( 'edit' )"
             [ngStyle]="{'color': eggshellcolor}">

                {{blanklabel[matryoshkanodeindex % 6]}}
        </div>
    `
})
export class SSSEggShellComponent {

    tabinformation                        : any;
    blanklabel 							  : Array<String>

    // @Input's
    public matryoshkanodeindex            : String;
    public eggshellcolor                  : String;
    public nodeid                         : String;
    
    // @Output's       
    tabchanger 						      = new EventEmitter();


    constructor( public tabService        : SSSTabService ) {

        this.blanklabel                   = [ "+ create message", "+ add link", "+ post image", 
                                              "+ share video", "+ post image", "+ add link" ];

    };


    ngAfterContentInit() { 
// debugger;
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
