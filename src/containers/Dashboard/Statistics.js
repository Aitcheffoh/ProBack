import React, { Component } from 'react';
import { Http, HttpNode } from '../../axiosInstances';
import classes from './Statistics.css';

const strip_html_tags = (str, rep = "") => {
    if ((str === null) || (str === ''))
        return false;
    else
        str = str.toString();
    return str.replace(/(<([^>]+)>)/ig, rep);
}

const HEADERS = ["Merc.", "Moneda", "Plazo", "Monto Acumulado", "Apertura", "Cierre", "No Trans.",
    "Promedio", "Precio mínimo", "Precio máximo", "Monto promedio", "Monto mínimo", "Monto máximo",
    "Monto último", "Fecha"]

const PRICEHEADERS = ["Monto Acumulado", "Apertura", "Cierre", "Promedio", "Precio mínimo",
    "Precio máximo", "Monto promedio", "Monto mínimo", "Monto máximo", "Monto último"]

class StatisticsComponent extends Component {
    state = {
        sectorInfo: [],
        realInfo: []
    }

    mapTable(response) {
        const parser = new DOMParser();
        let parserTable = parser.parseFromString(response.data, "text/html");
        const sectorInfoTitles = Array.from(parserTable.querySelectorAll(".sectores_header > tbody > tr > th")).map(
            cell => strip_html_tags(cell.innerHTML, ' '));

        const sectorInfo = Array.from(parserTable.querySelectorAll('.sectores > tbody > tr')).map(
            row => Array.from(row.querySelectorAll('td')).map(
                cell => strip_html_tags(cell.innerHTML, ' ')
            )
        );
        return {
            titles: sectorInfoTitles,
            info: sectorInfo
        }
    }

    componentDidMount() {
        HttpNode.post('seticap/api/estadisticas/estadisticasMercado', { "moneda": "USD/COP", "sector": 1 }).then(
            response => {
                let info = []
                response.data.result.map(obj => {
                    let row = []
                    HEADERS.map(key => {
                        if (PRICEHEADERS.indexOf(key) != -1) {
                            row.push(new Intl.NumberFormat('es-CO', { style: "currency", currency: "COP" }).format(parseFloat(obj[key]).toFixed(2)));
                        } else {
                            row.push(obj[key]);
                        }
                    })
                    info.push(row);
                })
                this.setState({
                    ...this.state,
                    sectorInfo: info
                })
            }
        )

        HttpNode.post('seticap/api/estadisticas/estadisticasMercado', { "sector": 2 }).then(
            response => {
                let info = []
                response.data.result.map(obj => {
                    let row = []
                    HEADERS.map(key => {//debugger;
                        if (PRICEHEADERS.indexOf(key) != -1) {
                            row.push(new Intl.NumberFormat('es-CO', { style: "currency", currency: "COP" }).format(parseFloat(obj[key]).toFixed(2)));
                        } else {
                            row.push(obj[key]);
                        }
                    })
                    info.push(row);
                })
                this.setState({
                    ...this.state,
                    realInfo: info
                })
            }
        )

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

    render() {this.verify_time_token()//aca se podria poder un validador para el tiempo de sesion
        const paddingTop = this.props.paddingTop ? this.props.paddingTop : '0'
        return (
            <div id="content-container" style={{paddingTop: `${paddingTop}%`}}>
                <div id="page-content" style={{fontSize: 11}}>
                    <div>
                        <div className={["row", classes.estad_head].join(' ')}>
                            <h4><span className="badge badge-warning">IMCs / IMCs</span></h4>
                        </div>
                        <div className="row">
                            <div className="col-md-12" style={{ backgroundColor: 'white', overflowX: 'scroll' }}>
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            {HEADERS.map(title => <th key={`icms-${title}`}>{title}</th>)}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.sectorInfo.map((row, i) => <tr key={`srow-${i}`}>{row.map((cell, j) => <td key={`scell-${i}${j}`} >{cell}</td>)}</tr>)}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="row">
                            <h4><span className="badge badge-warning">IMCs / Clientes</span></h4>
                        </div>
                        <div className="row">
                            <div className="col-md-12" style={{ backgroundColor: 'white', overflowX: 'scroll' }}>
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            {HEADERS.map(title => <th key={`real-${title}`}>{title}</th>)}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.realInfo.map((row, i) => <tr key={`rrow-${i}`}>{row.map((cell, j) => <td key={`rcell-${i}${j}`} >{cell}</td>)}</tr>)}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default StatisticsComponent;