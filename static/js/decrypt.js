function decrypt1(_this) {
    var _next = _this.next();
    if (_this.prev().val() === "" ){
        _next.css("color","#C74451");
        _next.text("密码不能为空 !");
    }else {
        $.post("https://honmaple.com/api/encrypt", {
            password:_this.prev().val(),
            content:_this.parent().next().text()
        }, function(response){
            var _parent = _this.parent().parent();
            _parent.hide();
            _parent.after(response.data);
        }, 'json').fail(function() {
            _next.css("color","#C74451");
            _next.text("密码错误 !");
        });
    }
}

$(document).ready(function(){
    $('#entry-decrypt-password').keyup(function(e){
        if(e.keyCode == 13) {
            decrypt1($(this).next());
        }
    });
    $(".entry-decrypt").click(function(e) {
        decrypt1($(this));
    });
});