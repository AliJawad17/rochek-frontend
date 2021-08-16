import { Component, OnDestroy } from "@angular/core";
import { ICellRendererAngularComp } from "ag-grid-angular";
import { ICellRendererParams, IAfterGuiAttachedParams } from "ag-grid-community";

@Component({
    selector: 'btn-cell-renderer',
    template: `
      <button class="btn btn-success" (click)="btnClickedHandler($event)">Add</button>
    `,
  })
  export class BtnCellRenderer implements ICellRendererAngularComp, OnDestroy {
    refresh(params: ICellRendererParams): boolean {
        throw new Error("Method not implemented.");
    }
    afterGuiAttached?(params?: IAfterGuiAttachedParams): void {
        throw new Error("Method not implemented.");
    }
    private params: any;
  
    agInit(params: any): void {
      this.params = params;
    }
  
    btnClickedHandler(e) {
        console.log(this.params)
        this.params.clicked(this.params.data);
    }
  
    ngOnDestroy() {
      // no need to remove the button click handler 
      // https://stackoverflow.com/questions/49083993/does-angular-automatically-remove-template-event-listeners
    }
  }