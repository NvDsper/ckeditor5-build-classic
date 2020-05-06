import Observer from '@ckeditor/ckeditor5-engine/src/view/observer/observer';

export default class VideoLoadObserver extends Observer {
	/**
	 * @inheritDoc
	 */
	observe( domRoot ) {
		this.listenTo( domRoot, 'load', ( event, domEvent ) => {
			const domElement = domEvent.target;

			if ( domElement.tagName == 'VIDEO' ) {
				this._fireEvents( domEvent );
			}
		}, { useCapture: true } );
	}
	_fireEvents( domEvent ) {
		if ( this.isEnabled ) {
			this.document.fire( 'layoutChanged' );
			this.document.fire( 'videoLoaded', domEvent );
		}
	}
}