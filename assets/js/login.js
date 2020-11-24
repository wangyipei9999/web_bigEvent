$(function () {
    // "去注册"点击事件
    $('#link-reg').on('click', function () {
        $('.login-box').hide()
        $('.reg-box').show()
    })

    // "去登录"点击事件
    $('#link-login').on('click', function () {
        $('.login-box').show()
        $('.reg-box').hide()
    })

    layui.form.verify({
        pwd: [/^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        // 校验密码是否一致
        repwd: function (value) {
            let pwd = $('.reg-box [name=password]').val()
            if (pwd !== value) {
                return '两次密码不一致'
            }
        }
    })

    $('#regForm').on('submit', regSubmitData)
    $('#loginForm').on('submit', loginSubmitData)
})

let baseURL = 'http://ajax.frontend.itheima.net'


// 注册具名事件
function regSubmitData(e) {
    e.preventDefault();
    let dataStr = $(this).serialize()
    console.log(dataStr);
    $.ajax({
        method: 'post',
        url: '/api/reguser',
        data: dataStr,
        success: res => {
            console.log(res);
            layui.layer.msg(res.message);
            if (res.status !== 0) return;
            // 将注册输入的用户名密码填充到登录页面的用户名密码框中
            let uname = $('.reg-box [name=username]').val().trim()
            $('.login-box [name=username]').val(uname)
            let upwd = $('.reg-box [name=password]').val().trim()
            $('.login-box [name=password]').val(upwd)
            // 清空注册的表单
            $('#regForm')[0].reset()
            // 自动触发点击事件
            $('#link-login').click()
        }
    })
}

// 登录具名事件
function loginSubmitData(e) {
    e.preventDefault()
    let dataStr = $(this).serialize()
    $.ajax({
        method: 'post',
        url: '/api/login',
        data: dataStr,
        success: res => {
            console.log(res);
            if (res.status !== 0) return layui.layer.msg(res.message)
            layer.msg(res.message, {
                icon: 6,
                time: 1500 //1.5秒关闭（如果不配置，默认是3秒）
            }, function () {
                localStorage.setItem('token', res.token)
                location.href = '/index.html'
            });
        }
    })
}
