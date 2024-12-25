const addImageButton = document.getElementById("add-image-btn");
const imageUploadInput = document.getElementById("image-upload");
const collageContainer = document.getElementById("collage-container");
const body = document.querySelector("body");
var room_name = "tanRi";
var ImgName, ImgUrl;
var files = [];
var reader = new FileReader();
var savedUsername;
const loader = document.getElementById("loader");
const firebaseConfig_cr = {
  apiKey: "AIzaSyBKInEZWaBEMT5ORpcNEOvJqIZhYHesQr8",
  authDomain: "unratedi-eb345.firebaseapp.com",
  databaseURL: "https://unratedi-eb345-default-rtdb.firebaseio.com",
  projectId: "unratedi-eb345",
  storageBucket: "unratedi-eb345.firebasestorage.app",
  messagingSenderId: "834059574849",
  appId: "1:834059574849:web:76b28a10a705ce277ff0c0"
};

const firebaseApp_other = firebase.initializeApp(firebaseConfig_cr, "other");
// let person = prompt("Please enter your name:", "tan");

// if (person === "tan" || person === "Ri") {
savedUsername = person = "Ri";
// } else {
//   window.location = "new.html";
// }

var finalTime;
setInterval(() => {
  var dt = new Date();
  var hours = dt.getHours() % 12 || 12;
  var AmOrPm = dt.getHours() >= 12 ? "PM" : "AM";
  var minutes = dt.getMinutes().toString().padStart(2, "0");
  var day = dt.getDate().toString().padStart(2, "0");
  var month = (dt.getMonth() + 1).toString().padStart(2, "0");
  dateDisplay = `${day}/${month}`;
  var timeString = dateDisplay + "-" + hours + ":" + minutes + " " + AmOrPm;
  finalTime = timeString;
}, 1000);

const db = firebaseApp_other.database();

const userRef = db.ref(`users/user${person}`);
const otherUserRef = db.ref(`users/user${person === "tan" ? "Ri" : "tan"}`);

// Open file selector when "+" button is clicked
addImageButton.addEventListener("click", () => {
  imageUploadInput.click();
});

// Handle file input change and display image
// imageUploadInput.addEventListener("change", (event) => {
//   const file = event.target.files[0];
//   if (file && file.type.startsWith("image/")) {
//     const reader = new FileReader();
//     reader.onload = () => {
// <!-- <p style="color: white;">Love you <b>Tanishka</b> in our 3rd Month of Deep Friendship... Sharing our Feelings and Love together...</p> -->
//       const img = document.createElement("img");
//       img.src = reader.result;
//       collageContainer.insertBefore(img, addImageButton);
//     };
//     reader.readAsDataURL(file);
//   }
// });

// Main chat function for user load, chat load etc.- -------------------->

// function retrieveImage() {
//   console.log("Retrieving latest image...");

//   var imagesRef = firebaseApp_other
//     .database()
//     .ref(room_name + "images")
//     .orderByKey()
//     .limitToLast(1);
//   console.log("Entering 'images' folder in the database...");

//   imagesRef
//     .once("value")
//     .then(function (snapshot) {
//       console.log("Data retrieved from 'images' folder:");

//       snapshot.forEach(function (childSnapshot) {
//         var imageDataUrl = childSnapshot.val().imageDataUrl;
//         if (imageDataUrl) {
//           console.log("Latest image found:", imageDataUrl);

//           console.log("Sending latest image URL to chat room...");
//           firebaseApp_other
//             .database()
//             .ref(room_name)
//             .push({
//               name: savedUsername,
//               message: imageDataUrl,
//               time: finalTime,
//               type: "image",
//             })
//             .then(() => {
//               console.log("Image URL sent to chat successfully.");
//             })
//             .catch((error) => {
//               console.error("Error sending image URL to chat:", error);
//             });
//         } else {
//           console.log("Latest image URL is undefined.");
//         }
//       });
//     })
//     .catch(function (error) {
//       console.error("Error retrieving image:", error);
//     });
// }

function handleImageSelection(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();

    // When the file is read, get the Data URL and call another function
    reader.onload = function (e) {
      const imageDataUrl = e.target.result; // The Data URL of the image
      saveImageToDatabase(imageDataUrl); // Send the Data URL to another function
    };

    reader.readAsDataURL(file); // Read the image file as Data URL
  }
}

