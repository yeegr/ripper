const webpack = require('webpack'),
  sourcemap = require('source-map-support'),
  fs = require('fs'),
  path = require('path')

let nodeModules = {}

fs.readdirSync('node_modules')
.filter(function(x) {
  return ['.bin'].indexOf(x) === -1
})
.forEach(function(mod) {
  nodeModules[mod] = 'commonjs ' + mod
})

module.exports = {
  mode: 'development',
  devtool: 'sourcemap',
  target: 'node',
  entry: path.resolve(__dirname, 'src/root.js'),
  output: {
    path: path.join(__dirname, 'dev/'),
	filename: '[name].js'
  },
  externals: nodeModules
}
