import { join } from 'path'
import fs from 'fs-extra'
import isThere from 'is-there'
import storage from 'node-persist'

import { HOME_DIR_KEY } from '~/env'

import readChunk from 'read-chunk'
import fileType from 'file-type'

import { promisify } from 'util'
import uuidv4 from 'uuid/v4'
import appRoot from 'app-root-path'
import ffmpeg from 'fluent-ffmpeg'
var sizeOf = promisify(require('image-size'))

async function getDimension (file) {
  try {
    const dimensions = await sizeOf(file)
    return dimensions
  } catch (err) {
    console.error(err)
    return {
      width: 0,
      height: 0
    }
  }
}

const calculatePage = (pageNumber, pageSize, contentSize) => {
  let page = {
    pageInformation: {
      number: pageNumber,
      size: pageSize
    }
  }
  page.first = (pageNumber - 1) * pageSize + 1
  page.last = pageNumber * pageSize
  page.totalNumberOfEntities = contentSize
  page.totalNumberOfPages = Math.ceil(contentSize / pageSize)
  return page
}

const folderSort = (a, b) => {
  if (a.type === b.type) {
    return a.name.localeCompare(b.name)
  } else {
    if (a.type === 'folder') {
      return -1
    } else {
      return 1
    }
  }
}

const imageExtensions = ['.jpg', '.jpeg', '.png']

function checkInsideImage (dir, folderName) {
  for (const extension of imageExtensions) {
    if (isThere(join(dir, folderName) + extension)) {
      return folderName + extension
    }
  }
  return null
}

const isDirectory = source => fs.lstatSync(source).isDirectory()

const isFile = source => fs.lstatSync(source).isFile()

const getFileType = file => {
  try {
    const buffer = readChunk.sync(file, 0, 4100)
    return fileType(buffer)
  } catch (err) {
    return null
  }
}

const buildThumbnail = async (file) => {
  let thumbnail = await storage.get(file)
  if (thumbnail != null) {
    console.log(thumbnail)
    return thumbnail + '.png'
  }
  try {
    const uid = uuidv4()
    await new Promise((resolve, reject) => {
      let command = ffmpeg(file).screenshots({
        timestamps: ['10%'],
        filename: uid,
        folder: join(appRoot.toString(), '.thumb'),
        size: '640x360'
      })
      command.on('filenames', function(filenames) {
        console.log('Will generate ' + filenames.join(', '))
      })
      command.on('end', resolve)
      command.on('error', reject)
    })
    await storage.set(file, uid)
    return uid + '.png'
  } catch (err) {
    console.log(err)
    return null
  }
}

export default (app) => {
  app.get('/init', async function (req, res) {
    const homeDir = await storage.get(HOME_DIR_KEY)
    let result = {
      'homeDir': homeDir
    }
    res.json(result)
  })
  app.post('/list', async function (req, res) {
    let querys = req.query
    let pageNumber = querys['page.number'] ? querys['page.number'] : 1
    let pageSize = querys['page.size'] ? querys['page.size'] : 30

    let dir = req.body.dir
    console.log(dir)
    let contents = fs.readdirSync(dir)

    let page = calculatePage(pageNumber, pageSize, contents.length)
    let result = {
      page: {
        ...page,
        entities: []
      }
    }
    let entitise = await Promise.all(contents
      .map(name => {
        if (isDirectory(join(dir, name)) && !name.startsWith('.')) {
          return {
            type: 'folder',
            name: name,
          }
        } else if (isFile(join(dir, name)) && !name.startsWith('.')) {
          return {
            type: 'file',
            name: name,
          }
        } else {
          return null
        }
      })
      .filter(content => content != null)
      .sort((a, b) => folderSort(a, b))
      .slice(page.first - 1, page.last)
      .map(content => {
        if (isDirectory(join(dir, content.name))) {
          return {
            ...content,
            image: checkInsideImage(join(dir, content.name), content.name)
          }
        } else if (isFile(join(dir, content.name))) {
          return {
            ...content,
            mime: getFileType(join(dir, content.name))
          }
        }
      })
      .filter(content => !(content.type === 'file' && content.mime == null))
      .map(async content => {
        if (content.type === 'file' && content.mime.mime.split('/')[0] === 'image') {
          return {
            ...content,
            dimensions: await getDimension(join(dir, content.name))
          }
        } else if (content.type === 'file' && content.mime.mime.split('/')[0] === 'video') {
          return {
            ...content,
            dimensions: { width: 640, height: 360 },
            image: await buildThumbnail(join(dir, content.name))
          }
        } else if (content.image != null) {
          return {
            ...content,
            dimensions: await getDimension(join(dir, content.name, content.image))
          }
        } else {
          return content
        }
      })
    )

    result.page.totalNumberOfEntities = entitise.length
    result.page.entities = entitise
    res.json(result)
  })
  app.get('/test', function (req, res) {
    console.log(__dirname)
    res.json({type: getFileType('/Users/phompang/Downloads/Marconi\ Union\ -\ Weightless\ \(Official\ Extended\ Version\).mp4')})
  })
}
