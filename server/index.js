const express = require('express');

const app = express();
module.exports.app = app;
const {getAllReviews, getMeta, addReview, markHelpful, report} = require('./models.js');
const router = require('./router.js')

app.use(express.json())
app.use('/', router);

app.set('port', 3000);

app.listen(app.get('port'));
console.log('Listening on', app.get('port'));