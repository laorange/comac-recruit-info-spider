() => {
    function parseContent() {
        let childrenList = Array.from(
            document.querySelector(".layui-card-body.answer")?.firstElementChild?.children ?? []
        )

        let title = undefined;
        let infoDict = {};
        for (const child of childrenList) {
            if (child.tagName.toUpperCase() === "LABEL") {
                title = `${child.innerText}`.replace(":", "").replace("：", "").trim();
                continue
            }

            if (title === undefined) {
                continue;
            }

            // br => continue
            if (child.tagName.toUpperCase() === "BR") {
                continue;
            }

            else {
                let _content = child.innerText;
                if (infoDict[title] === undefined) {
                    infoDict[title] = "";
                }
                infoDict[title] += _content + "\n";
            }
        }

        for (const key in infoDict) {
            infoDict[key] = infoDict[key].trim();
        }

        console.log(infoDict);

        return infoDict;
    }

    function parseHeader() {
        let h = document.querySelector(".gwjs");

        let infoDict = {};

        infoDict["岗位名称"] = h.querySelector(".zp-title span").innerText;

        let couples = Array.from(h.querySelectorAll(".zp-ftitle div") ?? []);
        for (const couple of couples) {
            let key = couple.querySelector(".vlab").innerText;
            key = key.replace(":", "").replace("：", "").trim();
            infoDict[key] = couple.querySelector(".vsap").innerText;
        }

        console.log(infoDict);

        return infoDict;
    }

    let header = parseHeader();
    let content = parseContent();

    let result = Object.assign(header, content);
    console.log(result);
    return result;
}