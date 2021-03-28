$(document).ready(function(){
    if (!String.prototype.format) {
        String.prototype.format = function() {
            var args = arguments;
            return this.replace(/{(\d+)}/g, function(match, number) {
                return typeof args[number] != 'undefined'
                    ? args[number]
                    : match
                ;
            });
        };
    }
    function TimeFormat(time) {
        var date = new Date(time);
        Y = date.getFullYear();
        M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1);
        D = (date.getDate()+1 < 10 ? '0'+date.getDate() : date.getDate());
        h = date.getHours();
        m = date.getMinutes();
        s = date.getSeconds();
        return [Y,M,D,h,m,s];
    }
    var template = `
      <li class="timeline-item">
        <p class="timeline-date">
          {0}
        </p>
        <div class="timeline-content">
          <span class="arrow"></span>
          <span class="timeline-text">{1}</span>
        </div>
      </li>`;
    $.get("https://honmaple.com/api/timeline",{
        number:17
    }, function(response){
        var first_date = TimeFormat(response.data[0].created_at);
        var first_title = first_date[0] + '年' + first_date[1] + '月';
        var child_template = '';
        var title = '';
        var date = [];
        $("#timeline").html("");
        response.data.forEach(function(item,index) {
            date = TimeFormat(item.created_at);
            title = date[0] + '年' + date[1] + '月';
            if (first_title != title) {
                $("#timeline").append('<ul class="timeline"><h4>{0}</h4>{1}</ul>'.format(first_title,child_template));
                first_title = title;
                child_template = '';
            }
            child_template += template.format(date[1] + '月' + date[2] + '日',item.content);
        });
        if (child_template) {
            $("#timeline").append('<ul class="timeline"><h4>{0}</h4>{1}</ul>'.format(first_title,child_template));
        }
    }, 'json');
});
