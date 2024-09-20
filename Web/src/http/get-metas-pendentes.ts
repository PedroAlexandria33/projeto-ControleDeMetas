type GetMetasPendentes = {
  id: string
  title: string
  desiredWeeklyFrequency: number
  contagemDeMetasConcluidas: number
}[]

export async function GetMetasPendentes(): Promise<GetMetasPendentes> {
  const response = await fetch('http://localhost:3333/metas-pendentes')
  const data = await response.json()

  return data.metasPendentes
}
