class AntdScssThemePlugin {
	SCSS_THEME_PATH;

	constructor(scssThemePath) {
		AntdScssThemePlugin.SCSS_THEME_PATH = scssThemePath;
	}

	/**
	 * Explicitly add the SCSS theme file to file dependencies.
	 * @param {Object} compiler - A webpack compiler.
	 * @return {undefined}
	 */
	// eslint-disable-next-line class-methods-use-this
	apply(compiler) {
		const afterEmit = (compilation, callback) => {
			// Watch the theme file for changes.
			const theme = AntdScssThemePlugin.SCSS_THEME_PATH;
			if (theme) {
				if (Array.isArray(compilation.fileDependencies) && !compilation.fileDependencies.includes(theme)) {
					compilation.fileDependencies.push(theme);
				} else if ('has' in compilation.fileDependencies && !compilation.fileDependencies.has(theme)) {
					compilation.fileDependencies.add(theme);
				}
			}
			callback();
		};

		// Register the callback for...
		if (compiler.hooks) {
			// ... webpack 4, or...
			const plugin = { name: 'AntdScssThemePlugin' };
			compiler.hooks.afterEmit.tapAsync(plugin, afterEmit);
		} else {
			// ... webpack 3.
			compiler.plugin('after-emit', afterEmit);
		}
	}

	/**
	 * Replace a either less-loader or sass-loader with a custom loader which wraps it and extends
	 * its functionality. In the case of less-loader, this enables live-reloading and customizing
	 * antd's theme using an SCSS theme file. In the case of less-loader, this enables importing
	 * all of antd's theme and color variables from the SCSS theme file.
	 * antd.
	 * @param {(string|Object)} config - A webpack loader config.
	 * @return {Object} Loader config using the wrapped loader instead of the original.
	 */
	static themify(config) {
		const { loader, options = {} } = typeof config === 'string' ? { loader: config } : config;
		let overloadedLoader;
		if (loader.includes('sass-loader')) {
			overloadedLoader = require.resolve('./antdSassLoader.js');
		} else if (loader.includes('less-loader')) {
			overloadedLoader = require.resolve('./antdLessLoader.js');
		} else {
			overloadedLoader = loader;
		}

		return {
			loader: overloadedLoader,
			options,
		};
	}
}

export default AntdScssThemePlugin;
