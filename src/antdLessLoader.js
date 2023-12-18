import lessLoader from 'less-loader';
import { getScssThemePath } from './loaderUtils';
import { loadScssThemeAsLess } from './utils';

/**
 * Modify less-loader's options with variable overrides extracted from the SCSS theme.
 * @param {Object} options - Options for less-loader
 * @return {Object} Options modified to include theme variables in the modifyVars property.
 */
export const overloadLessLoaderOptions = (options) => {
	const scssThemePath = getScssThemePath(options);

	const themeModifyVars = loadScssThemeAsLess(scssThemePath);

	const lessOptions = {
		...options.lessOptions,
		modifyVars: {
			...themeModifyVars,
			...(options.lessOptions?.modifyVars || {}),
		},
	};

	return { ...options, lessOptions };
};

/**
 * A wrapper around less-loader which overloads loader options and registers the theme file
 * as a watched dependency. We need to override the context's getOptions fn since Webpack's
 * NormalModule.js captures its context there with arrow function, making it hard for us to
 * tweak the loader's context.
 * @param {...*} args - Arguments passed to less-loader.
 * @return {*} The return value of less-loader, if any.
 */
export default function antdLessLoader(...args) {
	const loaderContext = this;
	const options = this.getOptions();

	const newLoaderContext = {
		...loaderContext,
		getOptions() {
			return this.options;
		},
	};
	try {
		const newOptions = overloadLessLoaderOptions(options);
		delete newOptions.scssThemePath;
		newLoaderContext.options = newOptions;
	} catch (error) {
		// Remove unhelpful stack from error.
		error.stack = undefined; // eslint-disable-line no-param-reassign
		throw error;
	}

	const scssThemePath = getScssThemePath(options);
	newLoaderContext.addDependency(scssThemePath);

	return lessLoader.call(newLoaderContext, ...args);
}
