const body = document.querySelector("body");
var room_name = "tanRi";
var ImgName, ImgUrl;
var files = [];
var reader = new FileReader();
var savedUsername;
// const firebaseConfig_cr = {
//   apiKey: "AIzaSyAnTCo7_Z8akPsoA2HtsOr7WZWrHqu-GZQ",
//   authDomain: "unrated-f6bc5.firebaseapp.com",
//   databaseURL: "https://unrated-f6bc5-default-rtdb.firebaseio.com",
//   projectId: "unrated-f6bc5",
//   storageBucket: "unrated-f6bc5.firebasestorage.app",
//   messagingSenderId: "698144411948",
//   appId: "1:698144411948:web:dea98692b52765aa719c89",
// };

const firebaseConfig_cr = {
  apiKey: "AIzaSyDIPhE6tpBr2EB5AAu3JpPexElMMzqodp4",
  authDomain: "unrated3-ae9f8.firebaseapp.com",
  databaseURL: "https://unrated3-ae9f8-default-rtdb.firebaseio.com",
  projectId: "unrated3-ae9f8",
  storageBucket: "unrated3-ae9f8.firebasestorage.app",
  messagingSenderId: "175197965025",
  appId: "1:175197965025:web:67990aaf94712c0ce185a0",
};

const firebaseApp_other = firebase.initializeApp(firebaseConfig_cr, "other");
let person = prompt("Please enter your name:", "tan");
let pass = prompt("Please enter pass:");

if (person === "tan" && pass === "2509") {
  savedUsername = person;
} else if (person === "Ri") {
  savedUsername = person;
} else {
  window.location = "new.html";
}

function detectAndStyleLinksForMultipleTexts(className) {
  const containers = document.querySelectorAll(`.${className}`);

  containers.forEach((container) => {
    const text = container.innerHTML;

    // Regular expression to match URLs with or without protocol
    const urlRegex =
      /(?:https?:\/\/|www\.)?([a-zA-Z0-9-]+\.[a-zA-Z]{2,})(?:[^\s]*)/g;

    // Replace URLs with styled anchor tags
    const styledText = text.replace(urlRegex, (match) => {
      // If the URL doesn't have a protocol, add "https://"
      const url = match.startsWith("http") ? match : "https://" + match;
      return `<a href="${url}" class="detected-link" target="_blank">${url}</a>`;
    });

    // Update the container's innerHTML with styled links
    container.innerHTML = styledText;
  });
}

function getData() {
  console.log(savedUsername);
  firebaseApp_other
    .database()
    .ref(room_name)
    .on("value", function (snapshot) {
      const output = document.getElementById("output");
      output.innerHTML = "";
      let previousSender = "";

      snapshot.forEach(function (childSnapshot) {
        const childData = childSnapshot.val();
        const messageType = childData.type;
        const messageKey = childSnapshot.key;

        const name_of_sender = childData.name;
        const time_get = childData.time;
        const isCurrentUser = name_of_sender === savedUsername;
        const alignment_time = isCurrentUser
          ? "left-align-time"
          : "right-align-time";
        const marginStyle =
          name_of_sender === previousSender ? "margin-top: -4px;" : "";

        const alignment = isCurrentUser ? "right-align2" : "left-align2";
        const alignmentClass = isCurrentUser ? "right-align" : "left-align";
        const border_align = isCurrentUser
          ? "20px 5px 20px 20px"
          : "5px 20px 20px 20px";
        const border_for_name =
          name_of_sender === previousSender
            ? "20px 20px 20px 20px"
            : border_align;

        const message = childData.message;
        const messageHTML =
          "<div class='main_msg_contain " +
          alignmentClass +
          "' style='" +
          marginStyle +
          "'>" +
          "<div id='" +
          messageKey +
          "' class='msg_contain " +
          alignment +
          " ' style='border-radius: " +
          border_for_name +
          ";' " +
          "onmousedown='startLongPress(this)' " +
          "onmouseup='clearLongPress()' " +
          "ontouchstart='startLongPress(this)' " +
          "ontouchend='clearLongPress()'" +
          " >" +
          " <span class='message_text'>" +
          message +
          "</span> " +
          "<p class='time_given " +
          alignment_time +
          "'>" +
          time_get +
          "</p>" +
          "</div>" +
          "</div>" +
          "<br>";

        output.innerHTML += messageHTML;
        previousSender = name_of_sender;
      });

      // After adding the messages, detect and style links
      detectAndStyleLinksForMultipleTexts("message_text");

      output.scrollTop = output.scrollHeight;
    });
}
createChat();

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
