import Command from '@ckeditor/ckeditor5-core/src/Command';
import { insertVideo, isVideoAllowed } from './utils';

export default class VideoInsertCommand extends Command {
	// 状态更新 是否可以插入
	refresh() {
		this.isEnabled = isVideoAllowed( this.editor.model );
	}

	execute( options ) {
		const model = this.editor.model;
		// 改变模式状态
		model.change( writer => {
			const source = Array.isArray( options.source ) ?
				options.source :
				[ options.source ];
			for ( const src of source ) {
				insertVideo( writer, model, { src } );
			}
		} );
	}
}
