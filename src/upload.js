// import * as qiniu from 'qiniu-js'
import $ from 'jquery';
class MyUploadAdapter {
	constructor( loader ) {
		// The file loader instance to use during the upload.
		this.loader = loader;
	}
	async upload() {
		const file = await this.loader.file;
		const fd = new FormData();
		fd.append( 'file', file );
		fd.append( 'depkey', 'mediaEditor' );
		const response = setTimeout( () => {
			return 'mediaVideo/video_1587873051550.mp4';
		}, 500 );
		return new Promise( ( resolve, reject ) => {
			if ( response ) {
				alert( '上传成功' );
				resolve( {
					default: 'http://dltech.f3322.net:2048/pyamc/config-service/file/mediaVideo/video_1587873051550.mp4'
				} );
			} else {
				reject(
					alert( '上传失败' )
				);
			}
		} );
	}
}
function MyCustomUploadAdapterPlugin( editor ) {
	editor.plugins.get( 'FileRepository' ).createUploadAdapter = loader => {
		return new MyUploadAdapter( loader );
	};
}
export default MyCustomUploadAdapterPlugin;
