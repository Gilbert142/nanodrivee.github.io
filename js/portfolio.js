var portfolioData;

var converter = new showdown.Converter();

$(document).ready(function() {
    $.ajax({
        url: "data/portfolio.json",
        error: function() {
            $("#loading-button").addClass("is-hidden");
            $("#loading-failed").removeClass("is-hidden");
        },
        success: function(data) {
            portfolioData = JSON.parse(data);

            var portfolioSectionsHtml = "<li id='portfolio-section-All' class='portfolio-section'><a onclick='loadPortfolioSection();'>All</a></li>";
            for(var i=0; i<portfolioData.categories.length; i++) {
                portfolioSectionsHtml += "<li id='portfolio-section-" + portfolioData.categories[i].split(" ").join("-") + "' class='portfolio-section'><a onclick='loadPortfolioSection(\"" + portfolioData.categories[i] + "\");'>" + portfolioData.categories[i] + "</a></li>";
            }
            $("#portfolio-sections").html(portfolioSectionsHtml);
            $("#portfolio-section-" + (getURLParameter("category") || "All").split(" ").join("-")).addClass("is-active");

            loadPortfolioSection(getURLParameter("category"));

            $("#loading-button").addClass("is-hidden");
        }
    })
});

function loadPortfolioSection(section) {
    $(".portfolio-section").removeClass("is-active");
    $("#portfolio-section-" + (section || "All").split(" ").join("-")).addClass("is-active");

    changeURLParameter("category", section || "");

    var portfolioItems = portfolioData.items.filter(function(item) {
        return !section || item.category==section;
    });

    var portfolioItemsHtml = "";
    if(portfolioItems.length>0) {
        portfolioItemsHtml += "<div class='columns'>";
        for(var i=0; i<portfolioItems.length; i++) {
            portfolioItemsHtml += "<div class='column is-one-quarter'><center><div class='card' style='text-align: left;'><div class='card-image'><figure class='image'><img src='" + portfolioItems[i].preview_image + "'></figure></div><div class='card-content' style='max-height: 255px;overflow-y: scroll;'><h3 class='title'>" + portfolioItems[i].name + "</h3><h5 class='subtitle'>" + portfolioItems[i].description + "</h5></div><footer class='card-footer'><a class='card-footer-item modal-button' data-target='#portfolio-modal-" + i + "'>More Info</a><a class='card-footer-item' href='" + portfolioItems[i].link + "'>Link to Project</a></footer></div></center></div>";
            portfolioItemsHtml += "<div id='portfolio-modal-" + i + "' class='modal' style='text-align: left;'><div class='modal-background'></div><div class='modal-card'><header class='modal-card-head'><p class='modal-card-title'>" + portfolioItems[i].name + "</p><a class='delete' onclick='$(\"html\").removeClass(\"is-clipped\");$(this).parent().parent().parent().removeClass(\"is-active\");'></a></header><section class='modal-card-body'><div class='content'>" + converter.makeHtml(portfolioItems[i].content) + "</div></section><footer class='modal-card-foot'><a class='button is-info' href='" + portfolioItems[i].link + "'><span>Link to Project</span><span class='icon is-small'><i class='fa fa-chevron-right'></i></span></button></footer></div></div>"

            if(i % 4==3 && i!=portfolioItems.length-1 && i!=0) {
    			portfolioItemsHtml += "</div><div class='columns'>";
    		}
        }
        portfolioItemsHtml += "</div>";
    } else {
        portfolioItemsHtml += "<div class='notification is-warning' >Nothing found in this category.</div>"
    }

    $("#portfolio-items").html(portfolioItemsHtml);

    $(".modal-button").click(function() {
        console.log("hello");
        var target = $(this).data("target");
        $("html").addClass("is-clipped");
        $(target).addClass("is-active");
    });
    $(".modal-background, .modal-close").click(function() {
        $("html").removeClass("is-clipped");
        $(this).parent().removeClass("is-active");
    });
    $(".modal-card-head .delete, .modal-card-foot .button").click(function() {
        $("html").removeClass("is-clipped");
        $("#modal-ter").removeClass("is-active");
    });
}
