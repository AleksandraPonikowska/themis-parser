window.addEventListener("load", () => {

    const container = document.createElement('div');
    container.id = 'themis-helper-button';
    container.style.position = 'fixed';
    container.style.top = '10px';
    container.style.right = '10px';
    container.style.zIndex = '9999';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.gap = '8px';

    const btn1 = document.createElement('button');
    const btn2 = document.createElement('button');
    const btn3 = document.createElement('button');

    btn1.innerText = 'Get JSON';
    btn2.innerText = 'Get grades';
    btn3.innerText = 'Edit names';

    const buttons = [btn1, btn2, btn3];

    btn1.style.backgroundColor = '#40FF40';
    btn2.style.backgroundColor = '#FFD840';
    btn3.style.backgroundColor = '#FF4040';



    for (const btn of buttons){
        btn.style.padding = '10px';
        btn.style.color = 'white';
        btn.style.border = 'none';
        btn.style.borderRadius = '5px';
        btn.style.cursor = 'pointer';
    }

    function isExtra(){
        
        const select = document.querySelector('#subtitle select');
        const selectedOption = select.options[select.selectedIndex];
        const text = selectedOption.text;

        if (text.includes('ukryte') || text.includes('dodatkowe')) {
            return true;
        } else {
            return false;
        }

    }
    

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

        


    btn1.addEventListener('click', () => {
        const json = getRanksJSON();
        navigator.clipboard.writeText(json).then(() => {
            alert('JSON skopiowany do schowka!');
        }).catch(err => {
            console.error('Błąd kopiowania do schowka:', err);
        });
    });

    btn2.addEventListener('click', () => {
        const ranksJSON = JSON.parse(getRanksJSON());
        const usersMap = JSON.parse(localStorage.getItem('usersMap') || '{}');

        const ranksMap = {};
        ranksJSON.forEach(u => {
            ranksMap[u.name] = u;
        });

        const mapped = Object.entries(usersMap).map(([nick, fullName]) => {
            const userRank = ranksMap[nick];

            if (isExtra()) {
                const points = userRank ? userRank.rankpoints : 0;
                const total = userRank ? userRank.ranktotal - userRank.rankpoints : 0;
                return { fullName, rankpoints: points, ranktotal: '+'.repeat(total) };
            } else {
                const points = userRank ? userRank.rankpoints : 0;
                const total = userRank ? userRank.ranktotal : 0;
                return { fullName, rankpoints: points, ranktotal: total };
            }
        });

        mapped.sort((a, b) => a.fullName.localeCompare(b.fullName));

        let output = ""

        if(isExtra()){
            output = mapped
            .map(u => `'${'+'.repeat(u.rankpoints)}`)
            .join('\n');
        } else {
            output = mapped
            .map(u => `${u.rankpoints}\t${u.ranktotal}`)
            .join('\n');


        }


        navigator.clipboard.writeText(output)
            .then(() => alert('Grades skopiowane do schowka!'))
            .catch(err => console.error('Błąd kopiowania do schowka:', err));
    });


    btn3.addEventListener('click', () => {
    const currentMap = JSON.parse(localStorage.getItem('usersMap') || '{}');
    const input = prompt(
      'Wprowadź mapę nick → pełne imię w formacie: "nick":"Imię Nazwisko", jedna para na linię',
      Object.entries(currentMap).map(([nick, full]) => `"${nick}":"${full}"`).join('\n')
    );


    if (input) {
      const newMap = {};
      input.split('\n').forEach(line => {
        const match = line.match(/"(.+)"\s*:\s*"(.+)"/);
        if (match) {
          newMap[match[1].trim()] = match[2].trim();
        }
      });
      localStorage.setItem('usersMap', JSON.stringify(newMap));
      alert('Mapa zapisana!');
    }
  });


    for(const btn of buttons){
        container.appendChild(btn);
    }
    
    document.body.appendChild(container);
});





