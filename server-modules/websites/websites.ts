import mongoI = require('../mongo-interface/mongo-interface');
import fs = require("fs");
import path = require("path");

interface site {
    _id?: string
    ID: string
    BRANDBACKGROUND: string
    BRANDBACKGROUND64: string
    BRANDIMAGE: string
    BRANDIMAGE64: string
    BRANDINFO: string
    DESCRIPTIONS: { [key: string]: string }
    HTML: string
    IMAGES: {
        [key: string]: {
            filename: string
            link: string
        }
    }
    LOGOIMAGE64: string
    IMAGESBASE64: string[]
    TITLE: string,
    ROWS: number
}

export const getCatalog = async (query: string) => {
    return await mongoI.findOne<site>("Websites", {ID: query})
}

export const updateCatalog = async (catalog: site, title: string) => {
    await convertImages(catalog)
    catalog.HTML = websiteHTML(catalog, title)
    if (catalog._id !== undefined) delete catalog._id
    return await mongoI.setData("Websites", {ID: catalog.ID}, catalog)
}

const websiteHTML = (catalog: site, title: string) => {

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8"/>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} | Fishing Rods, Reels and Tackle</title>
</head>
<style>

    * {
        box-sizing: border-box;
        font-family: sans-serif;
    }
    html, body {
        margin: 0;
    }

    #overall-wrapper {
        background: url(${catalog.BRANDBACKGROUND64});
        background-size: cover;
        display:block;
        min-height: 100vh;
        width: 100%;
    }

    #website-wrapper {
        max-width: 1350px;
        margin: 0 auto;
    }

    #main-image-menu-wrapper {
        width: 50%;
        margin: 0 auto;
        padding: 20px;
    }

    #brand-image {
        width: 100%;
    }

    #content-wrapper {
        display: grid;
        grid-gap: 20px;
        grid-template-columns: 48% 48%;
        margin-bottom: 5px;
        min-height: 560px;
        position: relative;
        padding: 0 20px
    }

    #product-image-div {
        display: flex;
        justify-content: space-around;
        flex-direction: column;
        border-radius: 5px;
        box-shadow: 4px 4px 0 0 #171717;
        position: relative;
        background: white;
        align-items: center;
    }

    .images {
        position: absolute;
        max-width: 100%;
        max-height: 100%;
        margin: auto;
        transition: opacity 2.5s;
        border-radius: 5px;
        opacity: 0;
    }

    #product-description {
        display:grid;
        ${title === "Roddarch" ? "background: whitesmoke;" : ""}
        ${title === "Hunter Pro" ? "background: #222;" : ""}
        padding: 20px;
        border-radius: 5px;
        box-shadow: 4px 4px 0 0 #171717;
        position: relative;
    }
    
    #product-description div {
        grid-column-start: 1;
        grid-row-start: 1;
        max-height: 100%;
        ${title === "Roddarch" ? "color: black;" : ""}
        ${title === "Hunter Pro" ? "color: #ccc;" : ""}
        opacity: 0;
        transition: opacity 2.5s;
        max-width: calc(100% - 40px);
    }

    #footer-wrapper {
        padding: 5px 45px 5px 5px;
        color: #ccc;
        text-align: right;
    }
    @media only screen and (max-width: 1360px){
        #website-wrapper {
        max-width: 980px;
        }
    }
    
    @media only screen and (max-width: 1000px){
    
    #main-image-menu-wrapper {
        width: 100%;
    }
    
    #content-wrapper {
        grid-template-columns: 1fr;
        height: unset;
    }

    #product-image-div {
        flex-direction: row;
        padding: 10px;
        height: 400px
    }
    
    #product-description {
        padding: 10px;
        font-size: 1.5em;
    }
    
    }
</style>
<body>
<div id="overall-wrapper">
    <div id="website-wrapper">
        <div id="main-image-menu-wrapper"><img src="" alt="${title} brand image" id="brand-image"></div>
        <div id="content-wrapper">
            <div id="product-image-div">
                <img class="images" id="product-image-0" alt="" src="" >
            </div>
            <div id="product-description">
                <div id="product-description-0" ></div>
            </div>
        </div>
        <div id="footer-wrapper">        
                <div id="footer-left-header">${title}®</div>
                <div id="footer-left-body">part of the <a href="https://www.quaysports.com">Quay Sports Group</a></div>
        </div>
    </div>
