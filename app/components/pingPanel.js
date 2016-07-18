
 Ping = React.createClass({
    getInitialState: function () {
        return { value: '' };
    },
    pingChange: function () {
        if (PingStore.pingResult && PingStore.pingResult.isPingSuccess) {
            this.setState({ value: PingStore.pingResult.value });
        }else {
            this.setState({ value: '' });
        }
    },
    componentDidMount: function () {
        this.unsubscribe = PingStore.listen(this.pingChange);
        PingActions.ping();
    },
    componentWillUnmount: function () {
        this.unsubscribe();
    },
    render: function () {
        var loadingPanel = <span className='preloader' style={{ verticalAlign: 'middle' }}></span>;
        var customerGradePanel = <p>{this.state.value}</p>;
        return (
            <div>
                 {this.state.value!=='' ?
                         customerGradePanel : loadingPanel}
            </div>
            );
}

});
