/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module image/imageupload/imageuploadui
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import FileDialogButtonView from '@ckeditor/ckeditor5-upload/src/ui/filedialogbuttonview';
import videoIcon from '../../theme/icons/video.svg';
import { createVideoTypeRegExp } from './utils';

/**
 * The image upload button plugin.
 *
 * For a detailed overview, check the {@glink features/image-upload/image-upload Image upload feature} documentation.
 *
 * Adds the `'imageUpload'` button to the {@link module:ui/componentfactory~ComponentFactory UI component factory}.
 *
 * @extends module:core/plugin~Plugin
 */
export default class ImageUploadUI extends Plugin {
	/**
	 * @inheritDoc
	 */
	init() {
		const editor = this.editor;
		const t = editor.t;

		// Setup `imageUpload` button.
		editor.ui.componentFactory.add( 'videoUpload', locale => {
			const view = new FileDialogButtonView( locale );
			const command = editor.commands.get( 'videoUpload' );
			const videoTypes = editor.config.get( 'video.upload.types' );
			const videoTypesRegExp = createVideoTypeRegExp( videoTypes );

			view.set( {
				acceptedType: videoTypes.map( type => `video/${ type }` ).join( ',' ),
				allowMultipleFiles: true
			} );

			view.buttonView.set( {
				label: ( 'Insert video' ),
				icon: videoIcon,
				tooltip: true
			} );

			view.buttonView.bind( 'isEnabled' ).to( command );

			view.on( 'done', ( evt, files ) => {
				const videosToUpload = Array.from( files ).filter( file => videoTypesRegExp.test( file.type ) );

				if ( videosToUpload.length ) {
					editor.execute( 'videoUpload', { file: videosToUpload } );
				}
			} );

			return view;
		} );
	}
}
