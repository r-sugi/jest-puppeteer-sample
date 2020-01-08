const fs = require('fs');
const mkdirp = require('mkdirp')
const path = require('path')
const { datetime } = require('../utils/date')
const currentDir = () => {
  const testFolder = './screenshots/';
  const dirs = fs.readdirSync(testFolder)
  return dirs.sort()[dirs.length - 1]
}

const mkDirSpec = (screenshotPath, specName) => {
  const dirPath = path.join(`${__dirname}/../${screenshotPath}`, `${specName}`)
  mkdirp.sync(dirPath)
  return dirPath
}

describe(
  'test',
  () => {
    let page, screenshotPath

    beforeAll(async () => {
      page = await global.__BROWSER__.newPage()
      screenshotPath = `/screenshots/${currentDir()}`
    }, timeout)

    afterAll(async () => {
      await page.close()
    })

    it('logo', async () => {
      const screenshotFullPath = mkDirSpec(screenshotPath, 'logo')
      const BASE_DOMAIN = 'https://www.google.com'
      const logoSrc = '/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png'

      await page.goto('https://google.com')
      await page.waitForSelector('#hplogo');

      await page.screenshot({
        path: `${screenshotFullPath}/${datetime(new Date())}.png`,
        fullPage: true
      })

      const text = await page.evaluate(() => document.body.textContent)
      expect(text).toContain('google')

      const t = await page.evaluate(() => window.find('google'));
      expect(await page.evaluate(() => window.find('google')))
        .toBeTruthy()

      const element = await page.$('#hplogo');
      const src1 = await (
        await element.getProperty('src')
      ).jsonValue();

      expect(src1).toBe(`${BASE_DOMAIN}${logoSrc}`)

      const src2 = await page.$eval('#hplogo', e => e.src);
      expect(src2).toBe(`${BASE_DOMAIN}${logoSrc}`)

      const src3 = await page.evaluate(
        el => el.getAttribute('src'),
        element,
      );
      expect(src3).toBe(logoSrc)

      await page.screenshot({
        path: `${screenshotFullPath}/${datetime(new Date())}.png`,
        fullPage: true
      })
    })

    it('content', async () => {
      const screenshotFullPath = mkDirSpec(screenshotPath, 'content')
      await page.goto('https://google.com')
      await page.waitForSelector('#main');

      await page.screenshot({
        path: `${screenshotFullPath}/${datetime(new Date())}.png`,
        fullPage: true
      })

      const divs = await page.$$('#main > div')
      expect(divs.length).toBe(3)

      let historyList = await page.$('.A8SBwf');
      expect(!!historyList).toBeTruthy()

      // const element = await page.$('.gLFyf.gsfi');
      // await element.click()

      await page.screenshot({
        path: `${screenshotFullPath}/${datetime(new Date())}.png`,
        fullPage: true
      })

      historyList = await page.$('.A8SBwf.sbfc');
      expect(!!historyList).toBeTruthy()
    })

    it('search', async () => {
      const screenshotFullPath = mkDirSpec(screenshotPath, 'search')
      await page.goto('https://google.com')
      await page.waitForSelector('#main');

      await page.type('input[name="q"]', 'hogehoge')

      const inputText = await page.$eval(
        'input[name="q"]',
        el => el.value
      )
      expect(inputText).toBe('hogehoge')

      page.keyboard.press('Enter')

      await page.waitForNavigation({
        timeout: 60000, waitUntil: "domcontentloaded"
      })

      await page.screenshot({
        path: `${screenshotFullPath}/${datetime(new Date())}.png`,
        fullPage: true
      })
    })
  },
  timeout = 5000
)
