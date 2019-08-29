/**
 * External dependencies
 */
import { Component } from '@wordpress/element';
import { debounce } from 'lodash';
import { createHigherOrderComponent } from '@wordpress/compose';
import PropTypes from 'prop-types';
import { IS_LARGE_CATALOG } from '@woocommerce/block-settings';

/**
 * Internal dependencies
 */
import { getProducts } from '../components/utils';

/**
 * A higher order component that enhances the provided component with products
 * from a search query.
 */
const withSearchedProducts = createHigherOrderComponent( ( OriginalComponent ) => {
	/**
	 * A Component wrapping the passed in component.
	 *
	 * @class WrappedComponent
	 * @extends {Component}
	 */
	class WrappedComponent extends Component {
		constructor() {
			super( ...arguments );
			this.state = {
				list: [],
				loading: true,
			};
			this.setError = this.setError.bind( this );
			this.debouncedOnSearch = debounce( this.onSearch.bind( this ), 400 );
		}

		componentDidMount() {
			const { selected } = this.props;
			getProducts( { selected } )
				.then( ( list ) => {
					this.setState( { list, loading: false } );
				} )
				.catch( this.setError );
		}

		componentWillUnmount() {
			this.debouncedOnSearch.cancel();
		}

		onSearch( search ) {
			const { selected } = this.props;
			getProducts( { selected, search } )
				.then( ( list ) => {
					this.setState( { list, loading: false } );
				} )
				.catch( this.setError );
		}

		setError( errorResponse ) {
			errorResponse.json().then( ( apiError ) => {
				const error = typeof apiError === 'object' && apiError.hasOwnProperty( 'message' ) ? {
					apiMessage: apiError.message,
				} : {
					// If we can't get any message from the API, set it to null and
					// let <ApiErrorPlaceholder /> handle the message to display.
					apiMessage: null,
				};

				this.setState( { list: [], loading: false, error } );
			} );
		}

		render() {
			const { error, list, loading } = this.state;
			const { selected } = this.props;
			return (
				<OriginalComponent
					{ ...this.props }
					error={ error }
					products={ list }
					isLoading={ loading }
					selected={ list.filter(
						( { id } ) => selected.includes( id )
					) }
					onSearch={ IS_LARGE_CATALOG ? this.debouncedOnSearch : null }
				/>
			);
		}
	}
	WrappedComponent.propTypes = {
		selected: PropTypes.array,
	};
	WrappedComponent.defaultProps = {
		selected: [],
	};
	return WrappedComponent;
}, 'withSearchedProducts' );

export default withSearchedProducts;
