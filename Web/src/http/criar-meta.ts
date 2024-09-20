interface CriarMetaRequest {
  title: string
  desiredWeeklyFrequency: number
}

export async function criarMeta({
  title,
  desiredWeeklyFrequency,
}: CriarMetaRequest) {
  await fetch('http://localhost:3333/goals', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
      title,
      desiredWeeklyFrequency,
    }),
  })
}
