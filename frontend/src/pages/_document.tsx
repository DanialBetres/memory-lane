import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang='en' className='bg-white h-full'>
      <Head />
      <body className='h-full bg-white bg-none'>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
