/*eslint no-control-regex: "off", no-invalid-regexp: "off"*/
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import { Http, HttpNode, AuthHttp } from "../../axiosInstances";
import CloseImage from '../../assets/img/moneda.png'
import Average from '../../assets/img/moneda.png'
import HomeHeader from "../../components/HomePage/Header/Header";
import DolarPrices from "../../components/HomePage/DolarPrices/DolarPrices";
import DolarAmmounts from "../../components/HomePage/DolarAmounts/DolarAmounts";
import News from "../../components/HomePage/News/News";
import Currencies from "../../components/HomePage/Currencies/Currency";
import BVCStock from "../../components/HomePage/BVCStock/BVCStock";
import StockIndex from '../../components/HomePage/StockIndex/StockIndex';
import DolarSpot from "../shared/DolarSpot/DolarSpot";
import classes from "./HomePage.css";
import Loader from '../../components/Nifty/UI/Loader/Loader';
import clockRewind from '../../assets/img/transaction.png';
import PreFooter from '../../components/shared/PreFooter/PreFooter';
import Footer from "../../components/shared/Footer/Footer";
import client from "../../assets/img/client.png";
import curvas from "../../assets/img/curvas.png";
import transaction from "../../assets/img/transaction.png";

const CURRENCY_REGEX = new RegExp(
  /(?<from>\w{3})\s+\/\s+(?<to>\w{3})\s+(?<value>[\d.]+)\s*(?<change>[\d.+-]+)/
);
/*const BVC_REGEX = new RegExp(
  /(?<stock>[A-Za-z]+)(?<stock_value>\d*\.*\d{1,3},\d{2})(?<stock_change>\-*\d+\.*\d*)/
);*/
const BVC_REGEX = new RegExp(
  /(?<stock>[A-Za-z-]+)(?<stock_value>\d*\.*\d{1,3},\d{2})(?<stock_change>\-*\d+\.*\d*)/
);
class HomePage extends Component {
  state = {
    dolarPrices: {},
    dolarAmmounts: {},
    closePrice: 0,
    avgPrice: 0,
    news: [],
    currencies: [],
    bvc: []
  };

  interval = null;

  mapDolarPrices = stats => {
    const dolarPrices = {
      trm: {
        price: stats.trm,
        change: stats.trmPriceChange
      },
      openPrice: {
        price: stats.openPrice,
        change: stats.openPriceChange
      },
      minPrice: {
        price: stats.minPrice,
        change: stats.minPriceChange
      },
      maxPrice: {
        price: stats.maxPrice,
        change: stats.maxPriceChange
      }
    };

    const newState = {
      ...this.state,
      dolarPrices: dolarPrices
    };
    this.setState(newState);
  };

  mapAmmountPrices = stats => {
    const ammountPrices = {
      totalAmmount: stats.totalAmmount,
      latestAmmount: stats.latestAmmount,
      avgAmmount: stats.avgAmmount,
      minAmmount: stats.minAmmount,
      maxAmmount: stats.maxAmmount,
      transactions: stats.transactions
    };
    const newState = {
      ...this.state,
      dolarAmmounts: ammountPrices
    };
    this.setState(newState);
  };

  mapNews = news => {
    const newState = {
      ...this.state,
      news: news
    };
    this.setState(newState);
  };

  mapCurrencyData = data => {
    const newState = {
      ...this.state,
      currencies: data
    };
    this.setState(newState);
  };

  mapBVCData = data => {
    const newState = {
      ...this.state,
      bvc: data
    };
    this.setState(newState);
  };

