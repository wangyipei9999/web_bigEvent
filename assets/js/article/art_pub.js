$(function () {
    // 初始化富文本编辑器
    initEditor()
    // 1.请求分类下拉框数据
    initCateList()
    // 初始化图片裁剪器
    initImageCropper()
    // 2.为选择封面按钮添加事件
    $('#btnChoose').on('click', () => {
        $('#coverFile').click()
    })
    // 3.为文件选择框 绑定oncahnge事件，获取选中文件信息
    $('#coverFile').on('change', chooseImage)
    // 4.为发布和草稿按钮添加事件
    $('#btnPublish').on('click', publish)
    $('#btnDraft').on('click', draft)
    // 5.为表单绑定提交事件
    $('#form-pub').on('submit', doSubmit)
})

// 1.请求分类下拉框数据
function initCateList() {
    $.ajax({
        method: 'get',
        url: '/my/article/cates',
        success: res => {
            let htmlStr = template('tpl-opt', res)
            $('#cate_id').html(htmlStr)
            layui.form.render()
        }
    })
}

let $image = null
let options = null

// 初始化图片裁剪器
function initImageCropper() {
    // 1. 初始化图片裁剪器
    $image = $('#image')

    // 2. 裁剪选项
    options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)
}

// 3.为文件选择框 绑定oncahnge事件，获取选中文件信息
function chooseImage(e) {
    let fileList = e.target.files
    console.log(fileList);
    if (fileList.length == 0) {
        return layui.layer.msg('请选择图片')
    }
    // 获取选中的第一个文件信息对象
    let file = fileList[0]
    // 创建文件虚拟路径
    let newImgURL = URL.createObjectURL(file)
    // 调用裁剪组件，销毁之前的图片，设置新的虚拟路径给他，并重新创建裁剪区
    $image
        .cropper('destroy')      // 销毁旧的裁剪区域
        .attr('src', newImgURL)  // 重新设置图片路径
        .cropper(options)        // 重新初始化裁剪区域
}

// 发布和草稿点击事件
let state = '已发布'
function publish() {
    state = '已发布'
}

function draft() {
    state = '草稿'
}

function doSubmit(e) {
    //阻断默认提交
    e.preventDefault();
    // 获取数据装入formData
    let fd = new FormData(this)
    // 为formData追加state
    fd.append('state', state)
    // 为formData追加剪裁后的文件数据
    $image
        .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
            width: 400,
            height: 280
        })
        .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
            // 得到文件对象后，进行后续的操作
            fd.append('cover_img', blob)
        })
    // 异步请求
    $.ajax({
        method: 'post',
        url: '/my/article/add',
        data: fd,
        processData: false,
        contentType: false,
        success: res => {
            if (res.status != 0) return layui.layer.msg(res.message)
            window.location = '/article/art_list.html'
        }
    })
}