const mongoose = require('mongoose');

let reviewSchema = mongoose.Schema({
  product_id: Number,
  review_id: Number,
  date: Date,
  rating: Number,
  summary: String,
  body: String,
  response: String,
  recommend: Boolean,
  reviewer_name: String,
  email: String,
  helpfulness: Number,
  reported: Boolean,
  photos: [{url: String}],
  characteristics: [
    {characteristic: String, id: Number, value: String}
  ]
});

// let charSchema = mongoose.Schema({
//   characteristic: String,
//   id: Number,
//   value: String
// });

let Reviews = mongoose.model('Reviews', reviewSchema);
module.exports = {};