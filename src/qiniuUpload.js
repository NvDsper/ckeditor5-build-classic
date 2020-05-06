/*eslint-disable */
import * as qiniu from 'qiniu-js'
import axios from 'axios'
class MyUploadAdapter {
	constructor(loader) {
		// The file loader instance to use during the upload.
		this.loader = loader;
		this.qiniuData = {
			config: {
				useCdnDmain: true,
				region: qiniu.region.z1
			},
			token: '',
			putExtra: {
				fname: '',
				params: {},
				mimeType: ['image/jpg', 'image/jpeg', 'image/png', 'image/gif']
			},
			imgURL: 'http://res.lixinglong.vip/'
		}
	}
	getToken() {
		return new Promise( resolve => {
			axios.post( 'http://huajiao.jirui-tech.com/Admin/Upload/getToken', {
				fileclassify: 'mallDetail',
				type: 'image',
				frame: 1
			} ).then( res => {
				resolve( res.data.data );
			} ).catch( error => {
				alert(error);
			} );
		} );
	}
	async upload() {
		let that = this
		let data = await this.getToken()
		let file = await this.loader.file
		this.qiniuData.token = data.token
		let observable = qiniu.upload(
			file,
			data.keys,
			this.qiniuData.token,
			this.qiniuData.putExtra,
			this.qiniuData.config
		)
		this.observable = observable
		return new Promise ((resolve, reject) => {
			let observer = {
				next (res) {

				},
				error (err) {
					reject(err)
					alert('上传至七牛云失败，请重新上传或者重新登录后上传')
				  },
				complete (res) {
				let url = that.qiniuData.imgURL + res.key
				let response = {
						default: url
					}
				resolve(response)
				}
			}
			let subscription = observable.subscribe(observer)
		})
	}
	// Aborts the upload process.
	abort() {

	}
}

// ...

function MyCustomUploadAdapterPlugin(editor) {
	editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
		return new MyUploadAdapter(loader);
	};
}
export default MyCustomUploadAdapterPlugin
