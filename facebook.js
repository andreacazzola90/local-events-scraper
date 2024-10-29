// const puppeteer = require('puppeteer');
// const moment = require('moment');
// const saveJsonToFile = require('./functions');
// const { setTimeout } = require('node:timers/promises');

// module.exports = async () => {


//     const email = 'andreacazzola90@gmail.com'; // Sostituisci con la tua email
//     const password = 'mJXsTUe%myo0KP'; // Sostituisci con la tua password

//     const page = await loginToFacebook(email, password);
//     await scrapeEvents(page);

//     // Chiudi il browser
//     await page.browser().close();
// }

// const loginToFacebook = async (email, password) => {

//     const browser = await puppeteer.launch({
//         headless: false,
//         args: ['--no-sandbox', '--disable-setuid-sandbox']
//     });
//     const page = await browser.newPage();

//     // Naviga alla pagina di login di Facebook
//     await page.goto('https://www.facebook.com/login');


//     await page.click('div[aria-label="Allow all cookies"]'),

//     // Compila i campi di login
//     await page.type('#email', email, { delay: 10 });
//     await page.type('#pass', password, { delay: 10 });

//     page.click('button[name="login"]').then(console.log('cliccato')),
//     await page.waitForNavigation();

//     // Compila i campi di login
//     await page.type('#email', email, { delay: 10 });
//     await page.type('#pass', password, { delay: 10 });

//     page.click('button[name="login"]').then(console.log('cliccato')),
//     await page.waitForNavigation();
//     await page.waitForSelector(3000)

//     return page; // Restituisce la pagina dopo il login
// };

// const scrapeEvents = async (page) => {
//     // Naviga alla sezione degli eventi del tuo profilo
//     await page.goto('https://www.facebook.com/events');

//     // Attendere che gli eventi siano caricati
//     await page.waitForSelector('div[data-testid="event_list"]');

//     // Estrai le informazioni sugli eventi
//     const events = await page.evaluate(() => {
//         const eventElements = document.querySelectorAll('div[data-testid="event_list"] div');
//         return Array.from(eventElements).map(event => ({
//             title: event.querySelector('h2') ? event.querySelector('h2').innerText : null,
//             date: event.querySelector('time') ? event.querySelector('time').innerText : null,
//             link: event.querySelector('a') ? event.querySelector('a').href : null,
//         }));
//     });

//     console.log(events);
// };




const puppeteer = require('puppeteer');
const fs = require('fs').promises;

module.exports = async () => {

    const email = 'andreacazzola90@gmail.com'; // Sostituisci con la tua email
    const password = 'mJXsTUe%myo0KP'; // Sostituisci con la tua password

    const run = async () => {
        const browser = await puppeteer.launch({
            headless: false,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();

        // Navigate to Facebook login page
        await page.goto("https://www.facebook.com/login");

        await page.click('div[aria-label="Allow all cookies"]'),

        // Type in email and password
        await page.type("#email", email,100); // Use environment variables for security
        await page.type("#pass", password,100);

        // Click the login button
        await page.click("button#loginbutton");

        // Wait for navigation after login
        await page.waitForNavigation();

        // Take a screenshot after logging in
        await page.screenshot({ path: "after-login.jpg" });

        // Save cookies to a file
        const cookies = await page.cookies();
        await fs.writeFile("./cookies.json", JSON.stringify(cookies, null, 2));

        // Optionally, use cookies to log in again
        const context = await browser.createIncognitoBrowserContext();
        const page2 = await context.newPage();

        const savedCookies = JSON.parse(await fs.readFile("./cookies.json"));
        await page2.setCookie(...savedCookies);

        await page2.goto("https://www.facebook.com/events", { waitUntil: "networkidle2" });

        // Take a screenshot of the logged-in state
        await page2.screenshot({ path: "login-using-cookies.jpg" });

        // Close the browser
        await browser.close();
    };

    run().catch(console.error);




}
