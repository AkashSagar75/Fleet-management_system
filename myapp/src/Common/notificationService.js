import {toast} from 'react-toastify'
import Swal from 'sweetalert2';

class NotifictionServices {
    success(message){
        toast.success(message,{
            position:'top-right',
            autoClose:3000
        })
    }
    error(message){
         toast.error(message, {
             position:'top-right',
             autoClose:3000
         })
    }
    warning(message){
         toast.warning(message,{
             position: "top-right",
      autoClose: 3000,
         })
    }
    info(message){
         toast.info(message,{
             position: "top-right",
      autoClose: 3000,
         })
    }
    async confirm({
         title,
    text,
    confirmButtonText = "Yes",
    }){
return await Swal.fire({
    title,
      text,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText,
})
    }
    
}
 const  notificationService  = new NotifictionServices();
 export default  notificationService;
