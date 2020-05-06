import Plugin from '@ckeditor/ckeditor5-core/src/Plugin';
import VideoLoadObserver from './videoloadobserver';

import { viewFigureToModel, modelToViewAttributeConverter } from './converters';
import VideoInsertCommand from './videoinsertcommand';
import { toVideoWidget } from './utils';

export default class VideoEditing extends Plugin {
	static get pluginName() {
		return 'VideoEditing';
	}
	init() {
		const editor = this.editor;
		const schema = editor.model.schema;
		const t = editor.t;
		const conversion = editor.conversion;
		editor.editing.view.addObserver( VideoLoadObserver );
		schema.register( 'video', {
			isObject: true,
			isBlock: true,
			allowWhere: '$block',
			allowAttributes: [ 'src', 'controls' ]
		} );
		conversion.for( 'dataDowncast' ).elementToElement( {
			model: 'video',
			view: ( modelElement, viewWriter ) => createVideoViewElement( viewWriter )
		} );
		conversion.for( 'editingDowncast' ).elementToElement( {
			model: 'video',
			view: ( modelElement, viewWriter ) => toVideoWidget( createVideoViewElement( viewWriter ), viewWriter, t( 'video widget' ) )
		} );
		conversion.for( 'downcast' )
			.add( modelToViewAttributeConverter( 'src' ) )
			.add( modelToViewAttributeConverter( 'controls' ) );
		conversion.for( 'upcast' )
			.elementToElement( {
				view: {
					name: 'video',
					attributes: {
						src: true
					}
				},
				model: ( viewImage, modelWriter ) => modelWriter.createElement( 'video', { src: viewImage.getAttribute( 'src' ) } )
			} )
			.attributeToAttribute( {
				view: {
					name: 'video',
					key: 'controls'
				},
				model: 'controls'
			} )
			.add( viewFigureToModel() );
		editor.commands.add( 'videoInsert', new VideoInsertCommand( editor ) );
	}
}

export function createVideoViewElement( writer ) {
	const emptyElement = writer.createEmptyElement( 'video' );
	const figure = writer.createContainerElement( 'figure', { class: 'video' } );
	writer.insert( writer.createPositionAt( figure, 0 ), emptyElement );
	return figure;
}
