import { checkSecret, initSecret } from 'src/libs/naples/admin/serverside';

export default async function handler(req, res) {
  const { query, body, method } = req;
  const ip = req.headers['x-real-ip'] || req.connection.remoteAddress;
  switch (method) {
    // check secret
    case 'GET':
      const result = await checkSecret(query.secret, ip);
      res.status(200).json({ valid: result });
      break;
    case 'PUT':
      const hasSecret = await checkSecret(body.secret, ip);
      if (!hasSecret) {
        return res.status(401).end('Unauthorized');
      }
      await initSecret();
      res.status(200).send('success');
      break;
    default:
      res.setHeader('Allow', ['GET', 'PUT']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
