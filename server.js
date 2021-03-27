var https = require('https');
var path = require('path');
var fs = require('fs');



https.get('https://spreadsheets.google.com/feeds/cells/1uGr0mIWn9pUflZQRuei1FepXv30JdQSBVWLUjL_Zpyw/1/public/full?alt=json', function(resp) {
    resp.setEncoding('utf8');
    var body = '';
    resp.on('data', function(data) {
        body += data;
      })
    resp.on('end', function() {
        fs.writeFileSync(path.resolve(__dirname, './sheet.json'), body, function(err){
            if (err) throw err;
            console.log('Generated sheet.json');
        });
        json=[];
        var rawdata = JSON.parse(body);
        var entries = rawdata.feed.entry;
        for (var i = 9; i < entries.length; i = i + 9) {
            var number_obj = ['number'];
            var price_obj = ['price'];
            var network_obj = ['network'];
            var servicetype_obj = ['service'];
            var tot = [];
            var number = entries[i].content.$t;
            var network = entries[i+1].content.$t;
            var servicetype = entries[i+2].content.$t;
            var price = entries[i+3].content.$t;
            number_obj.push(number);price_obj.push(price);servicetype_obj.push(servicetype);network_obj.push(network);
            tot.push(number_obj);tot.push(price_obj);tot.push(servicetype_obj);tot.push(network_obj);
            json.push(Object.fromEntries(tot));
        };

        var stockdata = Object.fromEntries([['total',entries.length/9-1],['details',json]]);
        console.log(JSON.parse(JSON.stringify(stockdata)).details[1]);

        var result = json;
        result = sort_by_key(result ,'number');
        console.log(result);

        fs.writeFileSync(path.resolve(__dirname, './number.json'), JSON.stringify(stockdata));
        console.log('gen number json')
    });
});




function ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint16Array(buf));
}
function sort_by_key(array, key){
   return array.sort(function(a, b){
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
  }