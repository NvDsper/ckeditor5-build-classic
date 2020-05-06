import { findOptimalInsertionPosition, toWidget, isWidget } from '@ckeditor/ckeditor5-widget/src/utils';

// 检查video标签是否符合规范，能正确插入到容器中
//
// @returns {Boolean}
function isVideoAllowedInparent( selection, schema, model ) {
	// 获取父元素
	const parent = getInsertVideoParent( selection, model );
	// 检测父元素是否可以插入
	return schema.checkChild( parent, 'video' );
}
// 获取父元素
// @returns {node}
function getInsertVideoParent( selection, model ) {
	const insertAt = findOptimalInsertionPosition( selection, model );
	const parent = insertAt.parent;

	if ( parent.isEmpty && !parent.is( '$root' ) ) {
		return parent.parent;
	}
	return parent;
}

// 检测选择器是否是一个对象
//
// @returns {Boolean}
function checkSelectionOnObject( selection, schema ) {
	const selectedElement = selection.getSelectedElement();

	return selectedElement && schema.isObject( selectedElement );
}

// 检测是否为另一个video
function isInOtherVideo( selection ) {
	return [ ...selection.focus.getAncestors() ].every( ancestor => !ancestor.is( 'video' ) );
}

export function isVideoAllowed( model ) {
	// 标签基本规范定义
	const schema = model.schema;
	// 标签选择器
	const selection = model.document.selection;

	return isVideoAllowedInparent( selection, schema, model ) &&
   !checkSelectionOnObject( selection, schema ) &&
    isInOtherVideo( selection );
}

export function insertVideo( writer, model, attributes = {} ) {
	// 创建video虚拟结点 属性为src
	const videoElement = writer.createElement( 'video', attributes );
	// 获得选择器的位置
	const insertAtSelection = findOptimalInsertionPosition( model.document.selection, model );
	// 插入模型中
	model.insertContent( videoElement, insertAtSelection );

	// Inserting an video might've failed due to schema regulations.
	if ( videoElement.parent ) {
		writer.setSelection( videoElement, 'on' );
	}
}

export function toVideoWidget( viewElement, writer, label ) {
	writer.setCustomProperty( 'video', true, viewElement );

	return toWidget( viewElement, writer, { label: labelCreator } );

	function labelCreator() {
		const imgElement = viewElement.getChild( 0 );
		const altText = imgElement.getAttribute( 'controls' );

		return altText ? `${ altText } ${ label }` : label;
	}
}

export function isVideoWidget( viewElement ) {
	return !!viewElement.getCustomProperty( 'Video' ) && isWidget( viewElement );
}

/**
 * Returns an Video widget editing view element if one is selected.
 *
 * @param {module:engine/view/selection~Selection|module:engine/view/documentselection~DocumentSelection} selection
 * @returns {module:engine/view/element~Element|null}
 */
export function getSelectedVideoWidget( selection ) {
	const viewElement = selection.getSelectedElement();

	if ( viewElement && isVideoWidget( viewElement ) ) {
		return viewElement;
	}

	return null;
}
