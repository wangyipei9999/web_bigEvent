// 在dom树创建完成之后开始执行
$(function () {
    getUserInfo()
    $('#btnLogout').on('click', btnConfirmOut)
})

// 加载用户信息
function getUserInfo() {
    $.ajax({
        method: 'get',
        url: '/my/userinfo',
        // headers: {
        //     Authorization: localStorage.getItem('token')
        // },
        success: res => {
            if (res.status !== 0) return layui.layer.msg('获取失败')
            renderAvatar(res.data)
        },
        // 不论成功还是失败都会调用complete
        complete: res => {
            // 使用res.responseJSON
            res.responseJSON
        }
    })
}

// 渲染用户信息
function renderAvatar(userData) {
    // 获取用户名
    let userName = userData.nickname || userData.username;
    // 设置给welcome span标签
    $('#welcome').html(userName)
    if (userData.user_pic != null) {
        // 1.有头像
        $('.layui-nav-img').attr('src', userData.user_pic).show()
        // 隐藏文本头像
        $('.text-avatar').hide()
    } else {
        // 2.没有头像，使用文本头像
        $('.layui-nav-img').hide()
        let first = userName[0].toUpperCase()
        $('.text-avatar').text(first).show()
    }
}

function btnConfirmOut() {
    layer.confirm('确定退出?', { icon: 3, title: '提示' }, function (index) {
        // 删除 loacalstorage中的token值，然后跳转到login.item
        localStorage.removeItem('token');
        location.href = '/login.html';
        layer.close(index);
    });
}