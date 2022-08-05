import React, {Component} from 'react';
import Header from "../../components/Dashboard/Header/Header";
import Navbar from "../../components/Dashboard/Navbar/Navbar";
import { connect } from "react-redux";
import authActions from "../../store/actions/auth.actions";
import { Route, Switch, withRouter, Redirect } from "react-router-dom";
import DashboardHome from './Home';
import StatisticsComponent from './Statistics';

class Dashboard extends Component {
  state = {
      largeMenu: true,
  }

  componentDidMount(){
    if(window.innerWidth <= 600){
      this.toggleMenu();
    }
  }

  toggleMenu = () => {
    this.setState({
      ...this.state,
      largeMenu: !this.state.largeMenu
    });
  };

  has_token_valid() {
    const token = window.localStorage.getItem('token');
    if(token === '') {
      return false;      
    }
    return true;
  }

  ////////////02-11-2021//////////////////////////
  verify_time_token(){
    if(!this.has_token_valid() || !localStorage.getItem("time_token") || typeof localStorage.getItem("time_token") === 'undefined'){
      if(localStorage.getItem("user") != null){
        //si alguno tiene version vieja y nunca ha cerrado para que le cierre la sesion y mas nunca se utilizara esto
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.clear();
        window.localStorage.clear();
        window.location="/"; 
      }
      return false;
    }
    const time_token = new Date(localStorage.getItem("time_token"));
    const fecha2 = new Date();
    const resta = fecha2.getTime() - time_token.getTime();//43200000 12 horas 60000 1 minuto 
    if(resta>43200000){
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem("sesiones");//nuevo
      localStorage.removeItem("time_token");//nuevo
      localStorage.clear();
      window.localStorage.clear();
      window.location="/"; 
    }
    return false;
  }
  ////////////02-11-2021//////////////////////////
  render() { 
    // Validamos que la sesión en el navegador este activa
    let hasToken = localStorage.getItem('token');
    if (hasToken === null) {
      window.location.reload(true);
      return  (<Redirect to="/" />);
    }
    this.verify_time_token()//aca se podria poder un validador para el tiempo de sesion
    return (
      <div
        id="container"
        className={[
          "effect",
          "aside-float",
          "aside-bright",
          this.state.largeMenu ? "mainnav-lg" : "mainnav-sm"
        ].join(" ")}>
        <Header
          largeMenu={this.state.largeMenu}
          user={this.props.auth.user}
          actions={{ logout: this.props.logout, toggleMenu: this.toggleMenu }}
        />
        <Navbar market={this.state.market} changeMarket={this.changeMarket} />
        <div className="main-content" style={{marginTop: '-60px'}}>
          <Switch>
            <Route path="/dashboard/estadisticas/" component={() => <StatisticsComponent paddingTop='8' />} />
            <Route exact path="/dashboard/:market/" component={DashboardHome} />
            <Redirect to="/dashboard/spot/"></Redirect>
          </Switch>
        </div>
      </div>)
  }
}

const mapDispatchToProps = dispatch => {
  return {
    logout: () => dispatch(authActions.logout())
  };
};

const mapStateToProps = state => {
  return {
    auth: state.auth
  };
};

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard));