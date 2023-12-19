$(document).ready(function () {
    $.get("https://api.github.com/users/honmaple/repos", function (response) {
        let result = response.filter(function (item) {
            return item.stargazers_count >= 3;
        });
        function Template(item) {
            let pattern = GeoPattern.generate(item.name);
            return `
<div class="thumbnail">
  <h2 style=background-image:${pattern.toDataUrl()}><a href="${item.html_url}">${item.name}</a></h2>
  <div class="caption">
    <span>${item.description}</span>
    <ul>
      <li><i class="fa fa-eye"></i><span>${item.watchers_count}</span></li>
      <li><i class="fa fa-star"></i><span>${item.stargazers_count}</span></li>
      <li><i class="fa fa-code-fork"></i><span>${item.forks_count}</span></li>
    </ul>
  </div>
</div>`;
        }
        $("#entry-project").html("");
        for (var i = 0, len = result.length; i < len; i += 3) {
            $("#entry-project").append(result.slice(i, i + 3).map(Template).join(""));
        }
    });
});
