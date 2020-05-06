/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module image/imageupload/imageuploadediting
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import FileRepository from '@ckeditor/ckeditor5-upload/src/filerepository';
import Notification from '@ckeditor/ckeditor5-ui/src/notification/notification';
import Clipboard from '@ckeditor/ckeditor5-clipboard/src/clipboard';
import UpcastWriter from '@ckeditor/ckeditor5-engine/src/view/upcastwriter';
import env from '@ckeditor/ckeditor5-utils/src/env';

import VideoUploadCommand from '../../src/videoupload/videouploadcommand';
import { fetchLocalVideo, isLocalVideo } from '../../src/videoupload/utils';
import { createVideoTypeRegExp } from './utils';

/**
 * The editing part of the image upload feature. It registers the `'imageUpload'` command.
 *
 * @extends module:core/plugin~Plugin
 */
export default class VideoUploadEditing extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get requires() {
		return [ FileRepository, Notification, Clipboard ];
	}

	static get pluginName() {
		return 'VideoUploadEditing';
	}

	/**
	 * @inheritDoc
	 */
	constructor( editor ) {
		super( editor );

		editor.config.define( 'video', {
			upload: {
				types: [ 'mp3', 'mp4', 'mov', 'AVI', 'mov', 'rmvb' ]
			}
		} );
	}

	/**
	 * @inheritDoc
	 */
	init() {
		const editor = this.editor;
		const doc = editor.model.document;
		const schema = editor.model.schema;
		const conversion = editor.conversion;
		const fileRepository = editor.plugins.get( FileRepository );

		const videoTypes = createVideoTypeRegExp( editor.config.get( 'video.upload.types' ) );

		// Setup schema to allow uploadId and uploadStatus for videos.
		schema.extend( 'video', {
			allowAttributes: [ 'uploadId', 'uploadStatus' ]
		} );

		// Register videoUpload command.
		editor.commands.add( 'videoUpload', new VideoUploadCommand( editor ) );

		// Register upcast converter for uploadId.
		conversion.for( 'upcast' )
			.attributeToAttribute( {
				view: {
					name: 'video',
					key: 'uploadId'
				},
				model: 'uploadId'
			} );

		this.listenTo( editor.editing.view.document, 'clipboardInput', ( evt, data ) => {
			// Skip if non empty HTML data is included.
			// https://github.com/ckeditor/ckeditor5-upload/issues/68
			if ( isHtmlIncluded( data.dataTransfer ) ) {
				return;
			}

			const videos = Array.from( data.dataTransfer.files ).filter( file => {
				// See https://github.com/ckeditor/ckeditor5-video/pull/254.
				if ( !file ) {
					return false;
				}

				return videoTypes.test( file.type );
			} );

			const ranges = data.targetRanges.map( viewRange => editor.editing.mapper.toModelRange( viewRange ) );

			editor.model.change( writer => {
				// Set selection to paste target.
				writer.setSelection( ranges );

				if ( videos.length ) {
					evt.stop();

					// Upload videos after the selection has changed in order to ensure the command's state is refreshed.
					editor.model.enqueueChange( 'default', () => {
						editor.execute( 'videoUpload', { file: videos } );
					} );
				}
			} );
		} );

		this.listenTo( editor.plugins.get( Clipboard ), 'inputTransformation', ( evt, data ) => {
			const fetchableVideos = Array.from( editor.editing.view.createRangeIn( data.content ) )
				.filter( value => isLocalVideo( value.item ) && !value.item.getAttribute( 'uploadProcessed' ) )
				.map( value => { return { promise: fetchLocalVideo( value.item ), videoElement: value.item }; } );

			if ( !fetchableVideos.length ) {
				return;
			}

			const writer = new UpcastWriter();

			for ( const fetchableVideo of fetchableVideos ) {
				// Set attribute marking that the Video was processed already.
				writer.setAttribute( 'uploadProcessed', true, fetchableVideo.videoElement );

				const loader = fileRepository.createLoader( fetchableVideo.promise );

				if ( loader ) {
					writer.setAttribute( 'src', '', fetchableVideo.videoElement );
					writer.setAttribute( 'uploadId', loader.id, fetchableVideo.videoElement );
				}
			}
		} );

		// Prevents from the browser redirecting to the dropped image.
		editor.editing.view.document.on( 'dragover', ( evt, data ) => {
			data.preventDefault();
		} );

		// Upload placeholder images that appeared in the model.
		doc.on( 'change', () => {
			const changes = doc.differ.getChanges( { includeChangesInGraveyard: true } );

			for ( const entry of changes ) {
				if ( entry.type == 'insert' && entry.name != '$text' ) {
					const item = entry.position.nodeAfter;
					const isInGraveyard = entry.position.root.rootName == '$graveyard';

					for ( const video of getVideosFromChangeItem( editor, item ) ) {
						// Check if the video element still has upload id.
						const uploadId = video.getAttribute( 'uploadId' );

						if ( !uploadId ) {
							continue;
						}

						// Check if the video is loaded on this client.
						const loader = fileRepository.loaders.get( uploadId );

						if ( !loader ) {
							continue;
						}

						if ( isInGraveyard ) {
							// If the video was inserted to the graveyard - abort the loading process.
							loader.abort();
						} else if ( loader.status == 'idle' ) {
							// If the video was inserted into content and has not been loaded yet, start loading it.
							this._readAndUpload( loader, video );
						}
					}
				}
			}
		} );
	}

	_readAndUpload( loader, videoElement ) {
		const editor = this.editor;
		const model = editor.model;
		const t = editor.locale.t;
		const fileRepository = editor.plugins.get( FileRepository );
		const notification = editor.plugins.get( Notification );

		model.enqueueChange( 'transparent', writer => {
			writer.setAttribute( 'uploadStatus', 'reading', videoElement );
		} );

		return loader.read()
			.then( () => {
				const promise = loader.upload();

				// Force re–paint in Safari. Without it, the video will display with a wrong size.
				// https://github.com/ckeditor/ckeditor5/issues/1975
				/* istanbul ignore next */
				if ( env.isSafari ) {
					const viewFigure = editor.editing.mapper.toViewElement( videoElement );
					const viewImg = viewFigure.getChild( 0 );

					editor.editing.view.once( 'render', () => {
						// Early returns just to be safe. There might be some code ran
						// in between the outer scope and this callback.
						if ( !viewImg.parent ) {
							return;
						}

						const domFigure = editor.editing.view.domConverter.mapViewToDom( viewImg.parent );

						if ( !domFigure ) {
							return;
						}

						const originalDisplay = domFigure.style.display;

						domFigure.style.display = 'none';

						// Make sure this line will never be removed during minification for having "no effect".
						domFigure._ckHack = domFigure.offsetHeight;

						domFigure.style.display = originalDisplay;
					} );
				}

				model.enqueueChange( 'transparent', writer => {
					writer.setAttribute( 'uploadStatus', 'uploading', videoElement );
				} );

				return promise;
			} )
			.then( data => {
				model.enqueueChange( 'transparent', writer => {
					writer.setAttributes( { uploadStatus: 'complete', src: data.default }, videoElement );
					this._parseAndSetSrcsetAttributeOnVideo( data, videoElement, writer );
				} );

				clean();
			} )
			.catch( error => {
				// If status is not 'error' nor 'aborted' - throw error because it means that something else went wrong,
				// it might be generic error and it would be real pain to find what is going on.
				if ( loader.status !== 'error' && loader.status !== 'aborted' ) {
					throw error;
				}

				// Might be 'aborted'.
				if ( loader.status == 'error' && error ) {
					notification.showWarning( error, {
						title: t( 'Upload failed' ),
						namespace: 'upload'
					} );
				}

				clean();

				// Permanently remove video from insertion batch.
				model.enqueueChange( 'transparent', writer => {
					writer.remove( videoElement );
				} );
			} );

		function clean() {
			model.enqueueChange( 'transparent', writer => {
				writer.removeAttribute( 'uploadId', videoElement );
				writer.removeAttribute( 'uploadStatus', videoElement );
			} );

			fileRepository.destroyLoader( loader );
		}
	}

	_parseAndSetSrcsetAttributeOnVideo( data, video, writer ) {
		// Srcset attribute for responsive videos support.
		let maxWidth = 0;

		const srcsetAttribute = Object.keys( data )
		// Filter out keys that are not integers.
			.filter( key => {
				const width = parseInt( key, 10 );

				if ( !isNaN( width ) ) {
					maxWidth = Math.max( maxWidth, width );

					return true;
				}
			} )

			// Convert each key to srcset entry.
			.map( key => `${ data[ key ] } ${ key }w` )

			// Join all entries.
			.join( ', ' );

		if ( srcsetAttribute != '' ) {
			writer.setAttribute( 'srcset', {
				data: srcsetAttribute,
				width: maxWidth
			}, video );
		}
	}
}

export function isHtmlIncluded( dataTransfer ) {
	return Array.from( dataTransfer.types ).includes( 'text/html' ) && dataTransfer.getData( 'text/html' ) !== '';
}

function getVideosFromChangeItem( editor, item ) {
	return Array.from( editor.model.createRangeOn( item ) )
		.filter( value => value.item.is( 'video' ) )
		.map( value => value.item );
}
