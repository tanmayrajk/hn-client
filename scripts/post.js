export const nextBtn = document.getElementById('nextbtn')
export const prevBtn = document.getElementById('prevbtn')


async function createPost(id, index) {
    let res = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
    res.json()
    .then(data => {
        
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

        const postLeftDiv = document.createElement("div")
        postLeftDiv.className = "postleft"
        postFlexDiv.appendChild(postLeftDiv)

        const postBodyDiv = document.createElement("div")
        postBodyDiv.className = "postbody"
        postFlexDiv.appendChild(postBodyDiv)

        const postIndex = document.createElement("h4")
        postIndex.innerText = index
        postLeftDiv.appendChild(postIndex)

        const postHeadDiv = document.createElement("h4")
        postHeadDiv.className = "posthead"
        postHeadDiv.innerHTML = `<a href="${data["url"]}">${data["title"]}</a>`
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

        console.log(data)
    })
}

export async function loadNextPosts(posts, start, count) {
    for (let i = 0; i < count; i++) {
        let a = await createPost(posts[i+start], i+1+start)
    }
}

export async function loadPrevPosts(posts, start, count) {
    for (let i = 0; i < count; i++) {
        let l = start - count + i + 1
        let a = await createPost(posts[l], l)
    }
}