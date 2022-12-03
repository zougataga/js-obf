

window.onload = () => {

    // BASE
    const body = document.body;

    // LOADER
    const preload = document.querySelector(".preload");
    preload.style.display = "none";
    // PRESENTATION
    const presentation = document.querySelector(".presentation")
    presentation.style.display = "flex";
    // DIAPORAMA
    const diaporama = document.querySelector(".diaporama"),
        goDiapoBtn = document.querySelector("#startDiapo"),

        bioDescription = document.querySelector("#bio"),
        problemeDescription = document.querySelector("#probleme"),
        retourDescription = document.querySelector("#retour"),

        items = document.querySelectorAll('.item'),
        controls = document.querySelectorAll('.control'),
        headerItems = document.querySelectorAll('.item-header'),
        descriptionItems = document.querySelectorAll('.item-description'),
        activeDelay = .76,
        interval = 25000;

    const biographie = `Né le 19 décembre 1987 à Lyon, Karim Benzema est passé du statut d'espoir du football français à celui de star incontestée. Si son talent et son jeu de jambes font pâlir de jalousie de nombreux passionnés, Karim Benzema fait aussi parler de lui pour ses écarts de conduite. Formé par le club de l'Olympique Lyonnais, il rejoint l'équipe première en 2005 à tout juste 17 ans. Dès lors, le jeune footballeur n'a de cesse de progresser, si bien qu'en 2009 Karim Benzema est convoité par le célèbre club espagnol du Real de Madrid. Coaché par José Mourinho, il évolue alors dans la cour des très grands aux côtés de Cristiano Ronaldo ou d'Iker Casillas. Si son jeu fait le bonheur des Merengues, son rôle au sein de l'équipe de France est de plus en plus décrié. Côté vie privée, Karim Benzema est papa d'une petite Mélia, née le 3 février 2014, avec Chloé, sa compagne depuis 2011. Mais le couple se sépare et le sportif retrouve l'amour au bras de Cora Gauthier. Le couple donne naissance à un garçon prénommé Ibrahim, en 2017.`.split(" ");
    bioDescription.innerHTML = biographie.map(e => `<span class="vertical-part"><b>${e}</b></span>`).join("\n");

    const probleme = `En 2010, le sélectionneur Raymond Domenech décide même de se passer de ses services pour le Mondial. Il lui faut attendre l'ère Laurent Blanc pour retrouver sa place en sélection nationale. Mais là encore, tout ne se passe pas comme prévu. Il faut dire que son image est quelque peu écornée par l'affaire Zahia. En 2010, Karim Benzema est pris dans la tourmente judiciaire avec Franck Ribéry. Les deux joueurs sont accusés d'avoir eu des relations avec une prostituée mineure. Ils sont relaxés en 2014. Parallèlement, le footballeur retrouve le chemin des filets avec l'équipe de France en même temps que sa place d'attaquant incontesté. Son procès pour complicité de tentative de chantage dans l'affaire de la sextape de son ancien coéquipier Mathieu Valbuena, doit se tenir du 20 au 22 octobre 2021 devant le tribunal de Versailles. En novembre 2021, il est reconnu coupable par le tribunal correctionnel de Versailles et condamné à un an de prison avec sursis et 75 000 € d'amende. Le joueur a fait appel de ce jugement.`.split(" ");
    problemeDescription.innerHTML = probleme.map(e => `<span class="vertical-part"><b>${e}</b></span>`).join("\n");

    const retour = `Après cinq ans d'absence, Karim Benzema fait son retour en équipe de France à l'occasion de l'Euro 2021, du 11 juin au 11 juillet 2021. Le 19 octobre 2022, il est sacré Ballon d'or. Il reçoit le trophée des mains de son ancien entraîneur Zinedine Zidane au théâtre du Châtelet, à Paris. Le sélectionneur de l'équipe de France Didier Deschamps dévoile la liste des 26 joueurs du Mondial 2022 le mercredi 9 novembre 2022, dont Karim Benzema fait partie en tant qu'attaquant. Le 20 novembre 2022 cependant, le footballeur annonce qu'il ne participera pas au match contre l'Australie à cause d'une blessure. `.split(" ");
    retourDescription.innerHTML = retour.map(e => `<span class="vertical-part"><b>${e}</b></span>`).join("\n");

    goDiapoBtn.addEventListener("click", async (ev) => {
        preload.style.display = "block";


        presentation.style.display = "none";
        diaporama.style.display = "block";
        let current = 0;
        const slider = {
            init: () => {
                controls.forEach(control => control.addEventListener('click', (e) => { slider.clickedControl(e) }));
                controls[current].classList.add('active');
                items[current].classList.add('active');
            },
            nextSlide: () => {
                slider.reset();
                if (current === items.length - 1) current = -1;
                current++;
                controls[current].classList.add('active');
                items[current].classList.add('active');
                slider.transitionDelay(headerItems);
                slider.transitionDelay(descriptionItems);
            },
            clickedControl: (e) => {
                slider.reset();
                clearInterval(intervalF);

                const control = e.target,
                    dataIndex = Number(control.dataset.index);

                control.classList.add('active');
                items.forEach((item, index) => {
                    if (index === dataIndex) {
                        item.classList.add('active');
                    }
                })
                current = dataIndex;
                slider.transitionDelay(headerItems);
                slider.transitionDelay(descriptionItems);
                intervalF = setInterval(slider.nextSlide, interval);
            },
            reset: () => {
                items.forEach(item => item.classList.remove('active'));
                controls.forEach(control => control.classList.remove('active'));
            },
            transitionDelay: (items) => {
                let seconds;

                items.forEach(item => {
                    const children = item.childNodes;
                    let count = 1,
                        delay;

                    item.classList.value === 'item-header' ? seconds = .015 : seconds = .007;

                    children.forEach(child => {
                        if (child.classList) {
                            item.parentNode.classList.contains('active') ? delay = count * seconds + activeDelay : delay = count * seconds;
                            child.firstElementChild.style.transitionDelay = `${delay}s`; // b element
                            count++;
                        }
                    })
                })
            },
        }
        preload.style.display = "none";
        let intervalF = setInterval(slider.nextSlide, interval);
        slider.init();
    });


}