  componentDidMount() {
    this.verify_time_token();
    this.onMount();
    this.interval = setInterval(this.onMount.bind(this), 1000 * 60 * 1);
    this.beforeDimensions();//
    window.addEventListener("resize", this.updateDimensions);//nuevo 03-11-2021
  }
  ////////////////nuevo 03-11-2021//////////////////
  beforeDimensions(){
    if(document.getElementById("DolarPrices")!=null){
      if(window.innerWidth>1200){
        document.getElementById("DolarPrices").classList.remove('col-md-6');
        document.getElementById("DolarPrices").classList.add('col-md-3');
        document.getElementById("dolarAmmounts").classList.remove('col-md-6');
        document.getElementById("dolarAmmounts").classList.add('col-md-4');
        document.getElementById("stockDiv").classList.remove('col-md-6');
        document.getElementById("stockDiv").classList.add('col-md-5');

        document.getElementById("BVCStock").classList.remove('col-md-6');
        document.getElementById("BVCStock").classList.add('col-md-4');
        document.getElementById("StockIndexDiv").classList.remove('col-md-6');
        document.getElementById("StockIndexDiv").classList.add('col-md-4');
        document.getElementById("News").classList.remove('col-md-6');
        document.getElementById("News").classList.add('col-md-4');

        document.getElementById("cierreH").classList.remove('col-md-6');
        document.getElementById("cierreH").classList.add('col-md-3');
        document.getElementById("promedioH").classList.remove('col-md-6');
        document.getElementById("promedioH").classList.add('col-md-3');
        document.getElementById("info_relojH").classList.remove('col-md-12');
        document.getElementById("info_relojH").classList.add('col-md-6');
      }
      if(window.innerWidth<1200){
        document.getElementById("DolarPrices").classList.remove('col-md-3');
        document.getElementById("DolarPrices").classList.add('col-md-6');
        document.getElementById("dolarAmmounts").classList.remove('col-md-4');
        document.getElementById("dolarAmmounts").classList.add('col-md-6');
        document.getElementById("stockDiv").classList.remove('col-md-5');
        document.getElementById("stockDiv").classList.add('col-md-6');

        document.getElementById("BVCStock").classList.remove('col-md-4');
        document.getElementById("BVCStock").classList.add('col-md-6');
        document.getElementById("StockIndexDiv").classList.remove('col-md-4');
        document.getElementById("StockIndexDiv").classList.add('col-md-6');
        document.getElementById("News").classList.remove('col-md-4');
        document.getElementById("News").classList.add('col-md-6');

        document.getElementById("cierreH").classList.remove('col-md-3');
        document.getElementById("cierreH").classList.add('col-md-6');
        document.getElementById("promedioH").classList.remove('col-md-3');
        document.getElementById("promedioH").classList.add('col-md-6');
        document.getElementById("info_relojH").classList.remove('col-md-6');
        document.getElementById("info_relojH").classList.add('col-md-12');
      }
    }
  }

