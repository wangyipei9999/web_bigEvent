// ajaxOpt 内容为每个ajax异步对象的内容
$.ajaxPrefilter(function (ajaxOpt) {
    ajaxOpt.url = 'http://ajax.frontend.itheima.net' + ajaxOpt.url;

    // 统一为有权限的接口，设置headers请求头
    if (ajaxOpt.url.indexOf('/my/') !== -1) {
        ajaxOpt.headers = {
            Authorization: localStorage.getItem('token')
        }
    }

    // 为所有的ajax请求统一配置complete事件函数
    ajaxOpt.complete = res => {
        if (res.responseJSON == 1 && res.responseJSON.message == '身份认证失败!') {
            // 未登录，则:
            layer.confirm(res.responseJSON, message, { icon: 1, time: 1500 }, function () {
                localStorage.removeItem('token')
                location.href = "/login.html"
            });
        }
    }
})