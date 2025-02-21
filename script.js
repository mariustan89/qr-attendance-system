// Ensure Firestore is set up with your Firebase configuration
const firebaseConfig = {
 apiKey: "AIzaSyBssajixMZxMac9UnjKamgv2ZJ7l3JZpA0",
  authDomain: "simplicity-5f74d.firebaseapp.com",
  projectId: "simplicity-5f74d",
  storageBucket: "simplicity-5f74d.firebasestorage.app",
  messagingSenderId: "1095889312134",
  appId: "1:1095889312134:web:3eb06e089d7b2cca35b407"
};
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

// Function to get the workerID from the URL
function getWorkerID() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('workerID');  // Returns the workerID from the URL query string
}

// Function to log clock-in or clock-out time
function logTime(clockStatus) {
  const workerID = getWorkerID();  // Get the workerID from the URL
  
  if (workerID) {
    const currentTime = new Date().toISOString();  // Get current time in ISO format

    // Update Firestore with clock-in or clock-out status
    db.collection("attendance").doc(workerID).set({
      name: "Marius Tan",  // Replace with dynamic worker name if needed
      workerID: workerID,
      status: clockStatus,
      time: currentTime
    }, { merge: true })
    .then(() => {
      console.log(`${clockStatus} time recorded for worker ${workerID}`);
      alert(`${clockStatus} time recorded for worker ${workerID}`);
    })
    .catch((error) => {
      console.error("Error recording time: ", error);
      alert("Error recording time.");
    });
  } else {
    alert("No worker ID found in the URL.");
  }
}

// Function to clock in
function clockIn() {
  logTime("Clocked In");
}

// Function to clock out
function clockOut() {
  logTime("Clocked Out");
}

// Adding event listeners to clock-in and clock-out buttons
document.getElementById("clockInButton").addEventListener("click", clockIn);
document.getElementById("clockOutButton").addEventListener("click", clockOut);
