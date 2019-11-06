import { ErrorHandler, Injectable } from '@angular/core';
// import { ToastrService } from 'ngx-toastr';

@Injectable()
export class AppErrorHandler implements ErrorHandler {
    constructor(
        // private toastr: ToastrService
        ) { }
    handleError(error) {
        // add a toast 
        // alert('An unexpected error occurred');
        // log to console
        console.log(error);
        console.log(error.error.message);
        // setTimeout(() => this.toastr.error(error.error.message));

    }

    // showToaster(error){
    //     this.toastr.error(error)
    // }
}
