import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { ActionClicked, Actions } from '../models';

@Injectable({
  providedIn: 'root',
})
export class SweetalertService {
  constructor() {}

  success(message: string): void {
    Swal.fire({
      icon: 'success',
      title: 'Successfully',
      text: message,
      showConfirmButton: false,
      timer: 2000,
    });
  }

  error(message: string): void {
    Swal.fire({
      icon: 'error',
      title: 'ERROR',
      text: message,
      confirmButtonText: 'OK',
    });
  }

  async question(message: string): Promise<Actions> {
    return Swal.fire({
      icon: 'question',
      title: 'Question',
      text: message,
      confirmButtonText: 'Yes',
      showCancelButton: true,
      cancelButtonText: 'No',
    }).then(result => {
      if (result.isConfirmed) {
        return ActionClicked.Yes;
      } else {
        return ActionClicked.No;
      }
    });
  }

  info(message: string): void {
    Swal.fire({
      icon: 'info',
      title: 'Information',
      text: message,
      confirmButtonText: 'OK',
    });
  }

  warning(message: string): void {
    Swal.fire({
      icon: 'warning',
      title: 'Warning',
      text: message,
      confirmButtonText: 'OK',
    });
  }
}
