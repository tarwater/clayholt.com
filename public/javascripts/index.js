let H = window.innerHeight;
let W = window.innerWidth;

function resize() {
    H = window.innerHeight;
    W = window.innerWidth;

    document.getElementById("intro-container").style.height = H + "px";
    // document.getElementById("about-me").style.height = H + "px";
    document.getElementById("projects").style.height = H + "px";
}

resize();

window.onresize = resize;

let svg = d3.select("svg").attr("width", W).attr("height", H);

let jsonCircles = [];

let colors = [
    "#ff5454",
    "#ff8d00",
    "#15f600",
    "#00f2f9",
    "#0061fc",
    "#9a5aff",
    "#f284f9"];


for (let i = 0; i < 250; i++) {

    let c = {
        x: Math.random() * W,
        y: Math.random() * H,
        r: (Math.random() * 2 + 0.1),
        color: "white",//colors[Math.floor(Math.random() * colors.length)],
        speed: (Math.random())
    };

    jsonCircles.push(c);

}


let circles = svg.selectAll("circle").data(jsonCircles).enter().append("circle");

circles.attr("cx", function (d) {
    return d.x;
})
    .attr("cy", function (d) {
        return d.y;
    })
    .attr("r", function (d) {
        return d.r;
    })
    .style("fill", function (d) {
        return d.color;
    });


setInterval(function () {

    circles.each(function (d) {
        d.color = colors[Math.floor(Math.random() * colors.length)];

        if (d.y > 0) {
            d.y = d.y - d.speed;
        } else {
            d.y = H;
        }
    });

    circles.attr("cy", function (d) {
        return d.y;
    });
}, 25);

let aboutLink = document.getElementById("about-link");
let projectsLink = document.getElementById("projects-link");

aboutLink.onclick = function () {
    let target = document.getElementById("about-me");
    myScrollFunc(target);
};

projectsLink.onclick = function () {
    let target = document.getElementById("projects");
    myScrollFunc(target);
};

function myScrollFunc(target) {
    let nav = document.getElementById("nav-bar");

    scrollTo({
        top: target.offsetTop - nav.clientHeight,
        behavior: "smooth"
    })
}

