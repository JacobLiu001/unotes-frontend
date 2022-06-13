function changeFrontpageLayout() {
    if (window.innerWidth < 800) {
        document.querySelector('#frontpage').style.flexDirection = "column";
        document.querySelector("#frontpage-image").style.maxWidth = "240px";
    } else {
        document.querySelector('#frontpage').style.flexDirection = "row";
        document.querySelector("#frontpage-image").style.maxWidth = "480px";
    }
}

changeFrontpageLayout()
window.addEventListener('resize', changeFrontpageLayout);
