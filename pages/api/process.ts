import got from 'got';
import { NextApiRequest, NextApiResponse } from 'next';
const fs = require('fs');
const formidable = require('formidable-serverless');
const { Configuration, OpenAIApi } = require('openai');
const Jimp = require('jimp');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function cropJpgBufferToSquarePngBuffer(jpgBuffer: any) {
  const image = await Jimp.read(jpgBuffer);
  const size = Math.min(image.getWidth(), image.getHeight());
  const x = (image.getWidth() - size) / 2;
  const y = (image.getHeight() - size) / 2;
  image.crop(x, y, size, size);
  const pngBuffer = await image.quality(100).getBufferAsync(Jimp.MIME_PNG);
  return pngBuffer;
}

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function proxy(req: NextApiRequest, res: NextApiResponse) {
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, async function (err: any, fields: any, files: any) {
    fs.readFile(files.file.path, async (err: any, data: any) => {
      if (err) throw err;
      let buffer = Buffer.from(data);
      let image_url = '';

      const pngBuffer = await cropJpgBufferToSquarePngBuffer(buffer);
      console.log(buffer);

      (pngBuffer as any).name = 'image.png';

      // const response = await openai.createCompletion({
      //   model: 'text-davinci-003',
      //   prompt: `Can this line item be a business expense with yes or no or maybe.\n\n${line}\nIs Business Expense:`,
      //   temperature: 0,
      //   max_tokens: 60,
      //   top_p: 1.0,
      //   frequency_penalty: 0.5,
      //   presence_penalty: 0.0,
      // });

      try {
        const response = await openai.createImageVariation(
          pngBuffer as any,
          1,
          '512x512'
        );
        image_url = response.data.data[0].url;
      } catch (error: any) {
        if (error.response) {
          console.log(error.response.status);
          console.log(error.response.data);
        } else {
          console.log(error.message);
        }
      }

      res.statusCode = 200;
      res.setHeader('Content-Type', 'image/png');
      got.stream(image_url).pipe(res);
    });
  });
}