// Event listener for the "+" button click to trigger file input
document.getElementById("add-image-btn").addEventListener("click", function () {
  document.getElementById("image-upload").click(); // Trigger file input
});

// Event listener for the file input to handle image selection
document
  .getElementById("image-upload")
  .addEventListener("change", handleImageSelection);

function saveImageToDatabase(imageDataUrl) {
  firebaseApp_other
    .database()
    .ref(room_name + "images")
    .push({
      imageDataUrl: imageDataUrl,
      time: finalTime,
    })
    .then(() => {
      console.log("Image data URL saved to the database successfully.");
    })
    .catch((error) => {
      console.error("Error saving image data URL to the database:", error);
    });
  retrieveImage();
}
createChat();

function retrieveImage() {
  console.log("Retrieving latest image...");

  var imagesRef = firebaseApp_other
    .database()
    .ref(room_name + "images")
    .orderByKey()
    .limitToLast(1);
  console.log("Entering 'images' folder in the database...");

  imagesRef
    .once("value")
    .then(function (snapshot) {
      console.log("Data retrieved from 'images' folder:");

      snapshot.forEach(function (childSnapshot) {
        var imageDataUrl = childSnapshot.val().imageDataUrl;
        if (imageDataUrl) {
          console.log("Latest image found:", imageDataUrl);

          console.log("Sending latest image URL to chat room...");
          firebaseApp_other
            .database()
            .ref(room_name)
            .push({
              name: savedUsername,
              message: imageDataUrl,
              time: finalTime,
              type: "image",
            })
            .then(() => {
              console.log("Image URL sent to chat successfully.");
            })
            .catch((error) => {
              console.error("Error sending image URL to chat:", error);
            });
        } else {
          console.log("Latest image URL is undefined.");
        }
      });
    })
    .catch(function (error) {
      console.error("Error retrieving image:", error);
    });
}

function createChat() {
  var room_name1 = "tanRi";
  // Check if the chat room already exists
  firebaseApp_other
    .database()
    .ref("/")
    .once("value")
    .then(function (snapshot) {
      if (snapshot.hasChild(room_name1)) {
        // If the chat room already exists with sender-receiver order
        navigateToChat(room_name1);
      } else {
        // If the chat room doesn't exist, create a new one
        firebaseApp_other
          .database()
          .ref("/")
          .child(room_name1)
          .update({
            purpose: "adding room name",
          })
          .then(() => {
            localStorage.setItem("room_name", room_name1);
            navigateToChat(room_name1);
            console.log("output");
          });
      }
    })
    .catch(function (error) {
      console.error("Error checking if chat room exists:", error);
    });
}

function navigateToChat(room_name1) {
  localStorage.setItem("room_name", room_name1);
  console.log(localStorage.getItem("room_name"));
  getData();
}

function getData() {
  console.log(savedUsername);
  firebaseApp_other
    .database()
    .ref(room_name)
    .on("value", function (snapshot) {
      // Clear existing content to avoid duplication
      collageContainer.innerHTML = "";

      snapshot.forEach(function (childSnapshot) {
        const childData = childSnapshot.val();
        const name_of_sender = childData.name;
        const time_get = childData.time;
        const message = childData.message;

        // Add the new element to the container
        collageContainer.innerHTML += `
          <img id="${time_get}" src="${message}" alt="Image from ${name_of_sender}" onclick="openImage(this)">
        `;
        previousSender = name_of_sender;
      });
    });
  loader.style.display = "none";
}

// function monitorImageLoading() {
//   const imagesRef = firebaseApp_other
//     .database()
//     .ref(room_name + "images")
//     .orderByKey();

//   imagesRef.once("value", (snapshot) => {

//   });
// }

// // Start monitoring image loading
// monitorImageLoading();

function openImage(imgE) {
  console.log(imgE.src);
  document.getElementById("loaderpop").style.display = "flex";
  document.getElementById("close-image-btn").style.display = "flex";
  document.getElementById("popimg").src = imgE.src;
}

function close_img() {
  document.getElementById("loaderpop").style.display = "none";
  document.getElementById("close-image-btn").style.display = "none";
}