</div>
</body>

<script>
let data = ${JSON.stringify(catalog)}

websiteImages()

    function websiteImages() {

        let brandImage = document.getElementById('brand-image')
        brandImage.src = data.LOGOIMAGE64

        let brandLogo = document.getElementById('product-image-0')
        brandLogo.src = data.BRANDIMAGE64

            let brandInfo = document.getElementById('product-description-0')
        brandInfo.innerHTML = data.BRANDINFO

        for (let i = 1; i <= Object.keys(data.IMAGES).length; i++) {
            let imgDiv = document.getElementById('product-image-div')
            let img = document.createElement('img');
            img.className = "images "
            img.id = "product-image-" + i
            img.src = data.IMAGESBASE64[i]
            img.alt = "${title} product image"
            imgDiv.appendChild(img)

            let descriptionDiv = document.getElementById('product-description')
            let description = document.createElement('div');
            description.id = "product-description-" + i
            description.innerHTML = data.DESCRIPTIONS['description' + i]
            descriptionDiv.appendChild(description)
        }
        fadeImages(0)
    }

    setInterval(intervalHandler, 10000)
    let i = 0

    function intervalHandler() {
        i += 1
        let lastImg = document.getElementById("product-image-div").childNodes.length - 3
        fadeImages(i)
        if (i === lastImg) i = -1
    }

    function fadeImages(i) {
        let lastImg = document.getElementById("product-image-div").childNodes.length - 3
        let imgFadeOut, descriptionfadeOut
        let imgFadeIn = document.getElementById("product-image-" + i)
        let descriptionfadeIn = document.getElementById("product-description-" + i)
        if (i === 0) {
            imgFadeOut = document.getElementById("product-image-" + lastImg)
            descriptionfadeOut = document.getElementById("product-description-" + lastImg)
        } else {
            imgFadeOut = document.getElementById("product-image-" + (i - 1))
            descriptionfadeOut = document.getElementById("product-description-" + (i - 1))
        }
        imageTransition(imgFadeOut, imgFadeIn, descriptionfadeOut, descriptionfadeIn)
        return i
    }

    function imageTransition(imgFadeOut, imgFadeIn, descriptionFadeOut, descriptionFadein) {
        imgFadeOut.style.opacity = "0"
        imgFadeIn.style.opacity = "0.95"
        descriptionFadeOut.style.opacity = "0"
        descriptionFadein.style.opacity = "0.95"
    }      
    </script>
</html>`
}

const convertImages = async (catalog: site) => {

    catalog.IMAGESBASE64 = []
    catalog.LOGOIMAGE64 = await imageToBinary("website-images", catalog.ID, ".png")
    catalog.BRANDIMAGE64 = await imageToBinary("website-images", catalog.BRANDIMAGE, ".png")
    catalog.BRANDBACKGROUND64 = await imageToBinary("website-images", catalog.BRANDBACKGROUND, ".png")

    for (let i = 1; i <= Object.keys(catalog.IMAGES).length; i++) {
        let imageDetails = catalog.IMAGES['image' + i].filename.split(".")
        catalog.IMAGESBASE64[i] = await imageToBinary(
            "images" + "/" + catalog.IMAGES['image' + i].link.replace(/([ \/])+/g, "-"),
            imageDetails[0],
            "." + imageDetails[1]
        )
    }

    return
}


const imageToBinary = async (folder: string, image: string, extension: string): Promise<string> => {
    return new Promise(resolve => {
        let filepath = path.join("./", folder, image + extension)
        let binary = `data:image/${extension.replace(".", "")};base64,`
        let readableStream = fs.createReadStream(filepath);
        readableStream.setEncoding('base64');

        readableStream.on('data', function (chunk) {
            binary += chunk;
        });

        readableStream.on('end', function () {
            resolve(binary)
        });
    })
}