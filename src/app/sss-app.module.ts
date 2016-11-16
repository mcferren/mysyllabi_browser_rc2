import { BrowserModule }            from '@angular/platform-browser';
import { NgModule }                 from '@angular/core';
import { CommonModule }             from '@angular/common';
import { FormsModule }              from '@angular/forms';
import { HttpModule }               from '@angular/http';

import { SSSAccountComponent }      from './components/sss-account.component';
import { SSSAppComponent }          from './components/sss-app.component';
import { SSSNodeComponent }         from './components/sss-node.component';
import { SSSBasicComponent }        from './components/sss-basic.component';
import { SSSButtonComponent }       from './components/sss-button.component';
import { SSSCalendarComponent }     from './components/sss-calendar.component';
import { SSSCardComponent }         from './components/sss-card.component';
import { SSSCoinComponent }         from './components/sss-coin.component';
import { SSSColumnComponent }       from './components/sss-column.component';
import { SSSEditComponent }         from './components/sss-edit.component';
import { SSSEggShellComponent }     from './components/sss-eggshell.component';
import { SSSGridComponent }         from './components/sss-grid.component';
import { SSSIframeComponent }       from './components/sss-iframe.component';
import { SSSLinkComponent }         from './components/sss-link.component';
import { SSSListComponent }         from './components/sss-list.component';
import { SSSMenuComponent }         from './components/sss-menu.component';
import { SSSModalComponent }        from './components/sss-modal.component';
import { SSSRelayComponent }        from './components/sss-relay.component';
import { SSSTableComponent }        from './components/sss-table.component';
import { SSSTextAreaComponent }     from './components/sss-textarea.component';

import { SSSAccountService }        from './services/sss-account.service';
import { SSSAPIService }            from './services/sss-api.service';
import { SSSCalendarService }       from './services/sss-calendar.service';
import { SSSCategoryService }       from './services/sss-category.service';
import { SSSConfigService }         from './services/sss-config.service';
import { SSSDOMService }            from './services/sss-dom.service';
import { SSSNodeService }           from './services/sss-node.service';
import { SSSProxyService }          from './services/sss-proxy.service';
import { SSSRouterService }         from './services/sss-router.service';
import { SSSTabService }            from './services/sss-tab.service';


@NgModule({
    declarations: [
        SSSAccountComponent,
        SSSAppComponent,
        SSSBasicComponent,
        SSSButtonComponent,
        SSSCalendarComponent,
        SSSCardComponent,
        SSSCoinComponent,
        SSSColumnComponent,
        SSSEditComponent,
        SSSEggShellComponent,
        SSSGridComponent,
        SSSIframeComponent,
        SSSLinkComponent,
        SSSListComponent,
        SSSMenuComponent,
        SSSModalComponent,
        SSSNodeComponent,
        SSSRelayComponent,
        SSSTableComponent,
        SSSTextAreaComponent
    ],
    imports: [
        BrowserModule,
        CommonModule,
        FormsModule,
        HttpModule
    ],
    providers: [
        SSSAccountService,
        SSSAPIService,
        SSSCalendarService,
        SSSCategoryService,
        SSSConfigService,
        SSSDOMService,
        SSSNodeService,
        SSSProxyService,
        SSSRouterService,
        SSSTabService
    ],
    entryComponents: [
        SSSAccountComponent,
        SSSAppComponent,
        SSSBasicComponent,
        SSSButtonComponent,
        SSSCardComponent,
        SSSCalendarComponent,
        SSSCoinComponent,
        SSSColumnComponent,
        SSSEditComponent,
        SSSEggShellComponent,
        SSSGridComponent,
        SSSIframeComponent,
        SSSLinkComponent,
        SSSListComponent,
        SSSMenuComponent,
        SSSModalComponent,
        SSSNodeComponent,
        SSSRelayComponent,
        SSSTableComponent,
        SSSTextAreaComponent
    ],
    bootstrap: [
        SSSAppComponent
    ]
})

export class SSSAppModule { }
