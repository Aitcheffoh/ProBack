
import swal from 'sweetalert';



const Terminos = () => {
  
  const terminos=document.createElement('div')
  terminos.innerHTML= "</br>Acepto las <a style='font-size:16px;color:#25476a;font-weight:bold' href='https://set-icap.com/Descargas/Autorización Tratamiento de Datos personales Set-Icap Fx.pdf'>Políticas Tratamiento de Datos personales SET-ICAP FX</a>"
+"</br></br>Acepto <a style='font-size:16px;color:#25476a;font-weight:bold' href='https://set-icap.com/terminos-y-condiciones.pdf'>Terminos y Condiciones.</a>" 
   return (
    swal({
      title: "Aceptar Terminos y Condiciones",
      content:terminos,
      closeOnClickOutside: false,
      closeOnEsc:false,
      icon: "warning",
      button:"ACEPTAR",
      dangerMode: false,
      className : "swal-button--confirm",
    })
    /*.then((willDelete) => {
      if (willDelete) {
        swal("¡Aceptaste terminos y condiciones correctamente!", {
          icon: "success",
        });
      } 
    })*/
  )
}

export default Terminos;