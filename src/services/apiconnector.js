
//  isk file ka kaam hia ki jab bhi frontend koi bhi request maarega to uski request
//  isi component ke kisi function me aaegi and fir par backend ke kisi route se 
// mapped hogi

import axios from "axios"
//  axios is used to make http request from the browser!!

export const axiosInstance = axios.create({});

export const apiConnector = (method, url, bodyData, headers, params) => {
    return axiosInstance({
        method: `${method}`,
        url: `${url}`,
        data: bodyData ? bodyData : null,
        headers: headers ? headers : null,
        params: params ? params : null,
    });
}


