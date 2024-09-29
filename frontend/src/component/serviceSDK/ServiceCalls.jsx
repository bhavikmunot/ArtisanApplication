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