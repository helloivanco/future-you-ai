import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const Home: NextPage = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    if (file) {
      handleSubmit();
    }
  }, [file]);

  const handleFileChange = (e: any) => {
    e.preventDefault();
    setFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setImageUrl('');
    const formData = new FormData();
    formData.append('file', file!);

    const options = {
      method: 'POST',
      body: formData,
    };

    const response = await fetch('/api/process', options);
    if (response.status === 200) {
      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      setImageUrl(imageUrl);
      setLoading(false);
    } else {
      console.error(await response.text());
    }
  };

  return (
    <div className='flex min-h-screen flex-col items-center justify-center py-2'>
      <Head>
        <title>Future You AI</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className='flex w-full flex-1 flex-col items-center justify-center px-20 text-center'>
        <h1 className='text-6xl font-bold'>
          Future You <span className='text-secondary'>AI</span>
        </h1>

        <p className='mt-3 text-base font-light max-w-md text-gray-600'>
          Upload a pic & OpenAI will generate a variation.
        </p>

        <div className='mt-4'>
          {loading ? (
            <>
              <svg
                aria-hidden='true'
                role='status'
                className='inline w-16 h-16 text-secondary animate-spin'
                viewBox='0 0 100 101'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'>
                <path
                  d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                  fill='#E5E7EB'
                />
                <path
                  d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                  fill='currentColor'
                />
              </svg>
            </>
          ) : (
            <>
              <form>
                <input
                  type='file'
                  className='file-input file-input-bordered file-input-secondary w-full max-w-xs'
                  accept='image/*'
                  onChange={handleFileChange}
                  disabled={loading}
                  title='Upload an image of yourself'
                />
              </form>
            </>
          )}
        </div>
        <div className='mt-4 max-w-md'>
          {imageUrl && (
            <div className='flex items-center justify-center mx-2'>
              <img
                src={URL.createObjectURL(file!)}
                className='w-48 sm:w-96 h-48 sm:h-96 object-cover rounded-lg mr-2'
              />
              <img src={imageUrl} className='w-48 sm:w-96 rounded-lg' />
            </div>
          )}
        </div>
      </main>

      <footer className='flex h-24 w-full bg-gray-100 items-center justify-center border-t'>
        <a
          className='flex items-center justify-center gap-2'
          href='https://openai.com'
          target='_blank'
          rel='noopener noreferrer'>
          Powered by{' '}
          <Image src='/openai.svg' alt='Vercel Logo' width={72} height={16} />
        </a>
      </footer>
    </div>
  );
};

export default Home;