  updateDimensions() {
    //console.log("Window width: "+window.innerWidth+" and : "+document.getElementById("cierre"));
    if(document.getElementById("DolarPrices")!=null){
      if(window.innerWidth>1200){
        document.getElementById("DolarPrices").classList.remove('col-md-6');
        document.getElementById("DolarPrices").classList.add('col-md-3');
        document.getElementById("dolarAmmounts").classList.remove('col-md-6');
        document.getElementById("dolarAmmounts").classList.add('col-md-4');
        document.getElementById("stockDiv").classList.remove('col-md-6');
        document.getElementById("stockDiv").classList.add('col-md-5');

        document.getElementById("BVCStock").classList.remove('col-md-6');
        document.getElementById("BVCStock").classList.add('col-md-4');
        document.getElementById("StockIndexDiv").classList.remove('col-md-6');
        document.getElementById("StockIndexDiv").classList.add('col-md-4');
        document.getElementById("News").classList.remove('col-md-6');
        document.getElementById("News").classList.add('col-md-4');

        document.getElementById("cierreH").classList.remove('col-md-6');
        document.getElementById("cierreH").classList.add('col-md-3');
        document.getElementById("promedioH").classList.remove('col-md-6');
        document.getElementById("promedioH").classList.add('col-md-3');
        document.getElementById("info_relojH").classList.remove('col-md-12');
        document.getElementById("info_relojH").classList.add('col-md-6');
      }
      if(window.innerWidth<1200){
        document.getElementById("DolarPrices").classList.remove('col-md-3');
        document.getElementById("DolarPrices").classList.add('col-md-6');
        document.getElementById("dolarAmmounts").classList.remove('col-md-4');
        document.getElementById("dolarAmmounts").classList.add('col-md-6');
        document.getElementById("stockDiv").classList.remove('col-md-5');
        document.getElementById("stockDiv").classList.add('col-md-6');

        document.getElementById("BVCStock").classList.remove('col-md-4');
        document.getElementById("BVCStock").classList.add('col-md-6');
        document.getElementById("StockIndexDiv").classList.remove('col-md-4');
        document.getElementById("StockIndexDiv").classList.add('col-md-6');
        document.getElementById("News").classList.remove('col-md-4');
        document.getElementById("News").classList.add('col-md-6');

        document.getElementById("cierreH").classList.remove('col-md-3');
        document.getElementById("cierreH").classList.add('col-md-6');
        document.getElementById("promedioH").classList.remove('col-md-3');
        document.getElementById("promedioH").classList.add('col-md-6');
        document.getElementById("info_relojH").classList.remove('col-md-6');
        document.getElementById("info_relojH").classList.add('col-md-12');
      }
    }  
  }
  ////////////////nuevo 03-11-2021//////////////////

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  dias(){
    var now = new Date();
    var now2=''+now;
    var dias=0;

    if(now2.substring(0, 3)=='Sat'){
      dias=1;
    }else if(now2.substring(0, 3)=='Sun'){
      dias=2;
    }

    var semanaEnMilisegundos = 1000 * 60 * 60 * 24 * dias;
    let suma = now.getTime() - semanaEnMilisegundos;
    return new Date(suma);
  }
  ////////////02-11-2021//////////////////////////
  verify_time_token(){
    if(!localStorage.getItem("time_token") || typeof localStorage.getItem("time_token") === 'undefined'){
      if(localStorage.getItem("user") != null){
        //si alguno tiene version vieja y nunca ha cerrado para que le cierre la sesion y mas nunca se utilizara esto
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('username');
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
      window.location="/"; 
    }
    return false;
  }
  ////////////02-11-2021//////////////////////////

  onMount() {

    let now = this.dias();//let now = new Date();

    Http.get('/news/rss/').then(response => {
      const news = response.data.map(elem => {
        return {
          ...elem,
          body: elem.body,
          headline: elem.headline,
        }
      });
      this.mapNews(news);
    })

    const month = now.getMonth() < 9 ? `0${(parseInt(now.getMonth()) + 1)}` : parseInt(now.getMonth()) + 1
    //console.log(now.getFullYear()+'-'+month+'-'+now.getDate());
    

    HttpNode.post(`seticap/api/estadisticas/estadisticasPromedioCierre/`, {
      fecha: `${now.getFullYear()}-${month}-${now.getDate()}`,
      mercado: 71, // USD for now
      delay: 15
    }).then(response => {
      this.setState({
        ...this.state,
        closePrice: response.data.data.close,
        avgPrice: response.data.data.avg
      })
    });

    HttpNode.post(`seticap/api/estadisticas/estadisticasPrecioMercado/`, {
      fecha: `${now.getFullYear()}-${month}-${now.getDate()}`,
      mercado: 71, //USD for now
      delay: 15
    }).then(response => {
      this.setState({
        ...this.state,
        dolarPrices: {
          trm: { price: response.data.data.trm, change: response.data.data.trmchange },
          openPrice: { price: response.data.data.open, change: response.data.data.openchange },
          minPrice: { price: response.data.data.low , change: response.data.data.lowchange},
          maxPrice: { price: response.data.data.high, change: response.data.data.highchange }
        }
      })
    })

    HttpNode.post(`seticap/api/estadisticas/estadisticasMontoMercado/`, {
      fecha: `${now.getFullYear()}-${month}-${now.getDate()}`,
      mercado: 71, //USD for now.
      delay: 15
    }).then(response => {
      this.setState({
        ...this.state,
        dolarAmmounts: {
          totalAmmount: response.data.data.sum,
          latestAmmount: response.data.data.close,
          avgAmmount: response.data.data.avg,
          minAmmount: response.data.data.low,
          maxAmmount: response.data.data.high,
          transactions: response.data.data.count
        }
      })
    })

    AuthHttp.get(
      `seticap/api/bvc/indices/`
    ).then(response => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(response.data, "text/html");
      const table = [];
      var rows; //aca modifique
      if(typeof doc.getElementsByTagName('table')[0] !== 'undefined'){
        rows = doc.getElementsByTagName('table')[0].children[0].children;
      }else{
        rows = "";
      }
       
      Array.from(rows).forEach(tr => {
        const row = [];
        Array.from(tr.children).forEach((td, index) => {
          if(index == 2){
            row.push(td.children[0].innerHTML)
          }else{
            row.push(td.innerHTML.trim());
          }
        });
        table.push(row);
      })
      
      this.setState({
        ...this.state,
        stockTable: table
      })
    })

    HttpNode.get(
      `seticap/api/bvc/indiceIGBC/`
    ).then(response => {
      this.setState({
        ...this.state,
        stockChart: response.data
      })
    })

    HttpNode.get("seticap/api/cma/monedas/").then(response => {
      const parser = new DOMParser();
      
      let parserTable = parser.parseFromString(response.data, "text/html");
      const CurrencyData = Array.from(parserTable.getElementsByTagName("tr"))
        .map(tr => {
          if (CURRENCY_REGEX.test(tr.innerText)) {
            const results = CURRENCY_REGEX.exec(tr.innerText);
            return results.slice(1);
          }
          return null;
        })
        .filter(Boolean);
      this.mapCurrencyData(CurrencyData);
    });

    HttpNode.get("seticap/api/bvc/acciones/").then(response => {
      const parser = new DOMParser();
      let parserTable = parser.parseFromString(response.data, "text/html");
      const CurrencyData = Array.from(parserTable.getElementsByTagName("tr"))
        .map(tr => {
          if (BVC_REGEX.test(tr.innerText)) {
            const results = BVC_REGEX.exec(tr.innerText);
            return results.slice(1);
          }
          return null;
        })
        .filter(Boolean);
      this.mapBVCData(CurrencyData);
    });
  }

