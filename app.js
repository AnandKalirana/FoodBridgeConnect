// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyBrE-p5kEfnf3GXOmpjSXHnH4pNAtenpd0",
  authDomain: "donation-app-b24f4.firebaseapp.com",
  projectId: "donation-app-b24f4",
  storageBucket: "donation-app-b24f4.firebasestorage.app",
  messagingSenderId: "1020224359699",
  appId: "1:1020224359699:web:3221d5845aeada5fbadee6"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();


// ✅ Toggle UI between Login / Signup
function showSignup() {
  document.getElementById("role").style.display = "block";
  document.getElementById("signupBtn").style.display = "block";
  document.getElementById("backBtn").style.display = "block";
  document.getElementById("loginBtn").style.display = "none";
  document.getElementById("showSignupBtn").style.display = "none";
}

function showLogin() {
  document.getElementById("role").style.display = "none";
  document.getElementById("signupBtn").style.display = "none";
  document.getElementById("backBtn").style.display = "none";
  document.getElementById("loginBtn").style.display = "block";
  document.getElementById("showSignupBtn").style.display = "block";
}


// ✅ SIGNUP
function signup() {
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;
  let role = document.getElementById("role").value.toLowerCase();

  if (!email || !password || !role) {
    alert("Please fill all fields.");
    return;
  }

  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      let uid = userCredential.user.uid;
      return db.collection("users").doc(uid).set({
        email: email,
        role: role
      });
    })
    .then(() => {
      alert("Signup successful! You can now log in.");
      document.getElementById("email").value = "";
      document.getElementById("password").value = "";
      showLogin();
    })
    .catch(err => alert(err.message));
}



// ✅ LOGIN + ROLE REDIRECT
function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("Please enter email and password.");
    return;
  }

  auth.signInWithEmailAndPassword(email, password)
    .then(async (res) => {
      const uid = res.user.uid;
      const userDoc = await db.collection("users").doc(uid).get();

      if (!userDoc.exists) {
        alert("User role not found.");
        return;
      }

      const role = userDoc.data().role.toLowerCase();

      // ✅ Redirect based on role
      if (role === "donor") {
        window.location.href = "donor.html";
      } 
      else if (role === "volunteer") {
        window.location.href = "volunteer.html";
      }
      else if (role === "admin") {
        window.location.href = "admin.html";
      }
      else {
        alert("Unknown role: " + role);
      }
    })
    .catch(err => alert(err.message));
}



// ✅ SUBMIT DONATION
function submitDonation() {
  let item = document.getElementById("itemName").value;
  let qty = document.getElementById("quantity").value;
  let address = document.getElementById("address").value;

  let user = auth.currentUser;

  if (!user) {
    alert("Login first");
    return;
  }

  if (!item || !qty || !address) {
    alert("Please fill all fields before submitting.");
    return;
  }

  db.collection("donations").add({
    item: item,
    quantity: qty,
    address: address,
    donorId: user.uid,
    status: "Pending",
    timestamp: new Date()
  })
  .then(() => {
    alert("Donation submitted successfully!");
    document.getElementById("itemName").value = "";
    document.getElementById("quantity").value = "";
    document.getElementById("address").value = "";
  })
  .catch(err => {
    alert(err.message);
  });
}



// ✅ LOGOUT
function logout() {
  auth.signOut().then(() => {
    window.location = "index.html";
  });
}
