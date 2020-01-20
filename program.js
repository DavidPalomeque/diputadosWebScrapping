const puppeteer = require("puppeteer");
const fs = require("fs");

( async () => {

    try {

        var browser = await puppeteer.launch({ headless: false }); // browser
        var page = await browser.newPage(); // new page
        await page.goto(`https://votaciones.hcdn.gob.ar/votacion/3959` , {waitUntil: 'load', timeout: 0}); // url
        await page.waitForSelector("#myTable"); // selector

        var diputados = await page.evaluate(() => { // main function
            var elements = document.querySelectorAll("tr") // select all rows
            var diputados = { // diputados object / info
                name : [] , 
                politicalParty : [] , 
                province : [] ,
                vote : []
            };
            for (var i = 1; i < elements.length; i++) { // push each row´s data in diputados object
                var diputado = elements[i].innerText.trim().split("\t").join(",").split("\n").join(" ")
                var diputado2 = diputado.split(",")
                diputados.name.push(diputado2[0] + "" +  diputado2[1])
                diputados.politicalParty.push(diputado2[2])
                diputados.province.push(diputado2[3])
                diputados.vote.push(diputado2[4])
            }
            return diputados;
        });

        await browser.close(); // close browser
        fs.writeFile("diputados.json", JSON.stringify(diputados), function (err) { // write in json file diputados info
            if (err) throw err;
            console.log("Json Saved!");
        });

    } catch (err) { // if error show me the error

        console.log(err);
        await browser.close();
        console.log("Browser Closed...")

    }

})();