let navbarHTML = `<header id="navbar" class="navbar">
    <ul>
    <img src="/imgs/favicon.png"/>
    <li><a href="/#">Home</a></li>
    <li class="dropdown">
        <a href="javascript:void(0)" class="dropbtn">About</a>
        <div class="dropdown-content">
            <a href="/about/">About UNotes</a>
            <a href="/about/team.html">Our Team</a>
            <a href="/about/faq.html">FAQ</a>
        </div>
    </li>
    <li><a href="/downloads/">Downloads</a></li>
    <li><a href="/contribute/">Contribute</a></li>
    </ul>
</header>`

let body = document.querySelector("body")
body.innerHTML = navbarHTML + body.innerHTML;

document.querySelectorAll("#navbar li > a").forEach(p => {
    let isActive = (p.innerHTML.toLowerCase().includes("about") && window.location.href.includes("/about.html")) ||
    (p.href == window.location.href);
    if (isActive) {
        p.parentElement.classList.add("active")
        // p.removeAttribute("href")
    }
})

// function changeFrontpageLayout() {
//     if (window.innerWidth < 800) {
//         document.querySelectorAll("#navbar li a, #navbar li .dropbtn").forEach((p) => {
//             p.style.fontSize = "14px";
//         })
//     } else {
//         document.querySelectorAll("#navbar li a, #navbar li .dropbtn").forEach((p) => {
//             p.style.fontSize = "18px";
//         })
//     }
// }

// changeFrontpageLayout()
// window.addEventListener('resize', changeFrontpageLayout);
