var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProductSchema = new Schema({
  id: {
    type: String,
    required: true
  },
  codigo: {
    type: String,
    required: false
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  published: {
    type: Boolean,
    required: true,
    default: false
  }
});

module.exports = mongoose.model('Product', ProductSchema);
