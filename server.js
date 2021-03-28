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
        fs.writeFileSync(path.resolve(__dirname, './json/sheet.json'), body, function(err){
            if (err) throw err;
            console.log('Generated sheet.json');
        });
        json=[];
        var rawdata = JSON.parse(body);
        var entries = rawdata.feed.entry;
        for (var i = 9; i < entries.length; i = i + 9) {
            var tot = {};
            tot.number = entries[i].content.$t;
            tot.network = entries[i+1].content.$t;
            tot.servicetype = entries[i+2].content.$t;
            tot.price = entries[i+3].content.$t;
            json.push(tot);
        };

        var stockdata = {};
        stockdata.total = entries.length/9-1;
        stockdata.details = json;

        var result = json;
        result = sort_by_key(result ,'number');
        console.log(result);

        fs.writeFileSync(path.resolve(__dirname, './json/number.json'), JSON.stringify(stockdata));
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