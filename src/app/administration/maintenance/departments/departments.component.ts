import { Component, Injector } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import {
  PagedListingComponentBase,
  PagedRequestDto
} from 'shared/paged-listing-component-base';
import {
  DepartmentServiceProxy,
  DepartmentDto,
  DepartmentDtoPagedResultDto
} from '@shared/service-proxies/service-proxies';
import { CreateDepartmentDialogComponent } from './create-department/create-department-dialog.component';
import { UpdateDepartmentDialogComponent } from './update-department/update-department-dialog.component';

class PagedDepartmentRequestDto extends PagedRequestDto {
  keyword: string;
  sorting: string;
}

@Component({
  templateUrl: './departments.component.html',
  animations: [appModuleAnimation()]
})
export class DepartmentsComponent extends PagedListingComponentBase<DepartmentDto> {
  departments: DepartmentDto[] = [];
  keyword = '';
  advancedFiltersVisible = false;

  constructor(
    injector: Injector,
    private _departmentService: DepartmentServiceProxy,
    private _modalService: BsModalService
  ) {
    super(injector);
  }

  createDepartment(): void {
    this.showCreateOrEditDepartmentDialog();
  }

  editDepartment(department: DepartmentDto): void {
    this.showCreateOrEditDepartmentDialog(department.id);
  }

  clearFilters(): void {
      this.keyword = '';
    this.getDataPage(1);
  }

  protected list(
    request: PagedDepartmentRequestDto,
    pageNumber: number,
    finishedCallback: Function
  ): void {
    request.keyword = this.keyword;

    this._departmentService
      .getAll(
          request.keyword,
          request.sorting,
          request.skipCount,
          request.maxResultCount
      )
      .pipe(
        finalize(() => {
          finishedCallback();
        })
      )
      .subscribe((result: DepartmentDtoPagedResultDto) => {
        this.departments = result.items;
        this.showPaging(result, pageNumber);
      });
  }

  protected delete(department: DepartmentDto): void {
      abp.message.confirm(
          this.l('UserDeleteWarningMessage', department.name),
      undefined,
      (result: boolean) => {
        if (result) {
            this._departmentService.delete(department.id).subscribe(() => {
            abp.notify.success(this.l('SuccessfullyDeleted'));
            this.refresh();
          });
        }
      }
    );
  }

  private showCreateOrEditDepartmentDialog(id?: number): void {
    let createOrEditDepartmentDialog: BsModalRef;
    if (!id) {
      createOrEditDepartmentDialog = this._modalService.show(
        CreateDepartmentDialogComponent,
        {
          class: 'modal-lg',
        }
      );
    } else {
      createOrEditDepartmentDialog = this._modalService.show(
        UpdateDepartmentDialogComponent,
        {
          class: 'modal-lg',
          initialState: {
            id: id,
          },
        }
      );
    }

    createOrEditDepartmentDialog.content.onSave.subscribe(() => {
      this.refresh();
    });
  }
}
