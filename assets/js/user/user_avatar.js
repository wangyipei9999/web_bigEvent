$(function () {
    initCropper()
    // 为上传按钮添加点击事件
    $('#btnUpload').on('click', btnUploadImage)
    // 为文件选择框 绑定oncahnge事件，获取选中文件信息
    $('#file').on('change', chooseImage)
    // 将选中的文件信息上传到服务器，重新渲染用户信息
    $('#btnSureUpload').on('click', btnSureUploadImage)
})

let $image = null
// 配置选项
const options = {
    // 纵横比
    aspectRatio: 1,
    // 指定预览区域
    preview: '.img-preview'
}

function initCropper() {
    // 1.1 获取裁剪区域的 DOM 元素
    $image = $('#image')

    // 1.3 创建裁剪区域
    $image.cropper(options)
}

function btnUploadImage() {
    $('#file').click()
}

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

function btnSureUploadImage() {
    let dataURL = $image
        .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
            width: 100,
            height: 100
        })
        .toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
    $.ajax({
        method: 'post',
        url: '/my/update/avatar',
        data: {
            avatar: dataURL
        },
        success: res => {
            if (res.status != 0) return layui.layer.msg('更换头像失败')
            layui.layer.msg('更换头像成功')
            window.parent.getUserInfo()
        }
    })

}
