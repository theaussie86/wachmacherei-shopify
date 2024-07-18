import { ImageResponse } from 'next/og';
import LogoIcon from './icons/logo';

export type Props = {
  title?: string;
};

export default async function OpengraphImage(props?: Props): Promise<ImageResponse> {
  const { title } = {
    ...{
      title: process.env.SITE_NAME
    },
    ...props
  };

  return new ImageResponse(
    (
      <div tw="flex h-full w-full flex-col items-center justify-center bg-black">
        <div tw="flex flex-none items-center justify-center h-[360px] w-[160px]">
          <LogoIcon />
        </div>
        <p tw="text-7xl text-white text-center">{title}</p>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'IBM Plex Sans',
          data: await fetch(
            new URL('../public/fonts/IBMPlexSans/IBMPlexSans-SemiBold.ttf', import.meta.url)
          ).then((res) => res.arrayBuffer()),
          style: 'normal'
        }
      ]
    }
  );
}
