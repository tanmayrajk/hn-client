import { prevBtn, nextBtn, loadPrevPosts, loadNextPosts } from "./post.js";

let posts
let currentIndex = 0

async function getPosts() {
    let res = await fetch("https://hacker-news.firebaseio.com/v0/newstories.json")
    return res.json()
}

getPosts().then(data => {
    posts = data
    loadNextPosts(posts, 0, 15)
    currentIndex += 15
})

nextBtn.addEventListener("click", (e) => {
    e.preventDefault()
    document.getElementsByTagName("main")[0].innerText = " "
    loadNextPosts(posts, currentIndex, 15)
    currentIndex += 15
})

prevBtn.addEventListener("click", (e) => {
    e.preventDefault()
    document.getElementsByTagName("main")[0].innerText = " "
    loadPrevPosts(posts, currentIndex-15, 15)
    currentIndex -= 15
})

