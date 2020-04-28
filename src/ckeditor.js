/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

// The editor creator to use.
/*eslint-disable */
import MyCustomUploadAdapterPlugin from './upload.js'
import ClassicEditorBase from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import CKEditorInspector from '@ckeditor/ckeditor5-inspector';

import './custom.css';		// 引入自定义样式(必须在ClassicEditorBase之后引入,不然会被覆盖掉)
/* 必备插件 */
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';		// 必备插件
import UploadAdapter from '@ckeditor/ckeditor5-adapter-ckfinder/src/uploadadapter';		//  上传适配器
import CKFinder from '@ckeditor/ckeditor5-ckfinder/src/ckfinder';			// CKFinder（CKFinder文件管理器和上传器之间的桥梁）
/* 快捷插件 */
import Autoformat from '@ckeditor/ckeditor5-autoformat/src/autoformat';		// 自动套用样式(一些快捷键的使用)
import TextTransformation from '@ckeditor/ckeditor5-typing/src/texttransformation';		// 自动文本转换(可将一些字符自动转换)
import BlockToolbar from '@ckeditor/ckeditor5-ui/src/toolbar/block/blocktoolbar';		// 块工具栏
import HeadingButtonsUI from '@ckeditor/ckeditor5-heading/src/headingbuttonsui';		// 标题ui
import ParagraphButtonUI from '@ckeditor/ckeditor5-paragraph/src/paragraphbuttonui';	// 段落ui
import PasteFromOffice from '@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice';		// 从Word粘贴
/* 功能插件 */
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';		// 段落
import Heading from '@ckeditor/ckeditor5-heading/src/heading';				// 标题
/* 删除格式 */
import RemoveFormat from '@ckeditor/ckeditor5-remove-format/src/removeformat';	// 删除格式
/* 格式 */
import Alignment from '@ckeditor/ckeditor5-alignment/src/alignment';		// 对齐
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';				// 黑体
import Underline from '@ckeditor/ckeditor5-basic-styles/src/underline';		// 下划线
import Strikethrough from '@ckeditor/ckeditor5-basic-styles/src/strikethrough';		// 删除线
import Code from '@ckeditor/ckeditor5-basic-styles/src/code';				// 加入背景色
import Subscript from '@ckeditor/ckeditor5-basic-styles/src/subscript';		// 下标
import Superscript from '@ckeditor/ckeditor5-basic-styles/src/superscript';	// 上表
// import CodeBlock from '@ckeditor/ckeditor5-code-block/src/codeblock';		// 插入代码块
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';			// 斜体
import Link from '@ckeditor/ckeditor5-link/src/link';						// 链接
import List from '@ckeditor/ckeditor5-list/src/list';						// 列表
// import TodoList from '@ckeditor/ckeditor5-list/src/todolist';				// 待办清单
import Indent from '@ckeditor/ckeditor5-indent/src/indent';					// 缩进
import IndentBlock from '@ckeditor/ckeditor5-indent/src/indentblock';		// 在段落和标题中添加缩进
/* 字体 */
import Font from '@ckeditor/ckeditor5-font/src/font';						// 字体
import FontFamily from '@ckeditor/ckeditor5-font/src/fontfamily';			// 字体格式
/* 高亮 */
import Highlight from '@ckeditor/ckeditor5-highlight/src/highlight';		// 高亮显示
/* 水平线 */
import HorizontalLine from '@ckeditor/ckeditor5-horizontal-line/src/horizontalline';	// 水平线
/* 图片 */
import EasyImage from '@ckeditor/ckeditor5-easy-image/src/easyimage';		//
import Image from '@ckeditor/ckeditor5-image/src/image';					// 图片
import ImageToolbar from '@ckeditor/ckeditor5-image/src/imagetoolbar';		// 图片工具栏
import ImageCaption from '@ckeditor/ckeditor5-image/src/imagecaption';		// 图片标题
import ImageStyle from '@ckeditor/ckeditor5-image/src/imagestyle';			// 图片样式
import ImageUpload from '@ckeditor/ckeditor5-image/src/imageupload';		// 图片上传
import ImageResize from '@ckeditor/ckeditor5-image/src/imageresize';		// 图片大小调整
/* 数学和化学公式 */
//  import MathType from '@wiris/mathtype-ckeditor5';							// 数学和公式
/* 分页符 */
// import PageBreak from '@ckeditor/ckeditor5-page-break/src/pagebreak';		// 分页符
import BlockQuote from '@ckeditor/ckeditor5-block-quote/src/blockquote';	// 块引用(表示这是一块内容)
import Table from '@ckeditor/ckeditor5-table/src/table';					// 表格
import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar';		// 表格工具栏
// import MediaEmbed from '@ckeditor/ckeditor5-media-embed/src/mediaembed';	// 媒体插入



