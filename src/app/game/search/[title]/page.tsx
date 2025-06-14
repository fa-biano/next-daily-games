import { Container } from '@/components/container'
import GameCard from '@/components/gameCard'
import SearchInput from '@/components/searchInput'
import { IGameResponse } from '@/interfaces'

const getData = async (title: string): Promise<IGameResponse[] | null> => {
  try{
    const decodeTitle = decodeURI(title)
    const response = await fetch(`${process.env.NEXT_API_URL}/next-api/?api=game&title=${decodeTitle}`)
    return response.json()
  }catch(err){
    console.error(err)
    return null
  }
}

export default async function Search({ params }: { params: Promise<{ title: string}> }) {
  const { title } = await params
  const games = await getData(title)

  return(
    <main className="w-full text-black">
      <Container>
        <SearchInput/>
        <h1 className="font-bold text-xl mt-8 mb-5">Veja oque encontramos na nossa base:</h1>

        { !games && (<p>Esse jogo não foi encontrado!...</p>) }

        <section className="grid gap-7 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ">
          { games && games.map((item) => <GameCard key={item.id} data={item} />) }
        </section>

      </Container>
    </main>
  )
}
