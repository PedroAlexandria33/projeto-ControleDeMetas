export async function criarMetaConcluida(metaId: string) {
  await fetch('http://localhost:3333/metas-concluidas', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
      metaId,
    }),
  })
}
