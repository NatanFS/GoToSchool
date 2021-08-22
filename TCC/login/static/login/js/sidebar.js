
document.addEventListener("DOMContentLoaded", () => {
    let sidebar = document.querySelector(".sidebar")
    let btn = document.querySelector("#btn")
    btn.onclick = function() {
        sidebar.classList.toggle("active")
    }
})