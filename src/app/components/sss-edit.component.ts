import { Component, 
		 Input, 
		 Output,
		 EventEmitter } 		    from "@angular/core";

import { Observable } 				from "rxjs/Observable";

import { SSSConfigService } 		from "./../services/sss-config.service";
import { SSSNodeService } 			from "./../services/sss-node.service";
import { SSSTabService } 			from "./../services/sss-tab.service";


@Component({
    selector: 'sss-edit',
    template: `
            <div class="edit_template"
                 style="cursor:pointer;
                        text-align:center;
                        background-size: cover;
                        border-radius: 20px;
                        border: 8px solid;
                        position: relative;
                        overflow:hidden;
                        box-sizing: border-box;
                        height: calc(100% - 23px);
                        margin-top:23px;"
                 [ngStyle]="{'color': parentnodeobject.color,
                             'border-color': parentnodeobject.color}">


                <input placeholder="Label"
                       [(ngModel)]="pointerobject.localinputobj.name"
                         style="width: 200px;
                                margin: 28px 0 8px;">
                <input placeholder="URL"
                       [(ngModel)]="pointerobject.localinputobj.url"
                       *ngIf="parentnodeobject.type == 'poster' ||
                              parentnodeobject.type == 'stub' ||
                              parentnodeobject.type == 'vacant'"
                        style="width: 200px;
                               margin: 8px 0;">
                <input placeholder="Background Image"
                       [(ngModel)]="pointerobject.localinputobj.background"
                         style="width: 200px;
                                margin: 8px 0;">
                <button (click)="handleSubmitButton();"
                        [ngStyle]="{'color': parentnodeobject.color}"
                         style="cursor:pointer;
                                width: 200px;
                                margin: 8px 0;">Submit</button>
                <em (click)="tabchanger.emit( 'menu' );"
                    [ngStyle]="{'color': parentnodeobject.color}"
                    style="cursor:pointer;
                           width: 200px;
                           margin: 8px 0;">cancel</em>

            </div>
    `
})
export class SSSEditComponent {

    tabinformation        					: any;

    // @Input's
    public templateobject                   : any;
    public parentnodeobject                 : any;
    public matryoshkanodeindex              : String;
    public pointerobject                    : any;
           
	// @Output's
	matryoshkaUpdateLocalInputObject 		= new EventEmitter();
	tabchanger                    		    = new EventEmitter();
	nodepersister                  		    = new EventEmitter();
	nodeeditor                  	        = new EventEmitter();


    constructor( public configService       : SSSConfigService,
                 public nodeService         : SSSNodeService,
                 public tabService          : SSSTabService ) { 

        let _self = this;

        // tabService._emitterTabInventoryUpdated.subscribe(args => {

        //     if( args.tabid == _self.tabid ) {
        //         _self.updateTabInformation();
        //     }
        // });

        // tabService._emitterTabCurrentDateUpdated.subscribe(args => {

        //     alert(args.tabid);

        //     if( args.tabid == _self.tabid ) {

        //         _self.pointerobject.currentdate = args.currentdate; // WHY ???

        //         _self.updateTabInformation();
        //     }
        // });
    };


    ngAfterContentInit() { 
    }


    handleSubmitButton()         {

        // VALIDATION BLOCK 
        if( this.pointerobject.localinputobj.url.length          === 0 &&
            this.pointerobject.localinputobj.background.length   === 0 &&
            this.pointerobject.localinputobj.name.length         === 0 )  {

            alert("need to fill out the forms correctly in order to post");

            // RESTORE PREVIOUS VALUES IF EDITING
            this.matryoshkaUpdateLocalInputObject.emit( "empty" );
            // PARENT CHANGES LOCaL INPUT OBJECT
            // RESULT TRICKLES DOWN TO CHILD BC THE CHILD HOLDS A REFERENCE TO THE SAME OBJECT
            // BE CAREFUL WHEN THE PARENT NODE REFRESHES ( MOST TIMES IN THE changeTab function )

            return;
        } 

        if( this.parentnodeobject.type === 'vacant' ) { this.tabchanger.emit( "tags" ); return; }

        // IF NOT A VACANT, THEN WE KNOW WE"RE IN EDIT MODE - > - > SO SKIP TAGS STEP AND JUST COMPLETE USER COMMAND
        if(  this.parentnodeobject.type  === 'stub'   ||
           ( this.pointerobject.localinputobj.url === '' && this.parentnodeobject.type === 'poster') ) {

            // this.persistToMemory();
            this.nodepersister.emit( "persistme" );

            return;
        }

        // FALL THROUGH IF ANY OTHER TYPE OF NODE
        // this.editResource();
        this.nodeeditor.emit( "editme" );
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
