// partials-loader.js
const tabs = document.querySelectorAll('#mainTabs .nav-link');
const content = document.getElementById('tabContent');

tabs.forEach(tab => {
    tab.addEventListener('click', async (e) => {
        e.preventDefault();
        // 탭 활성화 스타일
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const name = tab.getAttribute('data-tab');
        try {
            // public/partials/tab{name}.html 을 불러옵니다
            const res = await fetch(`partials/${name}.html`);
            if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
            const html = await res.text();
            content.innerHTML = html;
            // 해당 탭 이름으로 app.js의 initTab 호출
            import('./app.js').then(m => m.initTab(name));
        } catch (err) {
            console.error(`partials/${name}.html 로드 실패:`, err);
            content.innerHTML = `<div class="alert alert-danger">콘텐츠를 불러올 수 없습니다.</div>`;
        }
    });
});

// 페이지 로드 시 첫 번째 탭 자동 클릭
if (tabs.length > 0) tabs[0].click();
