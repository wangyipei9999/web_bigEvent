$(function () {
    layui.form.verify({
        nickname: [/^[\S]{3,6}$/
            , '昵称必须3到6位，且不能出现空格']
    })
    // 1.加载用户信息
    getUserInfo()

    // 2.重置按钮事件
    $('#btnReset').on('click', getUserInfo)
    // 3.监听表单提交事件
    $('.layui-form').on('submit', formSubmit)
})

function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        success: res => {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败！')
            }
            layui.form.val('formUserInfo', res.data)
        }
    })
}

function formSubmit(e) {
    e.preventDefault();
    let dataStr = $(this).serialize()
    $.ajax({
        method: 'post',
        url: '/my/userinfo',
        data: dataStr,
        success: res => {
            layui.layer.msg(res.message)
            if (res.status !== 0) return
            // 如果没有出错，则通过window.parent或window.top调用父页面的方法
            window.parent.getUserInfo()
        }
    })
}

