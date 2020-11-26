$.ajaxPrefilter(ajaxOpt => {
    console.log(ajaxOpt);
    ajaxOpt.url = 'http://ajax.frontend.itheima.net' + ajaxOpt.url;

    if (ajaxOpt.url.indexOf('/my') !== -1) {
        ajaxOpt.headers = {
            Authorization: localStorage.getItem('token')
        }
    }

    ajaxOpt.complete = res => {
        console.log(res.responseJSON);
        if (res.responseJSON == 1 && res.responseJSON.message == "身份认证失败!") {
            layer.confirm(res.responseJSON, message, { icon: 1, time: 1500 }, function () {
                localStorage.removeItem('token')
                location.href = "/login.html"
            })
        }
    }
})