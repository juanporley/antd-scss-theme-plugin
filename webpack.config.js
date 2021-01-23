const path = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const packageJson = require('./package.json');

module.exports = {
	devtool: 'cheap-module-source-map',
	entry: path.join(__dirname, 'src', 'index.js'),
	// resolve: { modules: [path.resolve(__dirname, 'src'), 'node_modules'] },
	// context: __dirname,
	target: 'node',
	output: {
		path: path.join(__dirname, 'build'),
		filename: `${packageJson.name}.js`,
		library: 'AntdScssThemePlugin',
		libraryTarget: 'commonjs',
	},
	externals: [nodeExternals(), 'antd', 'less', 'less-loader', 'sass-loader'],
	plugins: [new ESLintPlugin()],
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				// enforce: 'pre',
				use: ['babel-loader', 'eslint-loader'],
			},
		],
	},
};
