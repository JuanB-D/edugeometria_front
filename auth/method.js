const cards = document.querySelectorAll('.card');


cards.forEach(card => {
    const btn = card.querySelector('.btn');
    
    btn.addEventListener('click', async () => {
        const firstStepDataRaw = localStorage.getItem('first-step-data');

        // Si no hay datos del primer paso
        if (!firstStepDataRaw) {
            localStorage.setItem('plan', card.querySelector('.card-header').innerHTML);
            window.location.href = './index.html';
            return;
        }

        let firstStepData;
        try {
            firstStepData = JSON.parse(firstStepDataRaw);
        } catch (e) {
            console.error("Error parseando first-step-data:", e);
            return;
        }

        const plan = card.querySelector('.card-header').innerHTML;
        const lastStepData = { plan, ...firstStepData };

        try {
            const response = await fetch('https://edugeometriaapi-production.up.railway.app/auth/register', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(lastStepData)
            });

            const responseData = await response.json();
            console.log(responseData);
            console.log(response);

            localStorage.setItem('name-email', JSON.stringify({
                name: firstStepData.name,
                email: firstStepData.email
            }));

            if (response.ok) {
                window.location.href = './index.html';
            }
        } catch (error) {
            console.error("Error en la petición:", error);
        }
    });
});
