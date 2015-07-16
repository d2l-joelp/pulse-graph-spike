var express = require('express'),
app = express(),
port = process.env.PORT || 4000;

app.use(express.static(__dirname + '/public'));

var server = app.listen(port, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Listening at http://%s:%s', host, port);
});