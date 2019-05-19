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
    var template = `
           <div class="entry-project-content col-sm-4">
           <div class="thumbnail">
                <h2 class="entry-background"><a href="{1}">{0}</a></h2>
           <div class="caption">
                 <p>{2}</p>
                 <hr/>
                 <ul class="list-inline">
                   <li><i class="fa fa-eye"></i><span>{3}</span></li>
                   <li><i class="fa fa-star"></i><span>{4}</span></li>
                   <li><i class="fa fa-code-fork"></i><span>{5}</span></li>
                 </ul>
           </div>
           </div>
           </div>`;
    $.get("https://api.github.com/users/honmaple/repos", function(response){
        var result = response.filter(function(item) {
            return item.stargazers_count >= 3;
        });
        function Template(item) {
            var pattern = GeoPattern.generate(item.name);
            return template.format(item.name,
                                   item.html_url,
                                   item.description,
                                   item.watchers_count,
                                   item.stargazers_count,
                                   item.forks_count);
        }
        $("#entry-project").html("");
        for(var i=0,len=result.length;i<len;i+=3){
            $("#entry-project").append(result.slice(i,i+3).map(Template).join(""));
        }
        $('.entry-background').each(function() {
            $(this).geopattern($(this).text());
        });
    });
});
