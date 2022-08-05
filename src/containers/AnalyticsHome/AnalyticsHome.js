import React, {Component} from 'react';
import HomeHeader from "../../components/HomePage/Header/Header";
import PreFooter from '../../components/shared/PreFooter/PreFooter';
import Footer from "../../components/shared/Footer/Footer";
import Analytics from '../../components/HomePage/Analytics/Analytics';

class AnalyticsHome extends Component{

  render(){
      var html = null;
      html = <div className="row"><Analytics/></div>
           
      return(
          <div id="container" className="home_page">
              <HomeHeader auth={this.props.auth} />
              <div className="boxed">
                  <div className="container-fluid">
                  {html}
                  <PreFooter></PreFooter>
                  <Footer></Footer>
                  </div>
              </div>
          </div>
      )
  }

}


export default AnalyticsHome;