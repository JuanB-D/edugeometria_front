const container = document.getElementById("container");
const toggleButton = document.getElementById("toggleButton");
const backToLogin = document.getElementById("backToLogin");
const registerForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");
const responseMessage = document.querySelector(".response_message");
const registerResponseMessage = document.querySelector(".Rresponse_message");
const baseUrl = "https://edugeometriaapi-production.up.railway.app";

function getFormData(form) {
  const data = {};
  const formData = new FormData(form);
  formData.forEach((value, key) => (data[key] = value));
  return data;
}

function showMessage(element, text, color) {
  element.textContent = text;
  element.style.color = color;
}

toggleButton.addEventListener("click", () => {
  container.classList.toggle("active");
  toggleButton.textContent =
    toggleButton.textContent === "Registrarse" ? "Iniciar Sesión" : "Registrarse"; // <-- cambio aquí
});

backToLogin.addEventListener("click", (e) => {
  e.preventDefault();
  container.classList.toggle("active");
  toggleButton.textContent =
    toggleButton.textContent === "Registrarse" ? "Iniciar Sesión" : "Registrarse";
});

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  
  const submitBtn = loginForm.querySelector("button");
  submitBtn.disabled = true;
  submitBtn.textContent = "Cargando...";
  try {
    const data = getFormData(registerForm);
    const response = await fetch(
      `${baseUrl}/auth/check-email?email=${encodeURIComponent(data.email)}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    const responseData = await response.json();
    if (!responseData.exists) {
      localStorage.setItem("first-step-data", JSON.stringify(data));
      showMessage(registerResponseMessage, "Register succesfully", "green");
      window.location.href = "./method.html";
    } else {
      showMessage(registerResponseMessage, "email already used", "red");
    }
  } catch (error) {
    console.error(error);
    showMessage(
      registerResponseMessage,
      "Error al conectar con el servidor",
      "red"
    );
  }
});

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  try {
    const data = getFormData(loginForm);

    const response = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const responseData = await response.json().catch(() => ({}));
    console.log(responseData)

    if (!response.ok) {
      showMessage(responseMessage, responseData.error || "Error al iniciar sesión", 'red');
      return;
    }

    if(responseData.verify === 0){
      showMessage(responseMessage, "Reviza tu correo para verificar tu cuenta", 'yellow')
      return;
    }
    showMessage(responseMessage, '¡Inicio de sesión exitoso!', 'green');
    localStorage.setItem("token", responseData.token);
    localStorage.setItem("user-id", responseData.user_id);

    setTimeout(() => {
      window.location.href = "../home/index.html";
    }, 500);
  } catch (error) {
    showMessage(responseMessage, 'No se pudo conectar con el servidor', 'red')
  }
});
