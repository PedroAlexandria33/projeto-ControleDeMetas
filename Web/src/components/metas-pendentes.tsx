import { Plus } from 'lucide-react'
import { OutlineButton } from './ui/outline-button'
import { GetMetasPendentes } from '../http/get-metas-pendentes'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { criarMetaConcluida } from '../http/get-criar-meta-concluida'

export function MetasPendentes() {
  const queryClient = useQueryClient()

  const { data } = useQuery({
    queryKey: ['metas-pendentes'],
    queryFn: GetMetasPendentes,
    staleTime: 1000 * 60, // 60 segundos
  })
  if (!data) {
    return null
  }

  async function handleMetasConcluidas(metaId: string) {
    await criarMetaConcluida(metaId)

    queryClient.invalidateQueries({ queryKey: ['resumo'] })
    queryClient.invalidateQueries({ queryKey: ['metas-pendentes'] })
  }
  return (
    <div className="flex flex-wrap gap-3">
      {data.map(meta => {
        return (
          <OutlineButton
            key={meta.id}
            disabled={
              meta.contagemDeMetasConcluidas >= meta.desiredWeeklyFrequency
            }
            onClick={() => handleMetasConcluidas(meta.id)}
          >
            <Plus className="size-4 text-zinc-600" />
            {meta.title}
          </OutlineButton>
        )
      })}
    </div>
  )
}
