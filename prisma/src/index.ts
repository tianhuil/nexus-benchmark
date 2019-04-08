import { prisma, ID_Output } from '../generated/prisma-client'
import * as faker from 'faker'

const numAuthors = parseInt(process.argv[2]),
      maxPosts   = parseInt(process.argv[3])

const newAuthor = (i: number) => prisma.createUser({
    name:  faker.name.findName() + i,
    email: faker.internet.email() + i,
  })

const writePost = (authorId: ID_Output) => prisma.createPost({
  author: { connect: { id: authorId } },
  title: faker.lorem.sentence(),
  content: faker.lorem.paragraphs(5),
  published: faker.random.boolean(),
})

const getRandomInt = (max: number) => Math.floor(Math.random() * Math.floor(max))

function inplaceShuffle(array: any[]) {
  for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
  }
}

const main = async () => {
  const authors = await Promise.all(
    Array.from({length: numAuthors}, (x,i) => newAuthor(i))
  )

  const articleAuthorIds: string[] = authors.flatMap(author => 
    Array(getRandomInt(maxPosts)).fill(author.id)
  )

  inplaceShuffle(articleAuthorIds)

  const start = new Date().getTime()
  await Promise.all(articleAuthorIds.map(i => writePost(i)))
  const end = new Date().getTime()
  const duration = end - start
  
  console.log({numAuthors, maxPosts, duration})
}

main()

// { numAuthors: 10, maxPosts: 5, duration: 271 }
// { numAuthors: 100, maxPosts: 4, duration: 376
// { numAuthors: 400, maxPosts: 4, duration: 1119 }
// { numAuthors: 500, maxPosts: 4, duration: 1372 }
// { numAuthors: 500, maxPosts: 4, duration: 1154 }
// { numAuthors: 500, maxPosts: 4, duration: 1229 }
