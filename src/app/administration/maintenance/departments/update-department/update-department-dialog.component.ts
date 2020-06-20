import {
  Component,
  Injector,
  OnInit,
  EventEmitter,
  Output
} from '@angular/core';
import { finalize } from 'rxjs/operators';
import { BsModalRef } from 'ngx-bootstrap/modal';
import * as _ from 'lodash';
import { AppComponentBase } from '@shared/app-component-base';
import {
    DepartmentServiceProxy,
    DepartmentDto
} from '@shared/service-proxies/service-proxies';

@Component({
  templateUrl: './update-department-dialog.component.html'
})
export class UpdateDepartmentDialogComponent extends AppComponentBase
  implements OnInit {
    saving = false;
    department = new DepartmentDto();
  id: number;

  @Output() onSave = new EventEmitter<any>();

  constructor(
    injector: Injector,
    public _departmentService: DepartmentServiceProxy,
    public bsModalRef: BsModalRef
  ) {
    super(injector);
  }

  ngOnInit(): void {
      this._departmentService.get(this.id).subscribe((result) => {
          this.department = result;
    });
  }

  save(): void {
    this.saving = true;
      this._departmentService
          .update(this.department)
      .pipe(
        finalize(() => {
          this.saving = false;
        })
      )
      .subscribe(() => {
        this.notify.info(this.l('SavedSuccessfully'));
        this.bsModalRef.hide();
        this.onSave.emit();
      });
  }
}
