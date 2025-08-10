const cards = document.querySelectorAll('.card');

cards.forEach(card =>{
    const btn = card.querySelector('.btn');
    btn.addEventListener('click', async() =>{
        const plan = card.querySelector('.card-header').innerHTML;
        const firstStepData = JSON.parse(localStorage.getItem('first-step-data'));
        const lastStepData = {
            plan,
            ...firstStepData,
        }
        const response = await fetch('https://edugeometriaapi-production.up.railway.app/auth/register', {
            method: "POST",
            headers:{ 'Content-Type':'application/json'},
            body: JSON.stringify(lastStepData)
        })

        const responseData = await response.json();
        console.log(responseData)
        console.log(response)


        localStorage.setItem('name-email', JSON.stringify({name:firstStepData.name, email:firstStepData.email}))
        if(response.ok){
            window.location.href = './index.html'
        }
    })
})