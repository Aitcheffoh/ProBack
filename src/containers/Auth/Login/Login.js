import React, { Component } from "react";
import Button from "../../../components/Nifty/UI/Button/Button";
import classes from "./Login.css";
import Layout from "../../../components/Auth/Layout";
import { Link } from "react-router-dom";
import { withFormik, Field } from "formik";
import { connect } from "react-redux";
import actions from "../../../store/actions/auth.actions";
import Recaptcha from 'react-recaptcha';
import IconButton from "@material-ui/core/IconButton";
import InputLabel from "@material-ui/core/InputLabel";
import Visibility from "@material-ui/icons/Visibility";
import InputAdornment from "@material-ui/core/InputAdornment";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import Input from "@material-ui/core/Input";
import { useState} from 'react';

class LoginContainer extends Component {

    constructor(propse){
        super(propse)
        this.verifyLogin();
        this.captureR = this.captureR.bind(this);
        this.recaptchaLoaded = this.recaptchaLoaded.bind(this);
        this.expiredCallback = this.expiredCallback.bind(this);
        this.verifyCallback = this.verifyCallback.bind(this);
        this.state = {
            isVerified:false,
            password: "",
            showPassword: false,
            state: true,
       }
       this.handleClickShowPassword = this.handleClickShowPassword.bind(this);
       this.handlePasswordChange = this.handlePasswordChange.bind(this);
       this.props.values.state = false;
    };
 

   handleClickShowPassword = () => {
    //this.state.showPassword= !this.state.showPassword;
    this.setState({showPassword: !this.state.showPassword});
  };
    
   handlePasswordChange = (event) => {
     //this.state.password = event.target.value ;//debugger;
     this.setState({password: event.target.value});
  };
  
   captureR() { 
           if(this.state.isVerified){
              //console.log('funciona recaptcha');
            }else{
               //console.log('NO funciona recaptcha');
               //throw new Error('This is not an error. This is just to abort javascript');
            }
        }

  recaptchaLoaded(){
    //console.log('captcha loaded correctly');
  }

  expiredCallback(){
    this.setState({
          isVerified:false,
          state:true
    })
      this.props.values.state = false;
    //console.log('expired  captcha');
  }
  verifyCallback(response){
    
          if(response){
              this.setState({
                  isVerified:true,
                  state:false
            })
              this.props.values.state = true;
          }
  }

  verifyLogin(){
    //console.log(localStorage.getItem("sesiones") );
    if(localStorage.getItem("sesiones") && typeof localStorage.getItem("sesiones") !== 'undefined' && localStorage.getItem("sesiones") !=null){
      window.location="/"; 
    }
  }

  render() {
    
    return (
      <Layout>
        {this.props.loginError ? <div className="alert alert-danger">{this.props.loginError}</div> : null}


        <div className="panel-body">
          <div
            className={["mar-ver", "pad-btm", classes.TitleSection].join(" ")}
          >
            <h1 className="h3">Iniciar sesión</h1>
            <p>Iniciar sesión en tu cuenta de SET-ICAP | FX</p>
          </div>
          <form onSubmit={this.props.handleSubmit}>
            <div
              className={[
                "form-group",
                this.props.errors.username && this.props.touched.username ? "has-error" : ""
              ].join(" ")}
            >
              <Field
                name="username"
                placeholder="Usuario"
                className="form-control"
                maxLength="15"
              />
              {this.props.errors.username &&
                this.props.touched.username && (
                  <div className="help-block">{this.props.errors.username}</div>
                )}
            </div>
            <div
              className={[
                "input-group",
                this.props.errors.password && this.props.touched.password ? "has-error" : ""
              ].join(" ")}
            >
              <Field
                type={this.state.showPassword ? "text" : "password"}
                /*onChange={this.handlePasswordChange}
                value={this.state.password}*/
                name="password"
                id="password"
                placeholder="Contraseña"
                className="form-control"
                maxLength="15"
              />
              <IconButton
                onClick={this.handleClickShowPassword}
                onMouseDown={this.handleMouseDownPassword}
              >
                {this.state.showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
                

              {this.props.errors.password &&
                this.props.touched.password && (
                  <div className="help-block">{this.props.errors.password}</div>
                )}
            </div>
            <div className="checkbox pad-btm text-left">
              <label>
                <Field name="rememberme" type="checkbox" />
                Recuérdame
              </label>
            </div>
           <Recaptcha
            sitekey="6Ldu0rgZAAAAAM0yru80ZJLhNZBy_y5jGwz_qdC9"
            render="explicit"
            verifyCallback={this.verifyCallback}
            onloadCallback={this.recaptchaLoaded}
            expiredCallback={this.expiredCallback}
            />
            {/* <Button type="submit">Iniciar sesión</Button> */}
            <Button type="submit" onClick={this.captureR} disabled={this.state.state}>Iniciar sesión</Button>
            <br></br>
     
          </form>
        </div>

        <div className="pad-all">
          <Link to="/auth/recuperar-contrasena/" className="btn-link pull-left">
            ¿Olvidaste tu contraseña?
          </Link>
          <Link to="/auth/registro/" className="btn-link pull-right">
            Crear nueva cuenta
          </Link>
        </div>
      </Layout>
    );
  }
}
var state_;
const mapPropsToValues = props => {
  
  return {
    username: props.username || "",
    password: props.password || "",
    rememberme: props.rememberme || "",
    state: props.state || "",
  };
};

const mapDispatchToProps = dispatch => {
  return {
    login: (username, password, history,state) => dispatch(actions.login(username, password, history,state))
  };
};

const mapStateToProps = state => ({
  loginError: state.auth.error
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  withFormik({
    mapPropsToValues: mapPropsToValues,
    validate: values => {//debugger;
      const errors = {};
      if (!values.username) {
        errors.username = "El usuario es requerido";
      }
      if (!values.password) {
        errors.password = "Por favor digite una contraseña";
      }
      return errors;
    },
    handleSubmit(values, cmp) {
      if(document.readyState == "loaded" || document.readyState == "interactive" || document.readyState == "complete"){//debugger;
        if(!values.state){
          //console.log('no ah dado click al reCAPTCHA');
          return false;
        }
      }
      cmp.props.login(values.username, values.password, cmp.props.history);
    }
  })(LoginContainer)
);
