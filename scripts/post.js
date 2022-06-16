let posts
let currentIndex = 0

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
        loadPosts(10)
    }
}

async function getPosts(page) {
    let res = await fetch(`https://hacker-news.firebaseio.com/v0/${page}stories.json`)
    return res.json()
}

async function createPost(id) {
    let res = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
    res.json()
    .then(data => {
        
        if (data["type"] === "poll") return

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
        if (data["url"] != undefined) {
            postHeadDiv.innerHTML = `<a href="${data["url"]}">${data["title"]}</a>`
        } else {
            postHeadDiv.innerHTML = `<a href="https://news.ycombinator.com/item?id=${id}">${data["title"]}</a>`
        }
        postBodyDiv.appendChild(postHeadDiv)

        if (data["text"] != undefined) {
            const postTextDiv = document.createElement("p")
            postTextDiv.className = "posttext"
            postTextDiv.innerHTML = data["text"]
            postBodyDiv.appendChild(postTextDiv)
        }

        const postBottomInfo = document.createElement("p")
        postBottomInfo.innerHTML = `${data["score"]} points | by <a href="https://news.ycombinator.com/user?id=${data["by"]}">${data["by"]}</a> | <a href="https://news.ycombinator.com/item?id=${id}">discuss</a>`
        postBottomDiv.appendChild(postBottomInfo)
    })
}

async function loadPosts(count) {
    for (let i = 0; i < count; i++) {
        if (posts[currentIndex] != null) {
            currentIndex += 1
            await createPost(posts[currentIndex - 1])            
        } else break
    }
}