export default class ClassicEditor extends ClassicEditorBase {}

//  Plugins to include in the build.
ClassicEditor.builtinPlugins = [
	Essentials,					// 必备插件
	UploadAdapter,				//  上传适配器
	CKFinder,					// CKFinder（CKFinder文件管理器和上传器之间的桥梁）

	Autoformat,					// 自动套用样式(一些快捷键的使用)
	TextTransformation,			// 自动文本转换(可将一些字符自动转换)

	BlockToolbar,				// 块工具栏
	ParagraphButtonUI,			// 段落ui
	HeadingButtonsUI,			// 标题ui

	RemoveFormat,				// 删除格式
	Paragraph,					// 段落
	Heading,					// 标题

	Alignment,					// 对齐
	Bold,						// 黑体
	Italic,						// 斜体
	Underline,					// 下划线
	Strikethrough,				// 删除线
	Code,						// 背景色
	Subscript,					// 下标
	Superscript,				// 上标
	// CodeBlock,					// 代码块
	Link,						// 链接
	List,						// 列表
	// TodoList,					// 待办清单
	Indent,						// 缩进
	IndentBlock,				// 段落和标题中的缩进

	Font,						// 字体
	FontFamily,					// 字体类型

	Highlight,					// 高亮

	HorizontalLine,				// 水平线

	// PageBreak,					// 分页符

	EasyImage,
	Image,
	ImageCaption,				// 图片说明文字
	ImageStyle,					// 图片样式
	ImageToolbar,				// 图片工具栏
	ImageUpload,				// 图片上传
	ImageResize,				// 图片调整大小

	/* MathType, */					// 数学和公式

	BlockQuote,					// 块引用(表示这是一块内容)
	Table,						// 表格
	TableToolbar,				// 表格工具栏
	// MediaEmbed,					// 媒体插入
	PasteFromOffice,
];

//  Editor configuration.
ClassicEditor.defaultConfig = {
	// 块工具栏
	blockToolbar: [
		'paragraph', 'heading1', 'heading2', 'heading3',
		'|',
		'bulletedList', 'numberedList',
		'|',
		'blockQuote', 'imageUpload'
	],
	toolbar: {
		items: [
			'removeFormat',		// 删除格式
			'heading',			// 标题
			'|',
			'alignment',		// 对其
			'bold',				// 黑体
			'italic',			// 斜体
			'Underline',		// 下划线
			'Strikethrough',	// 删除线
			'code',				// 背景色
			'Subscript',		// 下标
			'Superscript',		// 上标
			// 'CodeBlock',		// 代码块
			'link',				// 链接
			'|',
			'fontSize', 			// 字体大小
			'fontFamily', 			// 字体类型
			'fontColor', 			// 字体颜色
			'fontBackgroundColor',	// 字体背景色
			'|',
			'highlight',		// 高亮
			/* '|',
			'MathType', 		// 数学和公式
			'ChemType', */
			// '|',
			// 'pageBreak',		// 分页符
			'|',
			'indent',			// 添加缩进
			'outdent',			// 减少缩进
			'|',
			'bulletedList',		// 网络表格
			'numberedList',		// 数字表格
			// 'todoList',			// 待办清单
			'|',
			'imageUpload',		// 图片上传
			'blockQuote',		// 块引用(表示这是一块内容)
			'insertTable',		// 表格
			// 'mediaEmbed',		// 媒体插入
			'undo',				// 撤销
			'redo'				// 重做
		]
	},
	Highlight: {
		options: [
			{
				model: 'greenMarker',
				class: 'marker-green',
				title: 'Green marker',
				color: 'rgb(25, 156, 25)',
				type: 'marker'
			},
			{
				model: 'yellowMarker',
				class: 'marker-yellow',
				title: 'Yellow marker',
				color: '#cac407',
				type: 'marker'
			},
			{
				model: 'redPen',
				class: 'pen-red',
				title: 'Red pen',
				color: 'hsl(343, 82%, 58%)',
				type: 'pen'
			}
		]
	},
	image: {
		toolbar: [
			'imageStyle:full',
			'imageStyle:side',
			'|',
			'imageTextAlternative'
		]
	},
	table: {
		contentToolbar: [
			'tableColumn',
			'tableRow',
			'mergeTableCells'
		]
	},
	//  This value must be kept in sync with the language defined in webpack.config.js.
	language: 'en'
};
ClassicEditor
    .create( document.querySelector( '#editor' ), {
		extraPlugins: [ MyCustomUploadAdapterPlugin ],
		image: {
			resizeUnit: 'px'
		}
    } ).then(editor=>{
		// console.log(editor)
		CKEditorInspector.attach(editor)
	})
    .catch( error => {
        console.log( error );
	} );

function getData(){
	console.log(ClassicEditor.getData())
}

