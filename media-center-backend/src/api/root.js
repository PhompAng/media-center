import { join } from 'path';
import fs from 'fs-extra';
import isThere from 'is-there';
import storage from 'node-persist';

import { HOME_DIR_KEY } from '~/env';

import readChunk from 'read-chunk';
import fileType from 'file-type';

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

export default (app) => {
  app.get('/init', async function (req, res) {
    const homeDir = await storage.get(HOME_DIR_KEY)
    let result = {
      'homeDir': homeDir
    }
    res.json(result)
  })
  app.post('/list', function (req, res) {
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
    let entitise = contents
      .map(name => {
        if (isDirectory(join(dir, name))) {
          return {
            type: 'folder',
            name: name,
          }
        } else if (isFile(join(dir, name))) {
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

    result.page.totalNumberOfEntities = entitise.length
    result.page.entities = entitise
    res.json(result)
  })
  app.get('/test', function (req, res) {
    res.json({type: getFileType('/Users/phompang/Downloads/Marconi\ Union\ -\ Weightless\ \(Official\ Extended\ Version\).mp4')})
  })
}
