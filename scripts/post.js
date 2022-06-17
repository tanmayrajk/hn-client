let posts
let currentIndex = 0
const cache = 'caches' in self ? await caches.open("items") : undefined

export function init(info) {
    getPosts(info["page"]).then(data => {
        posts = data
        loadPosts(20)
    })
}

window.addEventListener("scroll", onScroll)
document.body.addEventListener("touchmove", onScroll)

function onScroll() {
    const { scrollTop, scrollHeight, clientHeight} = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 60) {
        loadPosts(5)
    }
}

async function getPosts(page) {
    let res = await fetch(`https://hacker-news.firebaseio.com/v0/${page}stories.json`)
    return res.json()
}

async function getItemInfo(id) {
    let url = `https://hacker-news.firebaseio.com/v0/item/${id}.json`
    if (!cache) {
        return await fetch(url).then(data => data.json)
    } else {
        if (!(await cache.match(url))) {
            await cache.add(url)
        }
        return await cache.match(url).then(data => data.json())
    }
    

}

function createPost(id, title, url, type, by, text, score) {

    if (type === "poll") return

    const main = document.getElementsByTagName("main")

    const postDiv = document.createElement("div")
    postDiv.className = "post"
    main[0].appendChild(postDiv)

    const postFlexDiv = document.createElement("div")
    postFlexDiv.className = "postflex"
    postDiv.appendChild(postFlexDiv)

    const postBottomDiv = document.createElement("div")
    postBottomDiv.className = "postbottom"
    postDiv.appendChild(postBottomDiv)

    const postIdentifierDiv = document.createElement("div")
    postIdentifierDiv.className = "postidentifier"
    postFlexDiv.appendChild(postIdentifierDiv)


    const postBodyDiv = document.createElement("div")
    postBodyDiv.className = "postbody"
    postFlexDiv.appendChild(postBodyDiv)

    const postHeadDiv = document.createElement("h4")
    postHeadDiv.className = "posthead"
    if (url != undefined) {
        postHeadDiv.innerHTML = `<a href="${url}">${title}</a>`
    } else {
        postHeadDiv.innerHTML = `<a href="https://news.ycombinator.com/item?id=${id}">${title}</a>`
    }
    postBodyDiv.appendChild(postHeadDiv)

    if (text != undefined) {
        const postTextDiv = document.createElement("p")
        postTextDiv.className = "posttext"
        postTextDiv.innerHTML = text
        postBodyDiv.appendChild(postTextDiv)
    }

    const postBottomInfo = document.createElement("p")
    postBottomInfo.innerHTML = `${score} points | by <a href="https://news.ycombinator.com/user?id=${by}">${by}</a> | <a href="https://news.ycombinator.com/item?id=${id}">discuss</a>`
    postBottomDiv.appendChild(postBottomInfo)
}

async function loadPosts(count) {
    for (let i = 0; i < count; i++) {
        if (posts[currentIndex] != null) {
            currentIndex += 1
            await getItemInfo(posts[currentIndex - 1]).then(data => {
                createPost(data["id"], data["title"], data["url"], data["type"], data["by"], data["text"], data["score"])
            })
        } else break
    }
}