import { Component, 
		 Input, 
		 Output, 
		 EventEmitter } 		    from "@angular/core";

import { Observable } 			    from "rxjs/Observable";

import { SSSTabService }            from "./../services/sss-tab.service";
import { SSSNodeService }           from "./../services/sss-node.service";
import { SSSDOMService }            from "./../services/sss-dom.service";

@Component({
    selector: 'sss-button',
    template: `<button style="font-size: 16px;
                              margin: 5px 10%;
                              width: 80%;"
                   (click)="nodeButtonClicked()"
                   [ngStyle]="{'color': parentnodeobject.color}">{{parentnodeobject.name}}</button>`
})
export class SSSButtonComponent {

    localhoverstate                      : String;

    // @Input's
    public parentnodeobject              : any;
    public matryoshkanodeobject          : any;
           
    // @Output's 
    modalprompter                 		 = new EventEmitter();


    constructor( public tabService       : SSSTabService,
                 public nodeService      : SSSNodeService,
                 public domService       : SSSDOMService ) {

    };


    ngAfterContentInit() { 

    }


    nodeButtonClicked() { 

        let _self = this;

    //     this.tabService.addResourceToNode( this.parentnodeobject._id, 
    //                                        this.matryoshkanodeobject, 
    //                                       'ALLRESOURCES', 
    //                                       "folder", 
    // /* ??? undefined MIGRATION TEMP ARG */ undefined ).subscribe(successfulcontributionobj => { // DATA IS A NODEID



            _self.domService.addToSimilarCmpRefInstances( _self.parentnodeobject._id, this.matryoshkanodeobject._id );


                // let message = "<h3 style='color:white;width:230px;margin:20px 0 0;text-align:center;'>Confirmed</h3><hr><ul style='color:white;'><li><span style='display:inline;'><b>sent: </b></span><span>" + _self.matryoshkanodeobject.name + 
                //               "</span></li><li><span style='display:inline;'><b>into: </b></span><span>" + _self.parentnodeobject.name +
                //               "</span></li><li><span style='display:inline;'><b>method: </b></span><span>" + "copy/paste" +  
                //               "</span></li></ul>";
                
                // _self.modalprompter.emit( message );
        // });
    }

}