  render() {
    return (
      <React.Fragment>
        {this.props.auth.logginIn ? /*<Loader opacity="0.8"></Loader>*/null : null}
        <div id="container" className="home_page">
          <HomeHeader auth={this.props.auth} />
          <div className="boxed">
            <div className={['container-fluid', classes.padd20].join(' ')}>
              <div className={classes.DolarEndDay}>
                <div className="row">
                  <div id="cierreH"className="col-md-3">
                    <div className="panel panel-primary panel-colorful media middle pad-all">
                      <div className="media-left">
                        <div className="pad-hor">
                          <img style={{ width: '52px' }} src={CloseImage} alt="Cierre"></img>
                        </div>
                      </div>
                      <div className="media-body">
                        <p className="text-2x mar-no text-semibold">
                          {this.state.closePrice}
                        </p>
                        <p className={["mar-no font-weight-bold", classes.Label].join(' ')}>Cierre</p>
                      </div>
                    </div>
                  </div>
                  <div id="promedioH" className="col-md-3">
                    <div className="panel panel-primary panel-colorful media middle pad-all">
                      <div className="media-left">
                        <div className="pad-hor">
                          <img style={{ width: '52px' }} src={Average} alt="Promedio"></img>
                        </div>
                      </div>
                      <div className="media-body">
                        <p className="text-2x mar-no text-semibold">
                          {this.state.avgPrice} 
                        </p>
                        <p className={["mar-no font-weight-bold", classes.Label].join(' ')}>Promedio</p>
                      </div>
                    </div>
                  </div>
                  <div id="info_relojH" className="col-md-6">
                    <div className="panel media middle pad-all">
                      <div className="media-left">
                        <div className="pad-hor">
                          <img alt="clock" src={clockRewind} style={{ width: '52px' }}></img>
                        </div>
                      </div>
                      <div className="media-body">
                        <p className={["mar-no text-semibold", classes.SubTitle].join(' ')}>
                          Información del dólar con 15 minutos de retraso.
                          <br/>
                        </p>
                        <p className="mar-no" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-9">
                  <DolarSpot delay={0} />
                </div>
                <div className="col-md-3">
                  <div className={["panel", classes.AsideChartPanel].join(' ')}>
                    <h5>Estadísticas de Mercado</h5>
                    <br />
                    <ul className="menu_t">
                      <li>
                        <Link to="/estadisticas/">
                          <div className="icon">
                            <img src={transaction} alt="transaction" />
                          </div>
                          <div className="lk">
                            <span className="tx">Spot</span>
                            <span className="mk">></span>
                          </div>
                        </Link>

                      </li>
                      <li>
                        <Link to="/estadisticas/">
                          <div className="icon">
                            <img src={curvas} alt="curvas" />
                          </div>
                          <div className="lk">
                            <span className="tx">IMCs</span>
                            <span className="mk">></span>
                          </div>
                        </Link>

                      </li>
                      <li>
                        <Link to="/estadisticas/">
                          <div className="icon">
                            <img src={client} alt="client" />
                          </div>
                          <div className="lk">
                            <span className="tx">Clientes</span>
                            <span className="mk">></span>
                          </div>
                        </Link>

                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  {<iframe
                    title="actions ticker"
                    id="st_e4e0feb0d6e34ce6a093d4059fe3bd6d"
                    frameBorder="0"
                    scrolling="no"
                    width="100%"
                    height="40px"
                    src="https://api.stockdio.com/visualization/financial/charts/v1/Ticker?app-key=395DFC50D7D9415DA5A662933D57E22F&stockExchange=BVC&symbols=ECOPETROL;GRUPOAVAL;BCOLOMBIA;GRUPOSURA;BOGOTA;GRUPOARGOS&culture=Spanish-LatinAmerica&palette=Financial-Light&googleFont=true&onload=st_e4e0feb0d6e34ce6a093d4059fe3bd6d"
                  />}
                </div>
              </div>
              <div  className={["row", classes.arriba_divs].join(' ')}>
                <div id="DolarPrices"className="col-md-3">
                  {Object.keys(this.state.dolarPrices).length ? (
                    <DolarPrices dolarPrices={this.state.dolarPrices} />
                  ) : (
                      ""
                    )}
                </div>
                <div id="dolarAmmounts" className="col-sm-12 col-md-4">
                  {Object.keys(this.state.dolarAmmounts).length ? (
                    <DolarAmmounts dolarAmmounts={this.state.dolarAmmounts}/>
                  ) : (
                      ""
                    )}
                </div>
                <div id="stockDiv"className="col-md-5">
                  <iframe frameBorder='0' scrolling='no' width="100%" height="300" src='https://api.stockdio.com/visualization/financial/charts/v1/marketoverview?app-key=395DFC50D7D9415DA5A662933D57E22F&amp;wp=1&amp;addVolume=false&amp;showUserMenu=false&amp;culture=Spanish-LatinAmerica&amp;captionColor=25476a&amp;&amp;titleColor=ffffff&amp;title=Monedas&amp;stockExchange=BVC&amp;currencies=USD%2FJPY%3BUSD%2FEUR%3BUSD%2FBRL%3BUSD%2FMXN%3BGBP%2FUSD&amp;logoMaxHeight=20&amp;logoMaxWidth=90&amp;includeEquities=false&amp;includeIndices=false&amp;includeCommodities=false&amp;includeCurrencies=true&amp;includeLogo=true&amp;includeEquitiesSymbol=true&amp;includeEquitiesName=false&amp;includeIndiceSymbol=false&amp;includeIncidesName=false&amp;includeCommoditiesSymbol=false&amp;includeCommoditiesName=true&amp;includeCurrenciesSymbol=true&amp;includeCurrenciesName=false&amp;allowSort=true&amp;includePrice=true&amp;includeChange=true&amp;includePercentChange=false&amp;includeTrend=true&amp;includeVolume=false&amp;showHeader=true&amp;showBorderAndTitle=true&amp;displayPrices=Lines&amp;allowPeriodChange=false&amp;chartHeight=200px&amp;width=100%25&amp;height=100%25&amp;intraday=true&amp;onload=1df409df-b181-2f7b-034f-8d5f9ea6bbc1&width=800&height=420'></iframe>
                  {/*<Currencies currencies={this.state.currencies} />*/}
                </div>
              {/*</div>
              <div className="row">*/}
                <div id="BVCStock" className="col-md-4 col-sm-12">
                  <BVCStock stocks={this.state.bvc} />
                </div>
                <div id="StockIndexDiv"className="col-md-4 col-sm-12">
                  <StockIndex chart={this.state.stockChart} table={this.state.stockTable}></StockIndex>
                </div>
                <div id="News"className="col-md-4 col-sm-12">
                  <News news={this.state.news} />
                </div>
              </div>
              <div className="row">
                <div className="col-md-12 text-center"> 
                  * No incluye registros
                  {/*Información con 15 minutos de retraso | * No incluye registros*/}
                    </div>
              </div>
              <PreFooter></PreFooter>
            </div>
            <Footer></Footer>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth
  };
};

export default connect(mapStateToProps)(HomePage);
