import { authActionTypes } from "../actions/actionTypes";
import {HttpNode } from "../../axiosInstances";
import md5 from 'md5';
import Terminos from "../../components/HomePage/TerminosCondiciones/Terminos";

export const login = (user, password, history) => {
    var sesion = 0;
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem("sesiones");//nuevo
    localStorage.removeItem("time_token");//nuevo
    
    const usu = localStorage.getItem("username");
    const ses = localStorage.getItem("sesiones");
    return dispatch => {
        dispatch(authStart());
        HttpNode.post(`/seticap/api/users/login`,  {usr: user, pwd: md5(password)} )
            .then(response => {
                if(response.data.status === 'success'){

                    if (user != usu && ses != 1){
                        localStorage.setItem("token", md5(password));
                        localStorage.setItem("user", response.data.user.name);
                        localStorage.setItem("username", user);
                        sesion = 1;
                        localStorage.setItem("sesiones", sesion);
                        localStorage.setItem("time_token", new Date());
                        response.data.token = md5(password);
                        dispatch(authFinished({token: md5(password), user: response.data.user.name}));
                        //console.log('OKLog');

                        // Aceptación de terminos y condiciones
                        var m_confirmado = response.data.user.fecha_confirmacion
                        if(m_confirmado == null) {
                            // Lanzar acá ventana de aceptación terminos y condiciones
                        Terminos()
                        HttpNode.post(`/seticap/api/user/terminos`,  {id: response.data.user.id});
                        }

                        history.push("/dashboard/");
                    }
                    else{//// console.log('Usuario ya ingreso');
                        //dispatch(authError("Usuario ya ingreso" + "USUARIO:" + response.data.user.name + "SESION" + ses));
                        dispatch(authError("Ya existe un inicio de sesión activo"));
                        localStorage.removeItem('sesiones');
                        dispatch(logout());
                    }
                }else if(response.data.status === 'INVALID'){
                    //// console.log('Usuario/Contraseña incorrectos');
                    dispatch(authError("Usuario/Contraseña incorrectos"));

                }else if(response.data.status === 'EXPIRED'){
                    //// console.log('La cuenta ha expirado');
                    dispatch(authError("La cuenta ha expirado"));

                }else{
                    //// console.log('Cuenta de usuario Inactiva');
                    dispatch(authError("Cuenta de usuario Inactiva"));
                    
                }
            });
    };
};

const authStart = () => {
    return {
        type: authActionTypes.LOGIN_START
    };
};

const authFinished = auth => {
    return {
        type: authActionTypes.LOGIN_SUCCESS,
        payload: auth
    };
};

const autoLogin = () => {
    return {
        type: authActionTypes.LOGIN_INITIAL_CHECK
    };
};

const authError = error => {
    return {
        type: authActionTypes.LOGIN_ERROR,
        payload: error
    };
};

const authCheckLogin = () => {
    return dispatch => {
        dispatch(autoLogin());
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("username");
        const sesion = localStorage.getItem("sesiones");
        if (token) {
            HttpNode.get(`/seticap/api/users/${user}/${token}/`).then(({ data }) => {
                if (data.status === 'success') {
                    const user = localStorage.getItem("user");
                    dispatch(authFinished({ token, user }));
                } else {
                    dispatch(logout());
                }
            });
        }else{
            dispatch(logout());
        }
    };
};
const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem("sesiones");//nuevo
    localStorage.removeItem("time_token");//nuevo
    localStorage.clear();
    window.localStorage.clear();
    return {
        type: authActionTypes.LOGOUT
    };
};

export default {
    login: login,
    checkLogin: authCheckLogin,
    logout: logout
};
