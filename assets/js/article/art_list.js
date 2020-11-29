$(function () {
    // 时间过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)
        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())
        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())
        return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
    }
    initArtList()
    initCate()
    $('#formSearch').on('submit', doSearch)
    $('tbody').on('click', '.btn-delete', delList)
})

function padZero(n) {
    return n > 9 ? n : n + 0
}

let q = {
    pagenum: 1, //当前页码
    pagesize: 2,  // 页容量
    cate_id: '',  // 分类筛选id
    state: ''  // 发布状态
}

// 初始化文章列表
function initArtList() {
    $.ajax({
        method: 'GET',
        url: '/my/article/list',
        data: q,
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取文章列表失败！')
            }
            // 使用模板引擎渲染页面的数据
            var htmlStr = template('tpl-list', res)
            $('tbody').html(htmlStr)
            // 调用渲染分页的方法
            renderPage(res.total)
        }
    })
}

// 初始化文章分类
function initCate() {
    $.ajax({
        method: 'GET',
        url: '/my/article/cates',
        success: function (res) {
            if (res.status !== 0) {
                return layer.msg('获取分类数据失败！')
            }
            // 调用模板引擎渲染分类的可选项
            var htmlStr = template('tpl-cate', res)
            $('[name=cate_id]').html(htmlStr)
            // 通过 layui 重新渲染表单区域的UI结构
            layui.form.render()
        }
    })
}

// 查询事件处理函数
function doSearch(e) {
    e.preventDefault();
    let cate_id = $('[name=cate_id]').val()
    let state = $('[name=state]').val()
    q.cate_id = cate_id
    q.state = state
    initArtList()
}

// laypage中的jump函数触发时机
//  1.laypage.render 会执行首次触发
//  2.点击页码时触发
//  3.切换页容量下拉框时触发
function renderPage(total) {
    layui.laypage.render({
        elem: 'pageBox', // 分页容器id
        count: total, // 总数据条数
        limit: q.pagesize, // 每页显示几条数据
        curr: q.pagenum, // 设置默认被选中的分页
        limits: [2, 5, 10, 15, 20], // 页容量
        layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'], // 页码条功能
        jump: function (obj, first) {
            q.pagenum = obj.curr
            q.pagesize = obj.limit // 获取下拉框中选中的页容量设置给分页查询参数
            if (!first) {
                initArtList()
            }
        }
    })
}

// 删除业务
function delList() {
    let id = this.dataset.id
    layui.layer.confirm('确定删除?', function (index) {
        let rows = $('tbody tr .btn-delete').length
        $.ajax({
            method: 'get',
            url: '/my/article/delete/' + id,
            success: res => {
                layui.layer.msg(res.message)
                if (res.status != 0) return
                if (rows <= 1) {
                    // 如果页码是1就保持是1 ，如果不等于1就减1
                    q.pagenum = q.pagenum == 1 ? 1 : q.pagenum - 1
                }
                initArtList()
            }
        })
        layui.layer.close(index)
    })
}