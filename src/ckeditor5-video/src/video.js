import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import VideoEditing from './video/videoediting';
import Widget from '@ckeditor/ckeditor5-widget/src/widget';
import '../theme/video.css';
export default class Image extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get requires() {
		return [ VideoEditing, Widget ];
	}

	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'Video';
	}
}
