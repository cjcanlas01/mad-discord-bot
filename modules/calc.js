const account = require('./accounting.min');

let compute = (data) => {
    const percentMultiplicator = 5;
    let output;

    let totalBalance = Number(data['shipped']) * percentMultiplicator;
    let availableBalance = totalBalance - Number(data['delivered']);
    let requested = (data['requested'] <= availableBalance) ? ':thumbsup:' : ':thumbsdown:';

    if(data['shipped'] && data['delivered'] && data['requested']) {
        output = [
            { name: 'Total balance', value: account.formatNumber(totalBalance), inline: true },
            { name: 'Available balance', value: account.formatNumber(availableBalance), inline: true },
            { name: 'Requested', value: requested }
        ];
    } else {
        output = [
            { name: 'ALERT', value: 'Please input required values!' }
        ];
    }

    return output;
}

module.exports = compute;