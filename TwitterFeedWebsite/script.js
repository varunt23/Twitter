$(function() {

    loadPage()
})

const loadPage = function() {
    var $root = $("#root")
    loadTweets()
    $("#createTweet").on("click", createTweet);    
    $root.on("click", "#edit", editTweet)
    $root.on("click", "#update", updateTweet)
    $root.on("click", "#delete", deleteTweet)
    $root.on("click", "#like", likeTweet)
    $root.on("click", "#unlike", unlikeTweet)
    $root.on("click", "#retweet", makeRetweetBox)
    $root.on("click", "#tweetretweet", retweet)
    $root.on("click", "#reply", makeReplyBox)
    $root.on("click", "#replytweet", reply)
}

async function reply(event) {
    event.preventDefault()
    let ya = $("#replybox").val()
    let int = event.currentTarget.closest(".id").id
    await axios({
        method: 'post',
        url: 'https://comp426fa19.cs.unc.edu/a09/tweets',
        withCredentials: true,
        data: {
          "type": "reply",
          "parent": int,
          "body": ya
        },
    });
    $('#tweetlist').replaceWith(loadTweets())
}


async function makeReplyBox(event) {
    event.preventDefault()
    let $root = $("#root")
    let int = event.currentTarget.closest(".id")
    let ints = event.currentTarget.closest(".id").id
    let replybox = `<div> <textarea id = "replybox" class="textarea" placeholder="Reply to the tweet here" rows="2">Respond here</textarea>
    <button id = "replytweet" class="button is-dark">Reply to this Tweet</button></div>`
    $(int).append(replybox)     
}


async function retweet(event) {
    event.preventDefault()
    let ya = $("#retweetbox").val()
    let int = event.currentTarget.closest(".id").id
    const result = await axios({
        method: 'get',
        url: 'https://comp426fa19.cs.unc.edu/a09/tweets/' + int,
        withCredentials: true,
    });
    let author = result.data.author
    let body = result.data.body
    let retweetfinal = "Retweeted:       " +  ya + "   about" + "@" + author + " who tweeted: " + body
    await axios({
        method: 'post',
        url: 'https://comp426fa19.cs.unc.edu/a09/tweets',
        withCredentials: true,
        data: {
          "type": "retweet",
          "parent": int,
          "body": retweetfinal
        },
    });
    $('#tweetlist').replaceWith(loadTweets())
}


async function makeRetweetBox(event) {
    event.preventDefault()
    let $root = $("#root")
    let int = event.currentTarget.closest(".id")
    let ints = event.currentTarget.closest(".id").id
    let retweetbox = `<div> <textarea id = "retweetbox" class="textarea" placeholder="Retweet the tweet here" rows="2">Insert Additional Comment Here</textarea>
    <button id = "tweetretweet" class="button is-dark">Retweet this Tweet</button></div>`
    $(int).append(retweetbox)     
}

async function unlikeTweet(event) {
    event.preventDefault()
    let int = event.currentTarget.closest(".id").id
    await axios({
        method: 'put',
        url: 'https://comp426fa19.cs.unc.edu/a09/tweets/' + int + '/unlike',
        withCredentials: true,
    });
    $('#tweetlist').replaceWith(loadTweets())
}

async function likeTweet(event) {
    event.preventDefault()
    let int = event.currentTarget.closest(".id").id
    await axios({
        method: 'put',
        url: 'https://comp426fa19.cs.unc.edu/a09/tweets/' + int +  '/like',
        withCredentials: true,
    });
    $('#tweetlist').replaceWith(loadTweets())
}

async function deleteTweet(event) {
    event.preventDefault()
    let int = event.currentTarget.closest(".id").id
    await axios({
        method: 'delete',
        url: 'https://comp426fa19.cs.unc.edu/a09/tweets/' + int,
        withCredentials: true,
      });
    $('#tweetlist').replaceWith(loadTweets())

}

