var Ping;
var interval_pingPanel = setInterval(function () {
    var pingPanel = React.createFactory(Ping);
    ReactDOM.render(
        pingPanel({ title: 'Ping Test' }),
        document.getElementById('PingView')
    );
    if (!pingPanel && typeof(pingPanel) !== 'undefined') {
        clearInterval(interval_pingPanel);
    }
}, 10);
