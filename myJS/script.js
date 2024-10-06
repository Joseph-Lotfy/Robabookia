// Preloader animation
document.addEventListener("DOMContentLoaded", function () {
  // Start the preloader animation
  // Show the main content within 1 second after the preloader starts
  setTimeout(function () {
    document.getElementById("main-content").style.visibility = "visible";
  }, 0); // Delay for 1.5 second (1500 ms)
});

// Showing the drop-down menu of the navbar when I click on the menu-icon
function toggleMenu() {
  var dropdownMenu = document.getElementById("dropdownMenu");
  dropdownMenu.classList.toggle("show");

  // Check if the dropdown menu is open and update the title accordingly
  if (dropdownMenu.classList.contains("show")) {
    navbarTitle.textContent = "MENU IS OPEN"; // Update when menu is opened
  } else {
    navbarTitle.textContent = "RobaBookia"; // Revert when menu is closed
  }
}

// Change content of navbarTitle when I hover over the menu-icon
const menuIcon = document.querySelector(".menu-icon");
const navbarTitle = document.querySelector(".navbar-title");

menuIcon.addEventListener("mouseover", () => {
  var dropdownMenu = document.getElementById("dropdownMenu");

  // Check if the menu is already open
  if (dropdownMenu.classList.contains("show")) {
    navbarTitle.textContent = "MENU IS OPEN";
  } else {
    navbarTitle.textContent = "OPEN MENU";
  }
});

menuIcon.addEventListener("mouseout", () => {
  var dropdownMenu = document.getElementById("dropdownMenu");

  // Check if the menu is already open
  if (dropdownMenu.classList.contains("show")) {
    navbarTitle.textContent = "MENU IS OPEN";
  } else {
    navbarTitle.textContent = "RobaBookia";
  }
});

//Rotate the menu-icon onclick
function rotateIcon() {
  let styleElement = document.getElementById('internal-style');
  // Check if the rotation is currently applied
  if (styleElement.innerHTML.includes("rotate: 90deg")) {
    // If rotation is applied, remove it by clearing the style
    styleElement.innerHTML = ".menu-icon{rotate: 0deg;}";
  } else {
    // If no rotation, apply 90 degrees rotation
    styleElement.innerHTML = ".menu-icon{rotate: 90deg;}";
  }
}
