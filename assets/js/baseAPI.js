$.ajaxPrefilter(function (ajaxOpt) {
    console.log(ajaxOpt);
    ajaxOpt.url = 'http://ajax.frontend.itheima.net' + ajaxOpt.url
})