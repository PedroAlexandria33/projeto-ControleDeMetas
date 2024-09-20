import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { CheckCircle2 } from 'lucide-react'
import { getResumo } from '../http/get-resumo'
export function MetasConcluidas() {
  const { data } = useQuery({
    queryKey: ['resumo'],
    queryFn: getResumo,
    staleTime: 1000 * 60, // 60 segundos
  })

  if (!data) {
    return null
  }

  const mes = dayjs().startOf('month').format('MMMM')

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-xl front-medium">Sua Semana</h2>

      {Object.entries(data.metasPorDia).map(([date, metas]) => {
        //vou usar um Object.entries para pegar os dois valores, tanto as chaves (keys) quanto os valores (value)
        //vou usar o map porque no react sempre tem que ser um map e não um forEache() eu não consigo retornar nada de dentro dele enquanto map() eu posso fazer um return

        //key={date} e key={metas.id} são chaves com valores únicos
        const weekDay = dayjs(date).format('dddd')
        const diaAtual = dayjs(date).format('DD')

        return (
          <div key={date} className="flex flex-col gap-4">
            <h3 className="font-medium capitalize">
              {weekDay}:
              <span className="text-zinc-400 text-xs gap-5">
                {' '}
                {diaAtual} <span className="lowercase">de</span> {mes}
              </span>
            </h3>
            <ul className="flex flex-col gap-3">
              {metas.map(metas => {
                const time = dayjs(metas.completedAt).format('HH:mm ')

                return (
                  <li key={metas.id} className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-pink-500" />
                    <span className="text-sm text-zinc-400">
                      Você completou
                      <span className="text-zinc-100"> {metas.title} </span> às{' '}
                      {''}
                      <span className="text-zinc-100"> {time} </span>
                    </span>
                  </li>
                )
              })}
            </ul>
          </div>
        )
      })}
    </div>
  )
}
