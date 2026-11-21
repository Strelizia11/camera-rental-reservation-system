const CATALOG_PAGE = "catalog/catalog.html";
const ADMIN_PAGE = "admin/dashboard/dashboard.html";


const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ][A-Za-zÀ-ÖØ-öø-ÿ.'\- ]{1,59}$/;
const contactRegex = /^(09\d{9}|\+639\d{9})$/;
const SPECIALS = "@$!%*?&";
const passwordRules = [
  { regex: /.{8,}/, message: "At least 8 characters" },
  { regex: /[A-Z]/, message: "At least 1 capital letter" },
  { regex: /\d/, message: "At least 1 digit" },
  { regex: /[@$!%*?&]/, message: "At least 1 special character (" + SPECIALS + ")" },
  { regex: /^[A-Za-z\d@$!%*?&]*$/, message: "Only letters, digits and these special characters are allowed: " + SPECIALS },
];

/* ---------- Elements ---------- */
const signUpName = document.getElementById("signUpName");
const signUpContact = document.getElementById("signUpContact");
const signUpTerms = document.getElementById("signUpTerms");
const signUpNameError = document.getElementById("signUpNameError");
const signUpContactError = document.getElementById("signUpContactError");
const signUpTermsError = document.getElementById("signUpTermsError");
const signUpEmail = document.getElementById("signUpEmail");
const signUpPassword = document.getElementById("signUpPassword");
const signUpConfirm = document.getElementById("signUpConfirm");
const signUpEmailError = document.getElementById("signUpEmailError");
const signUpPasswordError = document.getElementById("signUpPasswordError");
const signUpConfirmError = document.getElementById("signUpConfirmError");

const signInEmail = document.getElementById("signInEmail");
const signInPassword = document.getElementById("signInPassword");
const signInEmailError = document.getElementById("signInEmailError");
const signInPasswordError = document.getElementById("signInPasswordError");

/* ---------- Open / close modals ---------- */
function clearSignUp() {
  document.getElementById("signUpForm").reset();
  signUpNameError.textContent = "";
  signUpContactError.textContent = "";
  signUpTermsError.textContent = "";
  signUpEmailError.textContent = "";
  signUpPasswordError.textContent = "";
  signUpConfirmError.textContent = "";
}

function clearSignIn() {
  document.getElementById("signInForm").reset();
  signInEmailError.textContent = "";
  signInPasswordError.textContent = "";
}

function showSignUp() {
  closeModal("signInModal");
  clearSignUp();
  openModal("signUpModal");
}

function showSignIn() {
  closeModal("signUpModal");
  clearSignIn();
  openModal("signInModal");
}

/* ---------- Sign up ---------- */
function getMissingPasswordRules(password) {
  return passwordRules.filter((rule) => !rule.regex.test(password)).map((rule) => rule.message);
}

function validateUserInfo(e) {
  if (e) e.preventDefault();

  const fullName = signUpName.value.trim().replace(/\s+/g, " ");
  const email = signUpEmail.value.trim();
  const contact = signUpContact.value.trim();
  const password = signUpPassword.value;
  const confirm = signUpConfirm.value;
  let valid = true;

  signUpNameError.textContent = "";
  if (fullName === "") {
    signUpNameError.textContent = "Please enter your full name.";
    valid = false;
  } else if (!nameRegex.test(fullName)) {
    signUpNameError.textContent = "Name must be 2-60 characters and use only letters, spaces, periods, apostrophes or hyphens.";
    valid = false;
  }

  // Email
  signUpEmailError.textContent = "";
  if (!emailRegex.test(email)) {
    signUpEmailError.textContent = "Please enter a valid email address.";
    valid = false;
  } else if (findAccountByEmail(email)) {
    signUpEmailError.textContent = "That email is already registered.";
    valid = false;
  }

  signUpContactError.textContent = "";
  if (!contactRegex.test(contact)) {
    signUpContactError.textContent = "Enter a valid number, e.g. 09123456789 or +639123456789.";
    valid = false;
  }

  // Password: list every missing requirement
  signUpPasswordError.innerHTML = "";
  const missing = getMissingPasswordRules(password);
  if (missing.length > 0) {
    const list = document.createElement("ul");
    missing.forEach((msg) => {
      const li = document.createElement("li");
      li.textContent = msg;
      list.appendChild(li);
    });
    signUpPasswordError.appendChild(list);
    valid = false;
  }

  // Confirm password
  signUpConfirmError.textContent = "";
  if (confirm === "") {
    signUpConfirmError.textContent = "Please confirm your password.";
    valid = false;
  } else if (confirm !== password) {
    signUpConfirmError.textContent = "Passwords do not match.";
    valid = false;
  }

  signUpTermsError.textContent = "";
  if (!signUpTerms.checked) {
    signUpTermsError.textContent = "You must agree to the Terms and Agreement.";
    valid = false;
  }

  if (!valid) return false;

  // All good: store the account, log the user in, go to the catalog
  const user = saveAccount(email, password, fullName, contact);
  setCurrentUser(user);
  window.location.href = CATALOG_PAGE;
  return true;
}

/* ---------- Sign in ---------- */
function validateSignIn(e) {
  if (e) e.preventDefault();

  const email = signInEmail.value.trim();
  const password = signInPassword.value;
  signInEmailError.textContent = "";
  signInPasswordError.textContent = "";

  if (!emailRegex.test(email)) {
    signInEmailError.textContent = "Please enter a valid email address.";
    return false;
  }

  const user = findAccountByEmail(email);
  if (!user) {
    signInEmailError.textContent = "No account found with that email.";
    return false;
  }

  if (user.password !== password) {
    signInPasswordError.textContent = "Incorrect password.";
    return false;
  }

  setCurrentUser(user);
  window.location.href = user.role === "admin" ? ADMIN_PAGE : CATALOG_PAGE;
  return true;
}

document.getElementById("openSignIn").addEventListener("click", showSignIn);
document.getElementById("openSignUp").addEventListener("click", showSignUp);
document.getElementById("closeSignIn").addEventListener("click", () => closeModal("signInModal"));
document.getElementById("closeSignUp").addEventListener("click", () => closeModal("signUpModal"));

document.getElementById("toSignIn").addEventListener("click", (e) => {
  e.preventDefault();
  showSignIn();
});
document.getElementById("toSignUp").addEventListener("click", (e) => {
  e.preventDefault();
  showSignUp();
});

document.getElementById("signUpBtn").addEventListener("click", validateUserInfo);
document.getElementById("signInBtn").addEventListener("click", validateSignIn);