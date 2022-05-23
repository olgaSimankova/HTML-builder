const fs = require('fs')
const fsProm = fs.promises  //Почему не работает require('fs/promises') - пока загадка
const path = require('path')

// читаем template.html и сразу суем туда наши компоненты:

function bundleHTML() {
    let readHTMLStream = fs.createReadStream(path.resolve(__dirname, 'template.html'), 'utf-8')
    let htmlTemplate = ''
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
    })
  }

  // Так, теперь папка где будем собирать проект

  const srcDir = path.join(__dirname)
  const destDir = path.join(__dirname, 'project-dist')

  fs.access(destDir, async (err) => {
    if (err) {
      await fsProm.mkdir(destDir)
    //   Здесь потом будет собирать проект
    }
    else {
      await fsProm.rmdir(destDir, { recursive: true })
      await fsProm.mkdir(destDir, { recursive: true })
    //   Или здесь проект пересобирать
    }
  })