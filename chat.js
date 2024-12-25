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
  apiKey: "AIzaSyBUvL7qjBQQ92jBULjw8i_6K3ibgCxFFWM",
  authDomain: "unrated-k.firebaseapp.com",
  databaseURL: "https://unrated-k-default-rtdb.firebaseio.com",
  projectId: "unrated-k",
  storageBucket: "unrated-k.firebasestorage.app",
  messagingSenderId: "752470142707",
  appId: "1:752470142707:web:bfc5c38020fc145469d186"
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

// Update online status for the current user
// Update online status for the current user with "last seen" for offline
function setOnlineStatus(isOnline) {
  if (isOnline) {
    userRef.set("Online");
  } else {
    userRef.set(`Last seen at ${finalTime}`);
  }
}

// Detect visibility change to set status
document.addEventListener("visibilitychange", function () {
  setOnlineStatus(document.visibilityState === "visible");
});

// Set initial status to online and update to "last seen" when user leaves
setOnlineStatus(true);
window.addEventListener("beforeunload", () => setOnlineStatus(false));

// Listen for status changes of both users in real-time
db.ref("users/usertan").on("value", (snapshot) => {
  if (person === "Ri") {
    document.getElementById("status").textContent = snapshot.val();
    if (snapshot.val() == "Online") {
      document.title = "Online";
    } else {
      document.title = "GoChat";
    }
  }
});
db.ref("users/userRi").on("value", (snapshot) => {
  if (person === "tan") {
    document.getElementById("status").textContent = snapshot.val();
    if (snapshot.val() == "Online") {
      document.title = "Online";
    } else {
      document.title = "GoChat";
    }
  }
});

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
// Main chat function for user load, chat load etc.- -------------------->
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
let longPressTimer;

let selectedMessageIds = [];

function startLongPress(element) {
  longPressTimer = setTimeout(() => {
    const elementId = element.id;
    element.style.backgroundColor = "red"; // Change background to red
    element.classList.add("selected");
    document.getElementById("btnCloseEmer").style.display = "block";
    selectedMessageIds.push(elementId);
    console.log(selectedMessageIds);
  }, 500); // 500ms for long press
}

function clearLongPress() {
  clearTimeout(longPressTimer); // Clear the timer if the press is released early
}

function deleteSelectedMessages() {
  // Reference to the Firebase chat room
  const chatRoomRef = firebaseApp_other.database().ref(room_name);

  // Loop through the selectedMessageIds and delete each corresponding message
  selectedMessageIds.forEach((messageId) => {
    // Delete the message with the specific ID from Firebase
    chatRoomRef
      .child(messageId)
      .remove()
      .then(() => {
        console.log(
          `Message with ID ${messageId} deleted successfully from Firebase.`
        );
      })
      .catch((error) => {
        console.error(`Error deleting message with ID ${messageId}:`, error);
      });
  });

  // Clear the selectedMessageIds list after deleting the messages
  selectedMessageIds = [];
  document.getElementById("btnCloseEmer").style.display = "none";
}

function send() {
  msg = document.getElementById("msg").value.trim();
  var room_name = "tanRi";
  if (msg.length > 0 && msg != "") {
    firebaseApp_other.database().ref(room_name).push({
      name: savedUsername,
      message: msg,
      time: finalTime,
    });
    document.getElementById("msg").value = "";
  } else {
    console.log("Message cannot be empty");
  }
  previousSender = name;
}

document.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    send();
  }
});
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
