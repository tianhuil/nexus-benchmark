import { prisma, ID_Output } from '../generated/prisma-client'
import * as faker from 'faker'

const numAuthors = parseInt(process.argv[2]),
      maxPosts   = parseInt(process.argv[3]),
      paragraphs = parseInt(process.argv[4])

const newAuthor = (i: number) => prisma.createUser({
    name:  faker.name.findName() + i,
    email: faker.internet.email() + i,
  })

const post = (authorId: ID_Output) => ({
  author: { connect: { id: authorId } },
  title: faker.lorem.sentence(),
  content: faker.lorem.paragraphs(paragraphs),
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

  const numArticles = articleAuthorIds.length
  const posts = articleAuthorIds.map(i => post(i))

  const start = new Date().getTime()
  await Promise.all(posts.map(p => prisma.createPost(p)))
  const end = new Date().getTime()
  const duration = end - start
  
  console.log({numAuthors, maxPosts, duration, paragraphs})
}

main()

// 750 QPS on articlecreation for 1 paragraph articles.
// 500 QPS on articlecreation for 20 paragraph articless
// { numAuthors: 10, maxPosts: 5, duration: 271, paragraphs: 5 }
// { numAuthors: 100, maxPosts: 4, duration: 376, paragraphs: 5 }
// { numAuthors: 400, maxPosts: 4, duration: 1119, paragraphs: 5 }
// { numAuthors: 500, maxPosts: 4, duration: 1372, paragraphs: 5 }
// { numAuthors: 500, maxPosts: 4, duration: 1154, paragraphs: 5 }
// { numAuthors: 500, maxPosts: 4, duration: 1229, paragraphs: 5 }
// { numAuthors: 500, maxPosts: 4, duration: 1559, paragraphs: 20 }
// { numAuthors: 500, maxPosts: 4, duration: 1545, paragraphs: 20 }
// { numAuthors: 500, maxPosts: 4, duration: 1505, paragraphs: 20 }
// { numAuthors: 500, maxPosts: 4, duration: 1099, paragraphs: 1 }
// { numAuthors: 500, maxPosts: 4, duration: 1054, paragraphs: 1 }
// { numAuthors: 500, maxPosts: 4, duration: 1171, paragraphs: 1 }
// { numAuthors: 1000, maxPosts: 2, duration: 695, paragraphs: 1 }
// { numAuthors: 1000, maxPosts: 2, duration: 706, paragraphs: 1 }
// { numAuthors: 1000, maxPosts: 2, duration: 761, paragraphs: 1 }
// { numAuthors: 500, maxPosts: 4, duration: 1027, paragraphs: 1 }
// { numAuthors: 500, maxPosts: 4, duration: 1062, paragraphs: 1 }
// { numAuthors: 500, maxPosts: 4, duration: 1050, paragraphs: 1 }
