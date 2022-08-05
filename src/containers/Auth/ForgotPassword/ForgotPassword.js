import React, {Component} from 'react';
import swal from 'sweetalert';
import Layout from '../../../components/Auth/Layout';
import classes from './ForgotPassword.css';
import Input from '../../../components/Nifty/UI/Input/Input';
import Button from '../../../components/Nifty/UI/Button/Button';
import {Link} from 'react-router-dom';
import {Httpphp} from '../../../axiosInstances';
//import axios from 'axios';
class ForgotPassword extends Component{

   constructor(props) {
    super(props);
    this.state = {value: ''};
    this.emailInput = React.createRef();
    this.focus = this.focus.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

   handleChange(event) {
    this.setState({value: event.target.value});
  }

   handleSubmit= (event) => {
    event.preventDefault();
   	//el evento cuando se unde el boton
   	
       if(this.validate(this.state)){
           //console.log('A name was submitted: ' + this.state.value);//debugger;
           let email = this.state.value;
            try {
                  let formData = new FormData();
                    formData.append('email', email);

                    Httpphp.post(
                       //`http://localhost:8080/php-back-web/restPassword.php`,
                       "/php-prueba/restPassword.php",
                       //"http://set-icap.com.co/php-prueba/restPassword.php",
                        formData,
                        {
                            headers: {
                                "Content-type": "multipart/form-data",
                            },                    
                        }
                    )
                    .then(res => { //debugger;
                        if(res.data.toString() == 'Usuario no existe!'){
                            swal( 'Correo no enviado!','Por favor verifica tu correo ');
                        }else if(res.data.toString() == 'Error al insertar token'){
                            swal( 'Correo no enviado!','Hay un error en el sistema, por favor contactar con administrador ');
                        }else{
                            swal( 'Correo enviado con exito!','Su correo ha sido bloqueado por seguridad! Si demora en llegar, por favor revise su bandeja de entrada');
                        }
                        var reset =document.getElementById("email");
                        reset.value = "";
                    })
                    .catch(err => {
                        //// console.log(err);
                    })

              } catch (error) {
                //// console.log(error);
              }

       }else{

           this.focus();
       }
  }
  focus() {
    this.emailInput.current.focus();
  }
   validate(values) {
      if (!values.value) { //debugger;
          swal("Porfavor no dejar campo vacio de correo");
        return false;
      } else if (!/\S+@\S+\.\S+/.test(values.value)) {
        return false;
      }
      return true;
    }


    render(){

        return(
            <Layout>
                <div className="panel-body">
               <div className={['mar-ver', 'pad-btm', classes.TitleSection].join(' ')}>
                  <h1 className="h3">¿Olvidaste tu contraseña?</h1>
                  <p className="pad-btm">Ingrese su correo electrónico para recuperar su contraseña</p>
               </div>
                  <form encType="multipart/form-data">
                      <div className="form-group ">
                          <input id="email" name="email" type="email" ref={this.emailInput} value={this.state.value} onChange={this.handleChange} placeholder="Email"className="form-control" required/>
                      </div>
                      <div className="form-group text-right">
                          <Button onClick={this.handleSubmit} type="danger">Restablezca la contraseña</Button>
                      </div>
                  </form>
                  <div className="pad-top" style={{textAlign: 'center'}}>
                  <Link to="/auth/login/" className={['btn-link', 'text-bold'].join(' ')}>Regresar al inicio de sesión</Link>
                  </div>
              </div>
            </Layout>
        )
    }
}

export default ForgotPassword;