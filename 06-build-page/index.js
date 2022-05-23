const fs = require('fs')
const fsProm = fs.promises  //Почему не работает require('fs/promises') - пока загадка
const path = require('path')

// читаем template.html и сразу суем туда наши компоненты:

function bundleHTML() {
    let readHTMLStream = fs.createReadStream(path.resolve(__dirname, 'template.html'), 'utf-8')
    let htmlTemplate = ''
    const writeHTMLStream = fs.createWriteStream(path.resolve(destDir, 'index.html'))
    readHTMLStream.on('data', (chunk) => htmlTemplate += chunk)
    readHTMLStream.on('end', async () => {
        const components = await fsProm.readdir(path.resolve(__dirname, 'components'))
        for (const component of components) {
        if (path.parse(__dirname + '\\components\\' + component).ext == '.html'){
           let fragment =  path.parse(__dirname + '\\components\\' + component).name
            const componentReadStream = await fsProm.readFile(__dirname + '\\components\\' + component, 'utf8')
            const componentRegex = new RegExp(`{{${fragment}}}`)
            htmlTemplate = htmlTemplate.replace(componentRegex, componentReadStream)
            
            console.log('html готов. Вроде бы...')
        }   
    }
    writeHTMLStream.write(htmlTemplate, 'utf-8')
    })
  }

  // Так, теперь папка где будем собирать проект

  const destDir = path.join(__dirname, 'project-dist')

  fs.access(destDir, async (err) => {
    if (err) {
      await fsProm.mkdir(destDir)
    //   Здесь потом будет собирать проект
    bundleProject()
    }
    else {
      await fs.rmdir(destDir, { recursive: true }, (err) => {
          if (err) console.log(err)
      })
      await fsProm.mkdir(destDir, { recursive: true })
    //   Или здесь проект пересобирать
        bundleProject()
    }
  })

  //   Собираем стили в бандл
const stylesSrcDir = path.join(__dirname, 'styles\\')
  
async function bundleCSS(src) {
    let stylesArr = []
    const writeStream = fs.createWriteStream(path.join(destDir, 'style.css'))

    const srcFiles = await fsProm.readdir(src)

    for (const file of srcFiles) {
        if (path.parse(src + file).ext == '.css') {
            
            const stylesFileRead = await fsProm.readFile(src + file, 'utf8')

            stylesArr.unshift(stylesFileRead)
        }
    }

    writeStream.write(stylesArr.join(''), "UTF8")
    writeStream.end()
}

// Копируем папку assets

function copyFile(src, dest, file) {
    fs.copyFile(path.join(src, file.name), path.join(dest, file.name), err => {
        if (err) throw err
    })
      }

function copyAllFiles (src, dest) {
fs.mkdir(dest, (err) => {
    if (err) throw err
})
fs.readdir(src, {withFileTypes: true}, (err, files) => {
    files.forEach(file => {
        if(file.isFile()) {
            copyFile(src, dest, file)
        } else {
            copyAllFiles(path.join(src, file.name), path.join(dest, file.name))
        }
    })
})
}

// Собираем весь проект в бандл

function bundleProject() {
    bundleHTML()
    copyAllFiles(path.join(__dirname, 'assets'), path.join(destDir, 'assets'))
    bundleCSS(stylesSrcDir)
}