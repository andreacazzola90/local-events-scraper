const puppeteer = require('puppeteer');
const moment = require('moment');
const saveJsonToFile = require('./functions');

module.exports = async () => {

    (async () => {
        // Avvia il browser
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();

        // Naviga verso la pagina desiderata
        await page.goto('https://www.visitschio.it/it/eventi', { waitUntil: 'networkidle2' });

        // Estrai il titolo della pagina
        const title = await page.title();
        console.log(`Il titolo della pagina è: '${title}'`);






        let allData = []; // Array per memorizzare i dati estratti
        let allEvents = []

        // Funzione per estrarre dati dalla pagina corrente
        const scrapeData = async () => {
            const data = await page.evaluate(() => {
                const items = Array.from(document.querySelectorAll('.event-item')); // Modifica il selettore
                return items.map(item => ({// Modifica il selettore
                    link: item.querySelector('.m-card-hover-btn a.btn').href // Modifica il selettore se necessario
                }));
            });
            return data;
        };

        // Ciclo per la paginazione
        let hasNextPage = true;

        while (hasNextPage) {
            const data = await scrapeData();
            allData.push(...data); // Aggiungi i dati estratti all'array

            // Controlla se c'è una pagina successiva
            hasNextPage = await page.evaluate(() => {
                const nextButton = document.querySelector('a.page-link[rel="next"]'); // Modifica il selettore per il pulsante "next"
                if (nextButton) {
                    nextButton.click(); // Clicca sul pulsante "next"
                    return false; // C'è una pagina successiva
                }
                return false; // Non ci sono più pagine
            });

            if (hasNextPage) {
                await page.waitForNavigation({ waitUntil: 'networkidle2' }); // Aspetta che la nuova pagina si carichi
            }
        }

        // Ora, per ogni link estratto, naviga e ottieni l'immagine principale
        for (const item of allData) {
            const eventPage = await browser.newPage(); // Apri una nuova pagina per ogni evento
            await eventPage.goto(item.link, { waitUntil: 'networkidle2' });

            // Estrai i dati dall'evento
            const eventData = await eventPage.evaluate(() => {
                const bodyElement = document.querySelector('body');
                const bodyClass = Array.from(bodyElement.classList).filter(className => className.startsWith('Event'));
                const id = String(bodyClass).split('-')[1];


                const category = document.querySelector('.category').innerText ?? null; // Modifica il selettore per la categoria

                const h1Element = document.querySelector('h1');
                const title = h1Element.innerText ?? null; // Modifica il selettore per il titolo
                const description = document.querySelector('.event_body').innerText ?? null; // Modifica il selettore per la descrizione
                const dataRange = document.querySelector('.col-12.order-1.order-md-12.bg-eventi.uppercase').innerText ?? null; // Modifica il selettore per la data
                let dataInizio = dataRange.split(': ')[1] ?? null; // Modifica il selettore per la data
                let dataFine = dataRange.split(': ')[2] ?? null;
                dataInizio = moment(dataInizio.split('\n')[0], "DD MMM HH:mm");
                dataFine = moment(dataFine.split('\n')[0], "DD MMM HH:mm")

                let place = document.querySelector('.m-hero-show-info').innerText ?? null; // Modifica il selettore per il luogo
                place = place.split('\n')[1]
                const data = {
                    start: dataInizio.format('YYYY-MM-DD HH:mm'),
                    end: dataFine.format('YYYY-MM-DD HH:mm'),
                }
                const image = document.querySelector('img.img').src ?? null; // Modifica il selettore per l'immagine principale

                return {
                    id,
                    title,
                    category,
                    description,
                    data,
                    image,
                    place,
                };
            });

            allEvents.push({
                ...eventData,
                link: item.link,
            });

            await eventPage.close(); // Chiudi la pagina dell'evento dopo aver estratto i dati
        }

        console.log(allData); // Stampa tutti i dati estratti
        console.log(allEvents);
        // Chiudi il browser
        await browser.close();




        // Example usage

        saveJsonToFile(allEvents, 'visitSchio'); // This will create 'data.json'
    })();





};
