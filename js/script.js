function mouseOver() {
    document.getElementById("resume").style = "font-size:26px";
  }
  
function mouseOut() {
    document.getElementById("resume").style = "font-size:0px";
  }

const observer1 = new IntersectionObserver((entries) =>{
    entries.forEach((entry) => {
      console.log(entry)
      if (entry.isIntersecting){
        entry.target.classList.add('show');
      } else {
        entry.target.classList.remove('show');
      }
    });
  });

const hiddenElements1 = document.querySelectorAll('.hidden');
hiddenElements1.forEach((el) => observer1.observe(el));

// const cursor = document.querySelector('.cursor');
// document.addEventListener('mousemove', (e) => {
//   cursor.style.left = e.pageX + 'px';
//   cursor.style.top = e.pageY + 'px';
// })




