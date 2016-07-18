
var PingActions = Reflux.createActions([
    'ping'
]);
var PingStore = Reflux.createStore({
    pingResult: { isPingSuccess: false, value: '', errorMsg: '' },
    listenables: [PingActions],
    onPing: function (params) {
        $.ajax({
            url: 'http://epaygo.elandcloud.com/epay/ping',
            type: 'get',
            data: params,
            dataType: 'json',
            success: function (data) {
                if (data) {
                    PingStore.pingResult.isPingSuccess = true;
                    PingStore.pingResult.value = data;
                }
                PingStore.trigger(PingStore.pingResult);
            },
            error: function () {
                PingStore.pingResult.errorMsg = 'fail';
                PingStore.trigger(PingStore.pingResult);
            }
        });
    }
});
