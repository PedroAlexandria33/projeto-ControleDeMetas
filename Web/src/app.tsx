import { Dialog } from './components/ui/dialog'
import { CreateGoal } from './components/create-goal'
import { Resumo } from './components/resumo-metas'
import { useQuery } from '@tanstack/react-query'
import { Metavazia } from './components/tela-meta-vazia'
import { getResumo } from './http/get-resumo'

export default function App() {
  const { data } = useQuery({
    queryKey: ['resumo'],
    queryFn: getResumo,
    staleTime: 1000 * 60, // 60 segundos
  })

  return (
    <Dialog>
      {data?.total && data.total > 0 ? <Resumo /> : <Metavazia />}

      <CreateGoal />
    </Dialog>
  )
}
