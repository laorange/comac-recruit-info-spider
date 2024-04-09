async () => {
    const REQUEST_INTERVAL_MS = 1500;

    async function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    let ls = [];

    do {
        ls = [...ls, ...Array.from(document.querySelector("#pageLoad")?.querySelectorAll("a") ?? []).map(a => a.href)];
        await sleep(REQUEST_INTERVAL_MS);

        let nextPage = document.querySelector('.layui-laypage-next:not(.layui-disabled)');
        if (nextPage) {
            nextPage.click();
            await sleep(REQUEST_INTERVAL_MS);
        } else {
            break;
        }
    } while (true);

    console.log(ls);
    return ls;
}
