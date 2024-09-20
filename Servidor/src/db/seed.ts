import { client, db } from '.'
import { goals, metasCumpridas } from './schema'
import dayjs from 'dayjs'

async function seed() {
  await db.delete(metasCumpridas)
  await db.delete(goals)

  //atribui os dados da tabela à uma constante 'result' que ele vai pegar todas as informações do banco
  const result = await db
    .insert(goals)
    .values([
      { title: 'Acordar cedo', desiredWeeklyFrequency: 5 },
      { title: 'Exercitar', desiredWeeklyFrequency: 3 },
      { title: 'Acordar', desiredWeeklyFrequency: 7 },
    ])
    .returning()

  const startOfWeek = dayjs().startOf('week') // aqui ele vai contabilizar os dias a partir do primeiro dia dessa semana no caso Domingo

  //com os dados da variável 'result' eu consigo concluir minhas tarefas internamento utilizando o código abaixo, "createdAt: new Date()" serve para indicar quando foi que eu concluir essa tarefa
  await db.insert(metasCumpridas).values([
    { metaId: result[0].id, createdAt: startOfWeek.toDate() }, //aqui estou usando startOfWeek.toDate() para dizer que completei a meta no domingo
    { metaId: result[1].id, createdAt: startOfWeek.add(1, 'day').toDate() }, //estou adicionando mais um dia no códidigo, logicamente ele vai entender que estou completando essa tarefa na segunda ja que é 1 dia depois do domingo
    { metaId: result[2].id, createdAt: startOfWeek.add(2, 'day').toDate() }, //concluindo a meta terça feira
  ])
}

seed().finally(() => {
  client.end()
})
