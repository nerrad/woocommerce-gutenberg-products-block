/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import PropTypes from 'prop-types';
import Gridicon from 'gridicons';
import classNames from 'classnames';
import { Button, Placeholder, Spinner } from '@wordpress/components';

/**
 * Internal dependencies
 */
import ErrorMessage from './error-message.js';
import './style.scss';

const ApiErrorPlaceholder = ( { className, error, isLoading, onRetry } ) => (
	<Placeholder
		icon={ <Gridicon icon="notice" /> }
		label={ __( 'Sorry, an error occurred', 'woo-gutenberg-products-block' ) }
		className={ classNames( 'wc-block-api-error', className ) }
	>
		<ErrorMessage error={ error } />
		{ onRetry && (
			<Fragment>
				{ isLoading ? (
					<Spinner />
				) : (
					<Button isDefault onClick={ onRetry }>
						{ __( 'Retry', 'woo-gutenberg-products-block' ) }
					</Button>
				) }
			</Fragment>
		) }
	</Placeholder>
);

ApiErrorPlaceholder.propTypes = {
	/**
	 * Classname to add to placeholder in addition to the defaults.
	 */
	className: PropTypes.string,
	/**
	 * The error object.
	 */
	error: PropTypes.shape( {
		/**
		 * Human-readable error message to display.
		 */
		message: PropTypes.node,
		/**
		 * Context in which the error was triggered. That will determine how the error is displayed to the user.
		 */
		type: PropTypes.oneOf( [ 'api', 'general' ] ),
	} ),
	/**
	 * Whether there is a request running, so the 'Retry' button is hidden and
	 * a spinner is shown instead.
	 */
	isLoading: PropTypes.bool,
	/**
	 * Callback to retry an action.
	 */
	onRetry: PropTypes.func,
};

export default ApiErrorPlaceholder;
