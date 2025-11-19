async function usememos(api) {
    const memoTag = {
        extensions: [{
            name: 'memoTag',
            level: 'inline',
            start(src) { return src.indexOf('#'); },
            tokenizer(src) {
                const rule = /^#([^\s#]+)(\s*)/;
                const match = rule.exec(src);
                if (match) {
                    let html = `<span class="memo-tag">#${match[1]}</span>`;
                    if (match[2].endsWith('\n')) {
                        html = `${html}<br />`
                    }
                    return {
                        type: 'memoTag',
                        raw: match[0],
                        html: html
                    };
                }
            },
            renderer(token) {
                return token.html;
            }
        }],
    };
    marked.setOptions({
        breaks: true,
        smartypants: false,
    });
    marked.use(memoTag);

    const icons = {
        "thumbtack": `<path fill="#C10015" d="M160 96C160 78.3 174.3 64 192 64L448 64C465.7 64 480 78.3 480 96C480 113.7 465.7 128 448 128L418.5 128L428.8 262.1C465.9 283.3 494.6 318.5 507 361.8L510.8 375.2C513.6 384.9 511.6 395.2 505.6 403.3C499.6 411.4 490 416 480 416L160 416C150 416 140.5 411.3 134.5 403.3C128.5 395.3 126.5 384.9 129.3 375.2L133 361.8C145.4 318.5 174 283.3 211.2 262.1L221.5 128L192 128C174.3 128 160 113.7 160 96zM288 464L352 464L352 576C352 593.7 337.7 608 320 608C302.3 608 288 593.7 288 576L288 464z"/>`
    };

    function formatTime(time) {
        var date = new Date(time);
        Y = date.getFullYear();
        M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
        D = (date.getDate() + 1 < 10 ? '0' + date.getDate() : date.getDate());
        h = date.getHours();
        m = date.getMinutes();
        s = date.getSeconds();
        return [Y, M, D, h, m, s];
    }

    function renderTitle(memo) {
        let template = `<span style="font-weight: bold;">honmaple</span>`;
        if (memo.pinned) {
            template = `${template}<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width="1rem" height="1rem">${icons["thumbtack"]}</svg>`
        }
        return `<div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.5rem">${template}</div>`;
    }

    function renderContent(memo) {
        let resources = memo.resources.map((r) => {
            const src = `${api}/file/${r.name}/${r.filename}?thumbnail=true`;
            const style = "max-height: 16rem;border-radius: 0.5rem;object-fit: contain;";
            return `<a href="${src}" data-fancybox="image"><img data-src="${src}" class="lazyload" style="${style}" /></a>`;
        });
        if (resources.length > 0) {
            return `<div>${marked.parse(memo.content)}
            <div style="display: flex;gap: 0.5rem; align-items: baseline;">${resources.join("")}</div>
            </div>`;
        }
        return `<div>${marked.parse(memo.content)}</div>`;
    }

    function renderHTML(memos) {
        memos.sort(function(a, b) {
            if (a.pinned && b.pinned) {
                return b.createTime - a.createTime;
            }
            if (a.pinned) {
                return -1;
            }
            if (b.pinned) {
                return 1;
            }
            return b.createTime - a.createTime;
        });

        let templates = [];
        for (let memo of memos) {
            let date = formatTime(memo.createTime);
            let template = `
<div style="display: flex; align-items: start; justify-items: start; gap: 1rem; background-image: linear-gradient(135deg, var(--bg-color6), transparent); border-radius: 0.5rem; padding: 0.5rem 1rem;">
  <img src="https://s.libforest.com/images/header/header.png" style="width: 3rem; height: 3rem" />
  <div style="display: flex; flex-direction: column; gap: 0.5rem; width: 100%;">
    ${renderTitle(memo)}
    ${renderContent(memo)}
    <div style="font-size: 0.875rem; color: grey;">${date[0]}-${date[1]}-${date[2]} ${date[3]}:${date[4]}</div>
  </div>
</div>
`;
            templates.push(template);
        }
        return `<div style="display: flex; flex-direction: column; gap: 1rem">${templates.join("")}</div>`;
    }

    async function getMemoList(endpoint) {
        const resp = await fetch(`${endpoint}/api/v1/memos`);
        const data = await resp.json();
        return data.memos
    }
    return renderHTML(await getMemoList(api));
}

document.addEventListener("DOMContentLoaded", async () => {
    let dom = document.querySelector("#memos");
    let api = dom.getAttribute("data-src");
    if (api && api != "") {
        dom.innerHTML = await usememos(api);
    }
});
