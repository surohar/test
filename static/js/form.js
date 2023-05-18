

window.open("tips.html", "TIP", "width=400, height=300, status=0, menubar=0, location=0, resizable=0, directories=0, toolbar=0, scrollbar=0")




var form = document.getElementById("my-form");
      
async function handleSubmit(event) {
  event.preventDefault();
  var status = document.getElementById("my-form-status");
  var data = new FormData(event.target);
  fetch(event.target.action, {
    method: form.method,
    body: data,
    headers: {
        'Accept': 'application/json'
    }
  }).then(response => {
    if (response.ok) {
      status.innerHTML = "Thanks for your submission!";
      form.reset()
    } else {
      response.json().then(data => {
        if (Object.hasOwn(data, 'errors')) {
          status.innerHTML = data["errors"].map(error => error["message"]).join(", ")
        } else {
          status.innerHTML = "Oops! There was a problem submitting your form"
        }
      })
    }
  }).catch(error => {
    status.innerHTML = "Oops! There was a problem submitting your form"
  });
}
form.addEventListener("submit", handleSubmit)
var x, i, j, l, ll, selElmnt, a, b, c;
/* Look for any elements with the class "custom-select": */
x = document.getElementsByClassName("custom-select");
l = x.length;
for (i = 0; i < l; i++) {
selElmnt = x[i].getElementsByTagName("select")[0];
ll = selElmnt.length;
/* For each element, create a new DIV that will act as the selected item: */
a = document.createElement("DIV");
a.setAttribute("class", "select-selected");
a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
x[i].appendChild(a);
/* For each element, create a new DIV that will contain the option list: */
b = document.createElement("DIV");
b.setAttribute("class", "select-items select-hide");
for (j = 1; j < ll; j++) {
/* For each option in the original select element,
create a new DIV that will act as an option item: */
c = document.createElement("DIV");
c.innerHTML = selElmnt.options[j].innerHTML;
c.addEventListener("click", function(e) {
  /* When an item is clicked, update the original select box,
  and the selected item: */
  var y, i, k, s, h, sl, yl;
  s = this.parentNode.parentNode.getElementsByTagName("select")[0];
  sl = s.length;
  h = this.parentNode.previousSibling;
  for (i = 0; i < sl; i++) {
    if (s.options[i].innerHTML == this.innerHTML) {
      s.selectedIndex = i;
      h.innerHTML = this.innerHTML;
      y = this.parentNode.getElementsByClassName("same-as-selected");
      yl = y.length;
      for (k = 0; k < yl; k++) {
        y[k].removeAttribute("class");
      }
      this.setAttribute("class", "same-as-selected");
      break;
    }
  }
  h.click();
});
b.appendChild(c);
}
x[i].appendChild(b);
a.addEventListener("click", function(e) {
/* When the select box is clicked, close any other select boxes,
and open/close the current select box: */
e.stopPropagation();
closeAllSelect(this);
this.nextSibling.classList.toggle("select-hide");
this.classList.toggle("select-arrow-active");
});
}

function closeAllSelect(elmnt) {
/* A function that will close all select boxes in the document,
except the current select box: */
var x, y, i, xl, yl, arrNo = [];
x = document.getElementsByClassName("select-items");
y = document.getElementsByClassName("select-selected");
xl = x.length;
yl = y.length;
for (i = 0; i < yl; i++) {
if (elmnt == y[i]) {
arrNo.push(i)
} else {
y[i].classList.remove("select-arrow-active");
}
}
for (i = 0; i < xl; i++) {
if (arrNo.indexOf(i)) {
x[i].classList.add("select-hide");
}
}
}

/* If the user clicks anywhere outside the select box,
then close all select boxes: */
document.addEventListener("click", closeAllSelect);
window.sr = ScrollReveal();
   
  sr.reveal('.animate-left', {
    origin:'left',
    duration:1000,
    distance:'10rem',
    delay:300
  
  });
  sr.reveal('.animate-right', {
    origin:'right',
    duration:1000,
    distance:'2rem',
    delay:600
  
  });
  sr.reveal('.animate-top', {
    origin:'top',
    duration:1000,
    distance:'25rem',
    delay:600
  
  });
  sr.reveal('.animate-bottom', {
    origin:'bottom',
    duration:1000,
    distance:'25rem',
    delay:600
  
  });
  

function openNav() {
  document.getElementById("myNav").style.width = "100%";
  document.getElementById("myNav").style.transition = "0.7s ease-in-out";
  let  imgone=document.getElementById('imgone');
  let  imgtwo=document.getElementById('imgtwo');
  let  imgthree=document.getElementById('imgthree');
  let  imgfour=document.getElementById('imgfour');
  let  imgfive=document.getElementById('imgfive');
  
  
setTimeout(()=>{
imgone.style.cssText="opacity:1; margin:15px auto; text-align:center";

},1300)

setTimeout(()=>{
  imgtwo.style.cssText="opacity:1; margin: 15px auto; text-align:center";
  },1700)
  
  setTimeout(()=>{
    imgthree.style.cssText="opacity:1; margin: 15px auto; text-align:center";
    },2000)
    
    setTimeout(()=>{
      imgfour.style.cssText="opacity:1; margin:15px  auto; text-align:center";
      },2200)
      
      setTimeout(()=>{
        imgfive.style.cssText="opacity:1; margin: 15px auto; text-align:center";
        },2500)
      };

function closeNav() {
  document.getElementById("myNav").style.width = "0%";
}


     