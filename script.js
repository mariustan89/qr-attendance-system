// Firebase config (get this from your Firebase console)
const firebaseConfig = {
  apiKey: "AIzaSyBssajixMZxMac9UnjKamgv2ZJ7l3JZpA0",
  authDomain: "simplicity-5f74d.firebaseapp.com",
  projectId: "simplicity-5f74d",
  storageBucket: "simplicity-5f74d.firebasestorage.app",
  messagingSenderId: "1095889312134",
  appId: "1:1095889312134:web:3eb06e089d7b2cca35b407"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Get worker ID from the URL
const urlParams = new URLSearchParams(window.location.search);
const workerID = urlParams.get('workerID'); // Get worker ID from the URL
const clockInButton = document.getElementById('clockIn');
const clockOutButton = document.getElementById('clockOut');

if (workerID) {
  console.log('Worker ID:', workerID);

  const workerRef = db.collection('attendance').doc(workerID);

  // Handle Clock In button click
  clockInButton.addEventListener('click', () => {
    const clockInTime = new Date();
    workerRef.update({
      ClockIn: clockInTime,
      Status: 'Clocked In',
    }).then(() => {
      alert('Clock In Successful');
    });
  });

  // Handle Clock Out button click
  clockOutButton.addEventListener('click', () => {
    const clockOutTime = new Date();
    workerRef.update({
      ClockOut: clockOutTime,
      Status: 'Clocked Out',
    }).then(() => {
      alert('Clock Out Successful');
    });
  });
}
