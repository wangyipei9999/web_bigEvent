$(function () {
    getUserInfo()
    $('#btnLogout').on('click', btnConfirmOut)
})

function getUserInfo() {
    $.ajax({
        method: 'get',
        url: '/my/userinfo',
        // headers: {
        //     Authorization: localStorage.getItem('token')
        // },
        success: res => {
            console.log(res);
            if (res.status !== 0) return layuiAll.layer.msg('获取失败')
            renderAvatar(res.data)
        }
    })
}

function renderAvatar(userData) {
    let userName = userData.username || userData.nickname
    $('#welcome').html(userName)
    if (userData.user_pic != null) {
        $('.layui-nav-img').attr('src', userData.user_pic).show()
        $('.text-avatar').hide()
    } else {
        $('.layui-nav-img').hide()
        let first = userName[0].toUpperCase()
        $(".text-avatar").text(first).show()
    }
}

function btnConfirmOut() {
    layer.confirm('确定退出?', { icon: 3, title: '提示' }, function (index) {
        localStorage.removeItem('token')
        location.href = "/login.html"
        layer.close(index);
    })
}