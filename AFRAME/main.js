const face_entity = document.querySelector("#user_face");
const botonLentes = document.querySelector("#botonLentes");
const botonLogo = document.querySelector("#botonLogo");
const botonFoto = document.querySelector("#botonFoto");

botonLentes.addEventListener("click", function () {
  let objeto3D = document.querySelector("#lentes");
  toggleVisibility(objeto3D);
});

botonLogo.addEventListener("click", function () {
  let objeto3D = document.querySelector("#logo1");
  toggleVisibility(objeto3D);
});

botonFoto.addEventListener("click", function () {
  captureARScene();
});

function toggleVisibility(objeto3D) {
  if (objeto3D.getAttribute("visible") == true) {
    objeto3D.setAttribute("visible", "false");
    console.log("NO Visible");
  } else {
    objeto3D.setAttribute("visible", "true");
    console.log("Visible");
  }
}

face_entity.addEventListener("zappar-visible", function () {
  console.log("Visible");
  let objeto3D = document.querySelector("#logo1");
  objeto3D.setAttribute("visible", "true");
  let objeto3D2 = document.querySelector("#lentes");
  objeto3D2.setAttribute("visible", "true");
});

face_entity.addEventListener("zappar-notvisible", function () {
  console.log("NO Visible");
  let objeto3D = document.querySelector("#logo1");
  objeto3D.setAttribute("visible", "false");
  let objeto3D2 = document.querySelector("#lentes");
  objeto3D2.setAttribute("visible", "false");
});

// CAPTURE
function captureARScene() {
  document.querySelector("a-scene").components.screenshot.capture("perspective");
}
