
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import VideoUploadUI from './videoupload/videouploadui';
import VideoUploadProgress from './videoupload/videouploadprogress';
import VideoUploadEditing from './videoupload/videouploadediting';

export default class VideoUpload extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'VideoUpload';
	}

	/**
	 * @inheritDoc
	 */
	static get requires() {
		return [ VideoUploadEditing, VideoUploadUI, VideoUploadProgress ];
	}
}