async function updateTweet(event) {
    event.preventDefault()
    let ya = $("#editbox").val()
    let int = event.currentTarget.closest(".id").id
    let url = 'https://comp426fa19.cs.unc.edu/a09/tweets/' + int; 
    await axios({
        method: 'put',
        url: url,
        withCredentials: true,
        data: {
          body:ya
        },
      });
      $('#tweetlist').replaceWith(loadTweets())
}

 async function editTweet(event) {
    event.preventDefault()
    let $root = $("#root")
    let int = event.currentTarget.closest(".id")
    let body = $(int).children("#body")
    let ints = event.currentTarget.closest(".id").id
    const result = await axios({
        method: 'get',
        url: 'https://comp426fa19.cs.unc.edu/a09/tweets/' + ints,
        withCredentials: true,
      });
    
    let content = result.data.body
    let editbox = `<div> <textarea id = "editbox" value = "${content}">${content}</textarea>
    <button id = "update">Update Tweet</button></div>`
    $(body).replaceWith(editbox)     
}

async function createTweet(event) {
    event.preventDefault()
    let content = $("#newtweet").val()
    await axios({
        method: 'post',
        url: 'https://comp426fa19.cs.unc.edu/a09/tweets',
        withCredentials: true,
        data: {
          body: content,
          type: "tweet"
        },
      });
      $('#tweetlist').replaceWith(loadTweets())
}

async function loadTweets() {
    var $root = $('#root')
    const result = await axios({
        method: 'get',
        url: 'https://comp426fa19.cs.unc.edu/a09/tweets',
        withCredentials: true,
      });
      let list = `<div id = "tweetlist">`
      for(let i = 0; i < 50; i++) {
          if(result.data[i].isMine) {
                list += 
                `<section class="hero is-primary" ><div class='row is-full'><div class="hero-body is-primary">
                <div class="container box"><div id = "${result.data[i].id}" class = "id">
                    <div id = "author" class = "title  has-text-dark"> @${result.data[i].author}</div>
                    <div id = "body" class = "body">${result.data[i].body}</div>
                    <div id = "likes">${result.data[i].likeCount} Likes</div>
                    <div id = "retweets">${result.data[i].retweetCount} Retweets</div>
                    <div id = "liked">user has liked: ${result.data[i].isLiked}</div>
                        <button id = "reply" class ="button is-light"> Reply</button>
                        <button id = "retweet" class ="button is-light"> Retweet</button>
                        <button id = "edit" class ="button is-light"> Edit</button>
                        <button id = "delete" class ="button is-light"> Delete</button>
                  </div></div>
                  </div></div></section>
              ` 
          } else {
            if(result.data[i].isLiked) {
                list += 
                `<section class="hero is-primary"><div class='row is-full'><div class="hero-body is primary">
                <div class="container box"><div id = "${result.data[i].id}" class = "id">
                    <div id = "author" class = "title has-text-dark">@${result.data[i].author}</div>
                    <div id = "body">${result.data[i].body}</div>
                    <div id = "likes">${result.data[i].likeCount} likes</div>
                    <div id = "retweets">${result.data[i].retweetCount} Retweets</div>
                    <div id = "liked">User has liked it: ${result.data[i].isLiked}</div>
                    <div>
                        <button id = "unlike" class ="button is-light">Unlike</button>
                        <button id = "reply" class ="button is-light"> Reply</button>
                        <button id = "retweet" class ="button is-light"> Retweet</button>
                    </div>
                  </div></div>
                  </div></div></section>
              `
            } else {
                list += 
                `<section class="hero is-primary" ><div class='row is-full'><div class="hero-body is-primary">
                <div class="container box"><div id = "${result.data[i].id}" class = "id">
                    <div id = "author" class = "title  has-text-dark">@${result.data[i].author}</div>
                    <div id = "body">${result.data[i].body}</div>
                    <div id = "likes">${result.data[i].likeCount} Likes</div>
                    <div id = "retweets">${result.data[i].retweetCount} Retweets</div>
                    <div id = "liked">User has liked this: ${result.data[i].isLiked}</div>
                    <div>
                        <button id = "like" class ="button is-light"> Like</button>
                        <button id = "reply" class ="button is-light"> Reply</button>
                        <button id = "retweet" class ="button is-light"> Retweet</button>
                    </div>
                  </div></div>
                  </div></div><section>
              `
            }
          }
      }
      list + `</div>`
      $root.append(list)
}