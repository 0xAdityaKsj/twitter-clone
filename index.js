import { tweetsData } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

let tweets = tweetsData
let tweetsFromLocalStorage = JSON.parse(localStorage.getItem('myTweets'))

if (tweetsFromLocalStorage) {
    tweets = tweetsFromLocalStorage
    render()
}

document.addEventListener('click', function (e) {
    if (e.target.dataset.like) {
        handleLikeClick(e.target.dataset.like)
    }
    else if (e.target.dataset.retweet) {
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if (e.target.dataset.reply) {
        handleReplyClick(e.target.dataset.reply)
    }
    else if (e.target.id === 'tweet-btn') {
        handleTweetBtnClick()
    }
    else if (e.target.id === 'reply-btn') {
        handleReplyBtnClick(e.target.parentElement.id)
    }
    else if (e.target.dataset.delete) {
        handleDeleteClick(e.target.dataset.delete)
    }

    else if (e.target.id === 'night') {
        nightmode()
    }
})

function handleLikeClick(tweetId) {
    const targetTweetObj = tweets.filter(function (tweet) {
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObj.isLiked) {
        targetTweetObj.likes--
    }
    else {
        targetTweetObj.likes++
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    localStorage.setItem("myTweets", JSON.stringify(tweets))
    render()
}

function handleRetweetClick(tweetId) {
    const targetTweetObj = tweets.filter(function (tweet) {
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObj.isRetweeted) {
        targetTweetObj.retweets--
    }
    else {
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    localStorage.setItem("myTweets", JSON.stringify(tweets))
    render()
}

function handleReplyClick(replyId) {
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
}

function handleTweetBtnClick() {
    const tweetInput = document.getElementById('tweet-input')

    if (tweetInput.value) {
        tweets.unshift({
            handle: `@Aditya`,
            profilePic: `images/aditya.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        })

        localStorage.setItem("myTweets", JSON.stringify(tweets))
        render()
        tweetInput.value = ''
    }
}

function handleReplyBtnClick(replyId) {
    let theUuid = replyId.substring(8)
    let replyInput = document.getElementById(`reply-${theUuid}`)

    const theTweet = tweets.filter(function (tweet) {
        return tweet.uuid === theUuid;
    })[0]

    if (replyInput.value) {
        theTweet.replies.unshift({
            handle: `@Aditya`,
            profilePic: `images/aditya.png`,
            tweetText: replyInput.value,
        })
    }
    render()
    replyInput.value = ''
}

function handleDeleteClick(tweetId) {

    const theTweet = tweetsFromLocalStorage.filter(function (tweet) {
        return tweet.uuid === tweetId;
    })[0]

    tweets.splice(tweets.indexOf(theTweet), 1)
    localStorage.setItem("myTweets", JSON.stringify(tweets))
    render()

}

function nightmode() {
    document.querySelector('.main').classList.toggle('night')
    document.querySelector('.tweet-btn').classList.toggle('night-inverse')
    document.querySelector('.reply-btn').classList.toggle('night-inverse')
    document.querySelector('textarea').classList.toggle('night')
    document.querySelector('.reply-input').classList.toggle('night')
}


function getFeedHtml() {
    let feedHtml = ``

    tweets.forEach(function (tweet) {

        let likeIconClass = ''

        if (tweet.isLiked) {
            likeIconClass = 'liked'
        }

        let retweetIconClass = ''

        if (tweet.isRetweeted) {
            retweetIconClass = 'retweeted'
        }

        let repliesHtml = ''

        if (tweet.replies.length > 0) {
            tweet.replies.forEach(function (reply) {
                repliesHtml += `

<div class="tweet-reply">
    <div class="tweet-inner">
        <img src="${reply.profilePic}" class="profile-pic">
            <div>
                <p class="handle">${reply.handle}</p>
                <p class="tweet-text">${reply.tweetText}</p>
            </div>
        </div>
</div>
`
            })
        }


        feedHtml += `
<div class="tweet">
    <div class="tweet-inner">
        <img src="${tweet.profilePic}" class="profile-pic">
        <div>
            <p class="handle">${tweet.handle}</p>
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                    <i class="fa-regular fa-comment-dots"
                    data-reply="${tweet.uuid}"
                    ></i>
                    ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-heart ${likeIconClass}"
                    data-like="${tweet.uuid}"
                    ></i>
                    ${tweet.likes}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-retweet ${retweetIconClass}"
                    data-retweet="${tweet.uuid}"
                    ></i>
                    ${tweet.retweets}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-trash" data-delete="${tweet.uuid}"></i> 
                </span>
            </div>   
        </div>            
    </div>
    <div class="hidden" id="replies-${tweet.uuid}">
        <textarea placeholder="add your reply here" id="reply-${tweet.uuid}" class="reply-input"></textarea>
        <button id="reply-btn" class="reply-btn">reply</button>
        ${repliesHtml}
    </div>   
</div>
`
    })
    return feedHtml
}

function render() {
    document.getElementById('feed').innerHTML = getFeedHtml()
}

render()
