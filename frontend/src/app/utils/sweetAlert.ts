import Swal from "sweetalert2";

export default class SweetAlert {
  static tinyAlert(title?: string | undefined) {
    Swal.fire(title);
  }

  static successAlert(title?: string | undefined, text?: string | undefined) {
    Swal.fire({
      icon: 'success',
      title: title,
      text: text,
      confirmButtonText: 'OK',
      confirmButtonColor: '#0098da',
    });
  }

  static errorAlert(title?: string | undefined, text?: string | undefined){
    Swal.fire({
      icon: 'error',
      title: title,
      text: text,
      confirmButtonText: 'OK',
      confirmButtonColor: '#0098da',
    });
  }

  static confirmationAlert(title: string, text: string, icon: any): Promise<any> {
    return Swal.fire({
      title: title,
      text: text,
      icon: icon,
      showCancelButton: true,
      confirmButtonText: 'Yes, go ahead.',
      confirmButtonColor: '#0098da',
      cancelButtonText: 'No, let me think',
      cancelButtonColor: '#0098da',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Deleted!', 'Deleted successfully.', 'success');
        return true; 
      } else if (result.isDismissed) {
        Swal.fire('Cancelled', 'Product still in our database', 'error');
        return false;
      }
      return false; 
    });
  }

  // static confirmationAlert(title: string, text: string, icon: any ) {
  //   Swal.fire({
  //     title: title,
  //     text: text,
  //     icon: icon,
  //     showCancelButton: true,
  //     confirmButtonText: 'Yes, go ahead.',
  //     confirmButtonColor: '#0098da',
  //     cancelButtonText: 'No, let me think',
  //     cancelButtonColor: '#0098da',
  //   }).then((result) => {
  //     if (result.value) {
  //       Swal.fire('Deleted!', 'Deleted successfully.', 'success');
  //     } else if (result.dismiss === Swal.DismissReason.cancel) {
  //       //Swal.fire('Cancelled', 'Product still in our database', 'error');
  //     }
  //   });
  // }


  
}
