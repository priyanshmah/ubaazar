import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: 'https://happy-rodent-10448.upstash.io',
  token: 'ASjQAAIjcDE1YmE5OGZlYmVlYTU0N2E4YWFlZmU2MTE1ZmY1OGI4NHAxMA',
})

export default redis;