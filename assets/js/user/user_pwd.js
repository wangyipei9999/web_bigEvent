$(function () {
    layui.form.verify({
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        samePwd: function (value) {
            if (value == $('[name=oldPwd]').val()) {
                return '新旧密码不能相同'
            }
        },
        rePwd: function (value) {
            if (value != $('[name=newPwd]').val()) {
                return '新旧密码不一致'
            }
        }
    })

    // 重置密码
    $('.layui-form').on('submit', changePwd)
})

function changePwd(e) {
    e.preventDefault();
    let dataStr = $(this).serialize()
    $.ajax({
        method: 'post',
        url: '/my/updatepwd',
        data: dataStr,
        success: res => {
            console.log(res);
            if (res.status != 0) return layui.layer.msg(res.message)
            layer.msg(res.message, {
                icon: 1,
                time: 1500 //1.5秒关闭（如果不配置，默认是3秒）
            }, function () {
                localStorage.removeItem('token')
                window.top.location = '/login.html'
            });
        }
    })
}   