import { Container } from '@/components/container'
import Link from 'next/link'
import Image from 'next/image'
import { IGameResponse } from '@/interfaces'
import { BsArrowRightSquare } from 'react-icons/bs'
import SearchInput from '@/components/searchInput'
import GameCard from '@/components/gameCard'

const getDailyGame = async (): Promise<IGameResponse> => {
  try{
    const response = await fetch(
      `${process.env.NEXT_API_URL}/next-api/?api=game_day`,
      { next: { revalidate: 320 } }
    )
    return response.json()
  }catch(err){
    console.log(err)
    throw new Error('Failed to fetch data')
  }
}

const getGamesData = async (): Promise<IGameResponse[]> => {
  try{
    const res = await fetch(`${process.env.NEXT_API_URL}/next-api/?api=games`, { next: { revalidate: 320 } })
    return res.json()
  }catch(err){
    console.log(err)
    throw new Error('Failed to fetch data')
  }
}

export default async function Home() {
  const dailyGame = await getDailyGame()
  console.log('dailyGame', dailyGame)
  const games = await getGamesData()

  return (
    <main className="w-full">
      <Container>
        <h1 className="text-center font-bold text-xl mt-8 mb-5">Separamos um jogo exclusivo pra você</h1>
        <Link href={`/game/${dailyGame.id}`}>
          <section className="w-full bg-black rounded-lg">
            <div className="w-full max-h-96 h-96  relative rounded-lg">
              <div className='absolute z-20 bottom-0 p-3 flex justify-center items-center gap-2'>
                <p className='font-bold text-xl text-white'>{dailyGame.title}</p>
                <BsArrowRightSquare size={24} color='#fff' />
              </div>

              <Image
                src={dailyGame.image_url}
                alt={dailyGame.title}
                priority={true}
                quality={100}
                fill={true}
                className='max-h-96 object-cover rounded-lg opacity-50 hover:opacity-100 transition-all duration-300'
                sizes='(max-width: 768px) 100vw, (max-width: 1200px) 44vw'
              />
            </div>
          </section>
        </Link>
        <SearchInput />

        <h2 className="text-lg font-bold mt-8 mb-5">
          Jogos para conhecer
        </h2>

        <section className="grid gap-7 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ">
          { games.map((game) => <GameCard key={game.id} data={game} /> ) }
        </section>
      </Container>
    </main>
  )
}
