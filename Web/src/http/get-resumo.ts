type resumoSemana = {
  completed: number
  total: number
  metasPorDia: Record<
    string,
    {
      id: string
      title: string
      completedAt: string
    }[]
  >
}

export async function getResumo(): Promise<resumoSemana> {
  const response = await fetch('http://localhost:3333/resumo')
  const data = await response.json()

  return data.resumo
}
