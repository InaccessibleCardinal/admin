
let clock = setTimeout(checkTime, 400000);


self.addEventListener('message', function(msg) {
    console.log('msg received in worker: ', msg.data);

    if (msg.data === 'restart') {
        clearTimeout(clock);
        setTimeout(checkTime, 400000);
    } else {
        close();
    }
});

function checkTime() {
    postMessage({redirect: true});
    let x = new XMLHttpRequest();
    x.open('POST', '/martin-integrated/admin/index.php');
    let d = {destroy: true};
    
    x.onreadystatechange = function() {
        if (this.readyState === 4) {
            console.log('RES: ', this.responseText);
        }
    }
    x.send(JSON.stringify(d));
    close();
}

