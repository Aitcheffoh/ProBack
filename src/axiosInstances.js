import axios from 'axios';


// produccion
// -------------------------------------------------

/*export const Http = axios.create({
    baseURL: "http://proxy.set-icap.com/",
    timeout: 10000,
    headers: {
        'Access-Control-Allow-Origin': '*',
        //'Authorization': "JWT " + localStorage.getItem('access_token'),
        //'Content-Type': 'application/json',
        //'accept': 'application/json'
    }   
});

export const AuthHttp = axios.create({
    baseURL: "http://proxy.set-icap.com/" 
});

export const HttpNode = axios.create({
    baseURL: "http://proxy.set-icap.com/"
})

export const Httpphp = axios.create({
    baseURL: "http://dolar.set-icap.com/"
})
*/

/*
// contigencia
// -------------------------------------------------
export const Http = axios.create({
    baseURL: "https://proxy.icap.com.co/",
    timeout: 15000,
    headers: {
        'Access-Control-Allow-Origin': '*',
        //'Authorization': "JWT " + localStorage.getItem('access_token'),
        //'Content-Type': 'application/json',
        //'accept': 'application/json'
    }    
});

export const AuthHttp = axios.create({
    baseURL: "https://proxy.icap.com.co/" 
});

export const HttpNode = axios.create({
    baseURL: "https://proxy.icap.com.co/"
})

export const Httpphp = axios.create({
    baseURL: "https://icap.com.co/"
})
*/



// pruebas
// -------------------------------------------------
export const Http = axios.create({
    baseURL: "https://proxy.setfx.co/",
    timeout: 15000,
    headers: {
        'Access-Control-Allow-Origin': '*',
        //'Authorization': "JWT " + localStorage.getItem('access_token'),
        //'Content-Type': 'application/json',
        //'accept': 'application/json'
    }    
});

export const AuthHttp = axios.create({
    baseURL: "https://proxy.setfx.co/" 
});

export const HttpNode = axios.create({
    baseURL: "https://proxy.setfx.co/"
})

export const Httpphp = axios.create({
    baseURL: "https://dolar.setfx.co/"
})



// -------------------------------------------------

AuthHttp.interceptors.request.use( config => {
    const token = localStorage.getItem('token');
    if(token !== ''){
        config.headers.Authorization = `${token}`;
    }
    return config;
})