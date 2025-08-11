const tarjetas = document.querySelectorAll('.curso-card');
const nameContainer = document.querySelector('.name');
const userCircle = document.querySelector('.user-circle');
const userProfileOptions = document.querySelector('.user_profile_options')
const baseUrl = 'https://edugeometriaapi-production.up.railway.app'
const menuBar = document.querySelector('.menu-bar');
const navLinks = document.querySelector('.nav-links-responsive')

async function getUserData() {
  const response = await fetch(`${baseUrl}/auth/userdata/${localStorage.getItem('user-id')}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });

  const responseData = await response.json();
  return responseData;
}
async function getCurrent() {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("user-id");

  if (!token || !userId) {
    console.warn("Falta token o user-id en localStorage");
    return null;
  }

  const response = await fetch(
    `${baseUrl}/auth/userdata/${userId}`,
    {
      method: "GET",
      headers: getAuthHeader(),
    }
  );

  const responseData = await response.json();
  return responseData;
}


async function init() {
  try {
    const userData = await getUserData();

    nameContainer.innerHTML = userData[0];
    userCircle.innerHTML = userData[0][0];

    tarjetas.forEach((tarjeta) => {
      const barra = tarjeta.querySelector('.barra-progreso');

      tarjeta.addEventListener('mouseenter', () => {
        barra.style.display = 'block';
      });
      tarjeta.addEventListener('mouseleave', () => {
        barra.style.display = 'none';
      });
    });
  } catch (error) {
    console.error('Error al obtener los datos del usuario:', error.message);
  }
}

// Llamamos a la función principal
init();
let userProfileIsOpen = false;

userCircle.addEventListener('click', () =>{
    if(userProfileIsOpen){
        userProfileIsOpen = !userProfileIsOpen;
        userProfileOptions.style.display = 'none'
    }else{
        userProfileIsOpen = !userProfileIsOpen;
        userProfileOptions.style.display = 'flex'
    }
})
menuBar.addEventListener('click', () =>{
  if(navLinks.style.display === 'none'){
    navLinks.style.display = 'flex'
  }else{
    navLinks.style.display = 'none'
  }
})