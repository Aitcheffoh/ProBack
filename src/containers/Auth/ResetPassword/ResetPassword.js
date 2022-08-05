import React, {Component} from 'react';
import swal from 'sweetalert';
import Layout from '../../../components/Auth/Layout';
import classes from './ResetPassword.css';
import Input from '../../../components/Nifty/UI/Input/Input';
import Button from '../../../components/Nifty/UI/Button/Button';
import {Link} from 'react-router-dom';
import {Httpphp} from '../../../axiosInstances';
//import axios from 'axios';
class ResetPassword extends Component{

   constructor(props) {
    super(props);
    this.state = {value: '', revalue: '',token:'',token2:''};
    this.PassInput = React.createRef();
    this.RePassInput = React.createRef();
    this.focus = this.focus.bind(this);
    this.handleChangeV = this.handleChangeV.bind(this);
    this.handleChangeP = this.handleChangeP.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
      //console.log(this.props.location.search);
      //debugger;
        if(this.props.location.search!==''){
            if(this.props.location.search.split('?').length>1){
                //preguntar si llego algun dato
                var data = this.props.location.search.split('?')[1];
                if(data.split('&').length>1){
                    //preguntar si llego la division de los dos datos
                    if(data.split('&')[0].split('=').length>1 && data.split('&')[1].split('=').length>1){
                        //preguntar si los datos no sean nullos (que se tenga la division, pero un o los dos no tiene datos)
                        if(data.split('&')[0].split('=')[1]!="" && data.split('&')[1].split('=')[1]!=""){
                            //preguntar si los datos que trae los tokens no son vacias, guardar y validar por php si son correctas
                            //si son correctas no cambia la pagina y al cambiar la clave correctamente crea la sesion
                            // y redirige
                            if(data.split('&')[0].split('=')[0]=='token' && data.split('&')[1].split('=')[0]=='token2'){
                                //aca post
                                this.setState({token:data.split('&')[0].split('=')[1]});
                                this.setState({token2:data.split('&')[1].split('=')[1]});
                                //console.log(data.split('&')[0].split('=')[1]+" "+data.split('&')[1].split('=')[1]);
                                //debugger;
                                this.validarDatos(data.split('&')[0].split('=')[1],data.split('&')[1].split('=')[1]);
                                
                            }else{
                                //nombre datos diferentes
                                //console.log("nombre datos diferentes");
                                window.location="/"; 
                            }
                            
                        }else{
                            //uno o los dos tokens son vacios y redirigir al index
                            //console.log("no vino uno de los tokens");
                            window.location="/"; 
                        }
                        
                    }else{
                        //uno o los dos tokens estan null y redirigir al index
                        //console.log("no vino uno de los tokens");
                        window.location="/"; 
                    }
        
                }else{
                    //trae 1 token y y redirigir al index
                    //console.log("datos traidos incompletos falta");
                    window.location="/"; 
                }
            }
            else{
                //no trajo ningun dato y redirigir al index
                //console.log("ningun datos traidos ");
                window.location="/"; 
            }
            
        }else{
            window.location="/"; 
        } 

        
     }

     validarDatos(token,token2){
         try {
              let formData = new FormData();
                formData.append('token', token);
                formData.append('token2', token2);
                
                Httpphp.post(
                   "/php-prueba/verifyTokens.php",
                    formData,
                    {
                        headers: {
                            "Content-type": "multipart/form-data",
                        },                    
                    }
                )
                .then(res => {
                    //debugger;
                    if(res.data == "OK"){
                        //console.log('OK');
                    }else if(res.data == 'NO'){
                        //No paso la verificacion y redirigir al index
                        //console.log("No paso la verificacion"); 
                        window.location="/";                                   
                    }
                })
                .catch(err => {
                    //// console.log(err);
                })

          } catch (error) {
            //// console.log(error);
          }
     }
   handleChangeV(event) {
   this.setState({value: event.target.value});
  }
  handleChangeP(event) {
    this.setState({revalue: event.target.value});
  }

   handleSubmit= (event) => {
    event.preventDefault();
   	//el evento cuando se unde el boton
       if(this.validate(this.state)){
           let token = this.state.token;
           let token2 = this.state.token2;
           let value = this.state.value;
           let revalue = this.state.revalue;
            try {
                  let formData = new FormData();
                    formData.append('token', token);
                    formData.append('token2', token2);
                    formData.append('value', value);
                    formData.append('revalue', revalue);

                    Httpphp.post(
                       "/php-prueba/ChangePassword.php",
                        formData,
                        {
                            headers: {
                                "Content-type": "multipart/form-data",
                            },                    
                        }
                    )
                    .then(res => {
                        if(res.data.toString() == 'OK'){
                            swal( 'Clave cambiada correctamente!','Inicia sesión por favor');
                            var reset =document.getElementById("password");
                            reset.value = "";
                            reset =document.getElementById("repassword");
                            reset.value = "";
                            window.location="/"; 
                        }else if(res.data.toString() == 'NO'){
                            swal( 'Clave no pudo ser cambiada','Por favor contactarse con el administrador');
                        }
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
    this.PassInput.current.focus();
    this.RePassInput.current.focus();
  }
   validate(values) {
      var patron = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*#?&])([A-Za-z\d$@$!%*#?&]|[^ ]){8,15}$/;
      if (!values.value) {//debugger;
          swal("Por favor no dejar campo vacio de contraseña");
        return false;
      }else if(!values.revalue){//debugger;
          swal("Por favor no dejar campo vacio de contraseña");
        return false
      }else if(values.revalue=='' || values.value==''){//debugger;
        swal("Las contraseña no puede ser vacia");  
        return false
      }else if(values.revalue.length<8 || values.value.length<8){//debugger;
        swal("Las contraseña no puede ser menor de 8 caracteres");
        return false
      }else if(values.value!=values.revalue){//debugger;
        swal("Las contraseñas no son iguales");
        return false
      }else if(!patron.test(values.value)){//debugger;
        swal("Recuerda que la contraseña debe estar combinada minimo con letras, números y símbolos.");
        return false
      }//debugger;
      return true;
    }

    render(){

        return(
            <Layout>
                <div className="panel-body">
               <div className={['mar-ver', 'pad-btm', classes.TitleSection].join(' ')}>
                  <h1 className="h3">Recupera tu contraseña</h1>
                  <p className="pad-btm">Ingrese su nueva contraseña y repitala para verificarla</p>
               </div>
                  <form encType="multipart/form-data">
                      <div className="form-group ">
                          <input id="password" name="password" type="password" ref={this.PassInput} value={this.state.value} onChange={this.handleChangeV} placeholder="Escriba Contraseña"className="form-control" required/>
                      </div>
                      <div className="form-group ">
                          <input id="repassword" name="repassword" type="password" ref={this.RePassInput} value={this.state.revalue} onChange={this.handleChangeP} placeholder="Re-escriba Contraseña"className="form-control" required/>
                          <small id="passwordHelp" class="form-text text-muted">*Ocho caracteres como mínimo combinados con letras, números y símbolos.</small>
                      </div>
                      <div className="form-group text-right">
                          <Button onClick={this.handleSubmit} type="danger">Restablecer contraseña</Button>
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

export default ResetPassword;