
//Custom React hook for http requests management
import { useCallback, useEffect, useState } from "react";

//generic http request function
async function sendHttpRequest(url, config){
    const response = await fetch(url, config);

    //tranform request response into js object
    const resData = await response.json();

    if(!response.ok){
        throw new Error(resData.message || 'Something went wrong, failel to send request.')
    };

    return resData;
}

export default function useHttp(url, config, initialData){
    //Typical http states for error and loading handling 
    const [data, setData] = useState(initialData);
    const [error, setError] = useState();
    const [isLoading, setIsLoading] = useState(false);

    function clearData(){
        setData(initialData);
    }

    //async function in useCallback hook to prevent unintended looping
    const sendRequest = useCallback(async function sendRequest(data){
        setIsLoading(true);
        try{
            const resData = await sendHttpRequest(url, {...config, body: data});
            setData(resData);
        } catch (error){
            setError(error.message || 'Something went wrong!');
        }
        setIsLoading(false);
    }, [url, config])

    useEffect(() => {
        //immediate http request in case of GET request
        if(config && (config.method === 'GET' || !config.method) || !config)
        {
            sendRequest();
        }
    }, [sendRequest, config]);

    return{
        data,
        isLoading,
        error,
        sendRequest,
        clearData
    };
}