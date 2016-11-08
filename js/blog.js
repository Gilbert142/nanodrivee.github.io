var blogPosts;

var converter = new showdown.Converter();

$(document).ready(function() {
    $.ajax({
        url: "data/blog.json",
        error: function() {
            $("#loading-button").addClass("is-hidden");
            $("#loading-failed").removeClass("is-hidden");
        },
        success: function(data) {
            blogPosts = data;

            loadBlogPost(getURLParameter("id") || blogPosts.length);

            $("#loading-button").addClass("is-hidden");
        }
    })
});

function loadBlogPost(index) {
    changeURLParameter("id", index);
    index = parseInt(index) - 1;

    var post = blogPosts.items[index];
    $("#blog-post-title").html(post.title);
    $("#blog-post-subtitle").removeClass("is-hidden");
    $("#blog-post-published").html(post.published);
    var postTagsHtml = "";
    for(var i=0; i<post.tags.length; i++) {
        postTagsHtml += "<span class='tag " + post.tags[i].class + "'>" + post.tags[i].name + "</span>";
    }
    $("#blog-post-tags").html(postTagsHtml);
    $("#blog-post-content").html(converter.makeHtml(post.content));

    if(index>0) {
        $("#blog-post-previous").removeClass("is-hidden");
        $("#blog-post-previous").click(function() {
            loadBlogPost(index);
        });
    } else {
        $("#blog-post-previous").addClass("is-hidden");
    }
    if(index<blogPosts.length-1) {
        $("#blog-post-next").removeClass("is-hidden");
        $("#blog-post-next").click(function() {
            loadBlogPost(index+2);
        });
    } else {
        $("#blog-post-next").addClass("is-hidden");
    }
}
