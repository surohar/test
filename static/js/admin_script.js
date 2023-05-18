function Menu(e){
    let list = document.querySelector('ul');
    e.name === 'menu' ? (e.name = "close", list.classList.replace("hidden", "block")) : (e.name = "menu", list.classList.replace("block", "hidden"))
}

// document.getElementById("add_promotion").addEventListener("click", function(){
//     promotion_popup = document.querySelector(".add_promotion_popup");
// });
