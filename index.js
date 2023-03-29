/**
 * 解析lrc文件，得到{time: number, word: string}[]
 */
function parseLrc() {
    const arr = lrc.split('\n');
    const result = arr.map(item => {
        const wordArr = item.split(']');
        return {
            time: parseTime(wordArr[0].substring(1)),
            word: wordArr[1]
        }
    })
    return result;
}

/**
 * 解析时间字符串，获得number（秒）
 */
function parseTime(timeString) {
    const timeArr = timeString.split(":");
    return +timeArr[0] * 60 + +timeArr[1];
}

const data = parseLrc();

const doms = {
    audio: document.querySelector("audio"),
    ul: document.querySelector(".lrc-list"),
    container: document.querySelector(".container"),
}

/**
 * 根据当前音频播放时间，获得需要高亮的歌词index
 */
function findIndex() {
    const currentTime = doms.audio.currentTime;
    for(let i = 0; i < data.length; i++) {
        if(data[i].time > currentTime) {
            return i - 1;
        }
    }

    // 如果没有找到，说明已经到歌词的最后一句
    return data.length - 1;
}

/**
 * 创建li元素
 */
function createLrcElement() {
    const frag = document.createDocumentFragment();
    for(let i = 0; i < data.length; i++) {
        const li = document.createElement("li");
        li.textContent = data[i].word;
        frag.appendChild(li);
    }

    doms.ul.appendChild(frag);
}

createLrcElement();

const containerHeihgt = doms.container.clientHeight,
    liHeight = doms.ul.children[0].clientHeight,
    maxOffset = doms.ul.clientHeight - containerHeihgt;

/**
 * 设置offset
 */
function setOffset() {
    const currentIndex = findIndex();
    let offset = liHeight * currentIndex + liHeight / 2 - containerHeihgt / 2;

    // 设置最小offset为0
    if(offset < 0) offset = 0;

    //设置最大offset
    if(offset > maxOffset) offset = maxOffset;

    doms.ul.style.transform = `translateY(-${offset}px)`;

    //设置active之前要消除之前的active
    const li = doms.ul.querySelector(".active");
    if(li) li.classList.remove("active");

    doms.ul.children[currentIndex].classList.add("active");
}

doms.audio.addEventListener("timeupdate", setOffset);