// Firebase Configuration
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

// Function to Start QR Code Scanner
function startQRScanner() {
    const scanner = new Html5Qrcode("qr-reader");
    scanner.start(
        { facingMode: "environment" }, // Use back camera
        { fps: 10, qrbox: 250 },
        (decodedText) => {
            scanner.stop(); // Stop scanner after successful scan
            processQRCode(decodedText);
        },
        (errorMessage) => {
            console.log("Scanning error:", errorMessage);
        }
    );
}

// Function to Process QR Code Scan
async function processQRCode(workerId) {
    const statusText = document.getElementById("status");
    const now = new Date();
    const timestamp = firebase.firestore.Timestamp.fromDate(now);

    try {
        const docRef = db.collection("attendance").doc(workerId);
        const doc = await docRef.get();

        if (!doc.exists || !doc.data().clockIn) {
            // Clocking In
            await docRef.set({
                workerId,
                clockIn: timestamp,
                clockOut: null,
                hoursWorked: 0,
                offsite: checkOffsite()
            }, { merge: true });

            statusText.innerText = `Status: Clocked In at ${now.toLocaleTimeString()}`;
        } else if (!doc.data().clockOut) {
            // Clocking Out
            const clockInTime = doc.data().clockIn.toDate();
            const hoursWorked = ((now - clockInTime) / (1000 * 60 * 60)).toFixed(2);

            await docRef.update({
                clockOut: timestamp,
                hoursWorked: parseFloat(hoursWorked)
            });

            statusText.innerText = `Status: Clocked Out at ${now.toLocaleTimeString()}`;
        } else {
            statusText.innerText = "You have already clocked in and out today.";
        }
    } catch (error) {
        console.error("Error updating attendance:", error);
        statusText.innerText = "Error processing attendance.";
    }
}

// Function to View Attendance Records
async function viewAttendance() {
    const tableBody = document.getElementById("attendance-table");
    tableBody.innerHTML = ""; // Clear table

    const snapshot = await db.collection("attendance").get();
    snapshot.forEach((doc) => {
        const data = doc.data();
        const row = `<tr>
            <td>${data.workerId}</td>
            <td>${data.clockIn ? data.clockIn.toDate().toLocaleString() : "N/A"}</td>
            <td>${data.clockOut ? data.clockOut.toDate().toLocaleString() : "N/A"}</td>
            <td>${data.hoursWorked ? data.hoursWorked.toFixed(2) + " hrs" : "N/A"}</td>
            <td>${data.offsite ? "YES" : "NO"}</td>
        </tr>`;
        tableBody.innerHTML += row;
    });
}

// Function to Check if Worker is Offsite
function checkOffsite() {
    const worksiteLocation = { lat: 40.7128, lon: -74.0060 }; // Example: New York City
    return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const distance = getDistance(
                    worksiteLocation.lat,
                    worksiteLocation.lon,
                    position.coords.latitude,
                    position.coords.longitude
                );
                resolve(distance > 0.5); // If more than 500m away, mark as offsite
            },
            () => resolve(true), // If GPS fails, assume offsite
            { enableHighAccuracy: true }
        );
    });
}

// Function to Calculate Distance Between Two Coordinates
function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
