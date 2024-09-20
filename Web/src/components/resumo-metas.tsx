import { Plus } from 'lucide-react'
import { Button } from './ui/button'
import { DialogTrigger } from './ui/dialog'
import { InorbitIcon } from './in-orbit-icon'
import { Progress, ProgressIndicator } from './ui/progress-bar'
import { Separator } from './ui/separator'
import { useQuery } from '@tanstack/react-query'
import { getResumo } from '../http/get-resumo'
import dayjs from 'dayjs'
import ptBR from 'dayjs/locale/pt-BR'
import { MetasPendentes } from './metas-pendentes'
import { MetaVazia } from './metaVazia'
import { MetasConcluidas } from './metas-concluidas'

dayjs.locale(ptBR)

export function Resumo() {
  const { data } = useQuery({
    queryKey: ['resumo'],
    queryFn: getResumo,
    staleTime: 1000 * 60, // 60 segundos
  })

  if (!data) {
    return null
  }

  const primeiroDiaSemana = dayjs().startOf('week').format('DD')
  const mes = dayjs().startOf('month').format('MMMM')
  const ultimoDiaSemana = dayjs().endOf('week').format('DD')

  const porcentagemCalc = Math.round((data.completed * 100) / data.total)

  return (
    <div className="py-10 max-w-[480px] px-5 mx-auto flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <InorbitIcon />
          <span className="text-lg font-semibold">
            {primeiroDiaSemana} à {ultimoDiaSemana} de
            <span className="text-lg font-semibold capitalize"> {mes} </span>
          </span>
        </div>
        <DialogTrigger asChild>
          <Button size="sm">
            <Plus className="size-4" />
            Cadastrar Meta
          </Button>
        </DialogTrigger>
      </div>

      <div className="flex flex-col gap-3">
        <Progress max={15} value={8}>
          <ProgressIndicator style={{ width: `${porcentagemCalc}%` }} />
        </Progress>

        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span>
            você completou{' '}
            <span className="text-zinc-100">{data?.completed}</span> de
            <span className="text-zinc-100"> {data?.total} </span> metas nessa
            semana
          </span>
          <span>{porcentagemCalc}%</span>
        </div>
      </div>

      <Separator />

      <MetasPendentes />
      {data.metasPorDia === null ? <MetaVazia /> : <MetasConcluidas />}
    </div>
  )
}
