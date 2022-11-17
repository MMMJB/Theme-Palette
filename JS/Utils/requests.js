export default function request(url, method, callback, data = undefined) {
    let http = new XMLHttpRequest();

    http.onreadystatechange = _ => {
        if (http.readyState == 4) {
            if (http.status == 200) {
                callback(http.responseText);
                console.log(`Request successful @${url}`);
            } else console.log("Something went wrong...", http.status);
        }
    }

    http.open(method, url, true);
    http.send(data ? JSON.stringify(data) : null);
}