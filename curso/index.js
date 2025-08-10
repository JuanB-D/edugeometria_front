let lessons = [];
const baseUrl = "https://edugeometriaapi-production.up.railway.app";

function getAuthData() {
  return {
    token: localStorage.getItem("token"),
    userId: localStorage.getItem("user-id"),
    topic: localStorage.getItem("topic"),
  };
}

async function getContentData() {
  try {
    const { token, topic } = getAuthData();
    if (!token || !topic) {
      console.warn("Falta token o topic en localStorage");
      return;
    }

    const response = await fetch(`${baseUrl}/topic/getcontenttopic/${topic}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error("Error al obtener datos del servidor");

    const { data } = await response.json();
    lessons = data.sort((a, b) => a.num - b.num);
  } catch (error) {
    console.error("Error al cargar contenido:", error);
  }
}

async function getCurrent() {
  const { token, userId } = getAuthData();
  if (!token || !userId) {
    console.warn("Falta token o user-id en localStorage");
    return null;
  }

  const response = await fetch(`${baseUrl}/auth/userdata/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.json();
}

let currentLesson = 0;

const lessonContent = document.getElementById("lessonContent");
const progressFill = document.getElementById("progressFill");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
let haveResponse = false;

async function renderLesson(index, type) {
  lessonContent.classList.remove("visible");

  setTimeout(async () => {
    const lesson = lessons[index];
    const { token } = getAuthData();
    haveResponse = false; // reinicia para cada pregunta

    lessonContent.innerHTML = `
      <div class='text-content'>
        <h3>${lesson.title}</h3>
        <p>${lesson.content}</p>
        <p style="margin-top: 1rem; font-size: 0.85rem; color: #666;">
          Lección ${index + 1} de ${lessons.length}
        </p>
      </div>
    `;

    switch (type) {
      case "text-image":
        lessonContent.innerHTML += `<img src='${lesson.image_url}' alt='image' style="width: 400px;" />`;
        break;
      case "text-video":
        lessonContent.innerHTML += lesson.video_url;
        break;
      case "text-3d":
        lessonContent.innerHTML += lesson.form_embed;
        break;
      case "text-question":
        const question = currentLesson - 6;
        const res = await fetch(`${baseUrl}/topic/getquestion/${question}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const responseData = await res.json();

        // 🔹 Mezclar las respuestas de forma aleatoria
        const shuffledResponses = [...responseData.responses].sort(
          () => Math.random() - 0.5
        );

        lessonContent.innerHTML += `
    <section class='questions_side'>
      <h3 style='text-align: center'>${responseData.question}</h3>
      ${shuffledResponses
        .map(
          (r) =>
            `<div class='response' data-true='${r.correct}'>${r.response}</div>`
        )
        .join("")}
    </section>
  `;

        document.querySelectorAll(".response").forEach((response) => {
          response.addEventListener("click", () => {
            if (!haveResponse) {
              const correct = response.dataset.true === "1";
              response.style.backgroundColor = correct ? "#adff2f" : "red";
              if (!correct) response.style.color = "white";
              haveResponse = true;
            }
          });
        });
        break;
    }

    progressFill.style.width = ((index + 1) / lessons.length) * 100 + "%";
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === lessons.length - 1;

    lessonContent.classList.add("visible");
  }, 200);
}

// Botones
nextBtn.addEventListener("click", async () => {
  if (currentLesson < lessons.length - 1) {
    currentLesson++;
    const { token, userId } = getAuthData();
    await fetch(`${baseUrl}/topic/saveprogres`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId,
        num: currentLesson,
        type: lessons[0].topic,
      }),
    });
    renderLesson(currentLesson, lessons[currentLesson].tipe);
  }
});

prevBtn.addEventListener("click", () => {
  if (currentLesson > 0) {
    currentLesson--;
    renderLesson(currentLesson, lessons[currentLesson].tipe);
  }
});

// Inicialización
async function init() {
  await getContentData();
  if (!lessons.length) {
    lessonContent.innerHTML = `<p>No hay contenido disponible.</p>`;
    return;
  }

  const progressData = await getCurrent();
  if (!progressData) return;

  const topic = lessons[0].topic;
  if (topic === "ga") currentLesson = Number(progressData[1] || 0);
  else if (topic === "ge") currentLesson = Number(progressData[2] || 0);
  else if (topic === "tr") currentLesson = Number(progressData[3] || 0);

  if (currentLesson >= lessons.length) currentLesson = 0;
  renderLesson(currentLesson, lessons[currentLesson].tipe);
}

init();
