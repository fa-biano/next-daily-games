import { Container } from '@/components/container'
import { IGameResponse } from '@/interfaces'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import GameCard from '@/components/gameCard'
import Label from '@/components/label'
import { Metadata } from 'next'
import { metadata } from '@/app/layout'

const getData = async (id: string): Promise<IGameResponse | null> => {
  try {
    const response = await fetch(`${process.env.NEXT_API_URL}/next-api/?api=game&id=${id}`)
    return response.json()
  } catch (err) {
    console.log(err)
    throw new Error('Failed to fetch data')
  }
}

const getGameSorted = async (): Promise<IGameResponse> =>{
  try {
    const response = await fetch(
      `${process.env.NEXT_API_URL}/next-api/?api=game_day`,
      { cache: 'no-store' }
    )
    return response.json()
  } catch (err) {
    console.log(err)
    throw new Error('Failed to fetch data')
  }
}

export const generateMetadata = async ({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> => {
  const { id } = await params
  try {
    const gameData = await getData(id)
    if (!gameData) return metadata

    return {
      title: gameData.title,
      description: `${gameData.description.slice(0,100)}`,
      openGraph: {
        title: gameData.title,
        images: [gameData.image_url],
      },
      robots: {
        index: true,
        follow: true,
        nocache: true,
        googleBot: {
          index: true,
          follow: true,
          noimageindex: true,
        },
      },
    }
  } catch (err) {
    console.log(err)
    return metadata
  }
}

export default async function Game({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const data = await getData(id)
  if (!data) redirect('/')

  const sortedGame = await getGameSorted()

  return (
    <main className="w-full text-black">
      <div className="bg-black h-80 sm:h-96 w-full relative">
        <Image
          className="object-cover w-full h-80 sm:h-96 opacity-75"
          src={data.image_url}
          alt={data.title}
          priority={true}
          fill={true}
          quality={100}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 44vw"
        />
      </div>

      <Container>
        <h1 className="font-bold text-xl my-4">{data.title}</h1>
        <p>{data.description}</p>

        <h2 className="font-bold text-lg mt-7 mb-2">Plataformas</h2>
        <div className="flex gap-2 flex-wrap">
          { data.platforms.map((item) => <Label name={item} key={item} />) }
        </div>

        <h2 className="font-bold text-lg mt-7 mb-2">Categorias</h2>
        <div className="flex gap-2 flex-wrap">
          { data.categories.map((item) => <Label name={item} key={item} />) }
        </div>

        <p className="mt-7 mb-2"><strong>Data de lançamento:</strong> {data.release}</p>

        <h2 className="font-bold text-lg mt-7 mb-2">Jogo recomendado:</h2>
        <div className="flex">
          <div className="flex-grow">
            <GameCard data={sortedGame} />
          </div>
        </div>

      </Container>
    </main>
  )
}
