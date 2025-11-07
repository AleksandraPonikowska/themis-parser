window.addEventListener("load", () => {

    const container = document.createElement('div');
    container.id = 'themis-helper-button';
    container.style.position = 'fixed';
    container.style.top = '10px';
    container.style.right = '10px';
    container.style.zIndex = '9999';

    const btn = document.createElement('button');
    btn.innerText = 'Copy JSON';
    btn.style.padding = '10px';
    btn.style.backgroundColor = '#4CAF50';
    btn.style.color = 'white';
    btn.style.border = 'none';
    btn.style.borderRadius = '5px';
    btn.style.cursor = 'pointer';

    function getRanksJSON() {
        const usernames = document.querySelectorAll('.ranks-username a');
        const stats = document.querySelectorAll('.ranks-userstats');
        const result = [];

        usernames.forEach((user, i) => {
            const href = user.getAttribute('href');
            const nameMatch = href.match(/status\/([^,]+)/);
            const name = nameMatch ? nameMatch[1] : null;


            if (!name) return; 
            const statsCell = stats[i];
            
            
            if (!statsCell) return; 

            const rankpoints = parseInt(statsCell.querySelector('.ranks-points')?.innerText.trim() || '0', 10);
            const ranktotal = parseInt(
            (statsCell.querySelector('.ranks-total')?.innerText.trim().replace(/[()]/g, '') || '0'),
            10
            );
            
            result.push({ name, rankpoints, ranktotal });
        });

        return JSON.stringify(result, null, 2);
        }

        


    btn.addEventListener('click', () => {
        const json = getRanksJSON();
        navigator.clipboard.writeText(json).then(() => {
            alert('JSON skopiowany do schowka!');
        }).catch(err => {
            console.error('Błąd kopiowania do schowka:', err);
        });
    });

    container.appendChild(btn);
    document.body.appendChild(container);
});





