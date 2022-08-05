import React from "react";
import classes from "./Analytics.css";
import imagen from "../../../assets/img/Pantallazo Analytics 2.PNG";

const Analytics = () => {
	var html = null;
	
	html =(  
		<div >
        	<div className="col-12">
			  <h3 className={["alert-heading", classes.centrado, classes.titulo].join(' ')}><b>ANALYTICS</b></h3>
			</div>
			<div className="col-12">
				<div className="row">
				    <div className={["col-md-7", classes.texto].join(' ')}>
				      <p>
				      	SET-FX Analytics es la herramienta más completa y robusta de inteligencia de negocios para el mercado cambiario Colombiano.
				      </p>
				      <p>
				      	A través de una interfaz amigable brinda visualizaciones avanzadas de cifras, incluyendo todos los mercados (Spot, Next Day, Forward, Swaps, Opciones, IRS, CCS) y todos los pares de monedas negociados en Colombia.
				      </p>
				      <p>
				      	La información proviene del sistema SET-FX, la fuente más completa de información cambiaria en Colombia y permite maximizar el valor a partir de los datos.
				      </p>
				    </div>
				    <div className={["col-md-5"].join(' ')}>
				      <img src={imagen} className={["card-img", classes.imgCredit].join(' ')} alt="othersCard"/>
				    </div>
				</div>
			</div>
			<div className={["col-12", classes.boton].join(' ')}>
				<div className="row">
					<div className="col-5"></div>
					<div className="col-2">
				  		<a className="btn btn-default" href="https://www.analytics.set-icap.co" role="button">ANALYTICS</a>
				  	</div>
				  	<div className="col-5"></div>
				</div>
			</div>
		</div>
    )

    return(
    	<section className="col-md-12 col-xl-12 py-md-3 pl-md-5 bd-content center-block">
        {html}
        </section>
    )
}

export default Analytics;
