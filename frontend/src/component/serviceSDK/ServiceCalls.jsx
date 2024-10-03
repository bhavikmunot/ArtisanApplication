export function submitFetchAPIToken(body, callback) {
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: JSON.stringify(
            `grant_type=&username=${body.username}&password=${body.password}&scope=&client_id=&client_secret=`
        ),
    };

    fetch("http://127.0.0.1:8000/api/token", requestOptions)
        .then((response) => {
            console.log(response)
            if (response.ok) {
                response.json().then((data) => {
                    callback(data, null);
                });
            } else {
                callback(null, response)
            }
        })
        .catch((error) => {
            callback(null, error);
        });
}


export function submitMessageToBot(body, callback, index) {

    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + body.token,
        }
    };
    {/*I could have used caching here, but it's difficult to decide when to cache and when not to*/}
    {/*in a chatbot-LLM application in such a short time frame.*/}
    fetch("http://127.0.0.1:8000/api/message_reply/${param1}", requestOptions)
        .then((response) => {
            if (response.ok) {
                response.json().then((data) => {
                    callback(data, null, index);
                });
            } else {
                console.log(response)
                callback(null, response, index);
            }
        })
        .catch((error) => {
            callback(null, error, index);
        });


}