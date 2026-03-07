const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.approveUserRequest = functions.https.onCall(async (data, context) => {

  // 1️⃣ تأكد إن اللي بينادي function Admin
  if (!context.auth || context.auth.token.role !== "admin_students") {
    throw new functions.https.HttpsError(
      "permission-denied",
      "Only admins can approve requests"
    );
  }

  const { requestId, name, email, role, code } = data;

  try {
    // 2️⃣ Create user in Firebase Auth
    const userRecord = await admin.auth().createUser({
      email: email,
      password: "TempPassword123", // مؤقت
      displayName: name,
    });

    // 3️⃣ Set role in custom claims
    await admin.auth().setCustomUserClaims(userRecord.uid, {
      role: role
    });

    // 4️⃣ Create user in Firestore
    await admin.firestore().collection("users").doc(userRecord.uid).set({
      fullName: name,
      email,
      role, // student or doctor
      code: role === "student" ? code : "",
      approved: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // 5️⃣ Update request status
    await admin.firestore().collection("emailRequests")
      .doc(requestId)
      .update({ status: "approved" });

    // 6️⃣ Generate password reset link
    const link = await admin.auth().generatePasswordResetLink(email);

    return { success: true, resetLink: link };

  } catch (error) {
    throw new functions.https.HttpsError("internal", error.message);
  }
});