$(function () {
    initArtCateList()
    $('#btnAddCate').on('click', showWindow)
    $('body').on('submit', '#form-add', formSubmitAddData)
    $('tbody').on('click', ".btnDel", doDelete)
    $('tbody').on('click', ".btnEdit", showEdit)
})

// 加载文章分类列表
function initArtCateList() {
    $.ajax({
        method: 'get',
        url: "/my/article/cates",
        success: res => {
            console.log(res);
            let htmlStr = template('tpl-table', res)
            $('tbody').html(htmlStr)
        }
    })
}

let layerId = null
// 显示新增窗口
function showWindow() {
    layerId = layui.layer.open({
        type: '1',
        area: ['500px', '260px'],
        title: '添加文章分类',
        content: $('#dialog-add').html()
    });
}

// 执行新增/编辑
function formSubmitAddData(e) {
    e.preventDefault()
    // 获取弹出层标题
    let title = $('.layui-layer-title').text().trim()
    if (title == "添加文章分类") {
        let dataStr = $(this).serialize()
        dataStr = dataStr.replace('Id=&', '')
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: dataStr,
            success: function (res) {
                layui.layer.msg(res.message)
                if (res.status !== 0) return
                initArtCateList()
                // 根据索引，关闭对应的弹出层
                layui.layer.close(layerId)
            }
        })
    } else {
        $.ajax({
            method: 'post',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: res => {
                layui.layer.msg(res.message)
                if (res.status !== 0) return
                initArtCateList()
                // 根据索引，关闭对应的弹出层
                layui.layer.close(layerId)
            }
        })
    }
}

function doDelete() {
    // let id = this.getAttribute('data-id')
    // h5 提供了获取data-属性的快捷方法
    let id = this.dataset.id
    layui.layer.confirm('确定删除?', function (index) {
        $.ajax({
            method: 'get',
            url: `/my/article/deletecate/${id}`,
            success: res => {
                layui.layer.msg(res.message)
                if (res.status !== 0) return
                initArtCateList()
            }
        })
        // 关闭提示框
        layui.layer.close(index)
    })
}

// 编辑按钮 获取数据填充到点击编辑后的弹出层中
function showEdit() {
    layerId = layui.layer.open({
        type: '1',
        area: ['500', '260'],
        title: '编辑文章分类',
        content: $('#dialog-add').html()
    })
    let id = this.dataset.id
    $.ajax({
        method: 'get',
        url: `/my/article/cates/${id}`,
        success: res => {
            console.log(res);
            // 将获取的文章分类数据自动装填到表单元素中
            layui.form.val('formData', res.data)
        }
    })
}