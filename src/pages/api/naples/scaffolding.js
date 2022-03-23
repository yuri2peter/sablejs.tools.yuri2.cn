import { checkSecret } from 'src/libs/naples/admin/serverside';
import generatorComponent from 'src/libs/naples/admin/scaffolding/component';
import generatorPage from 'src/libs/naples/admin/scaffolding/page';
import generatorApi from 'src/libs/naples/admin/scaffolding/api';

const generatorMap = {
  component: generatorComponent,
  page: generatorPage,
  api: generatorApi,
};

export default async function handler(req, res) {
  const { body, method } = req;
  const ip = req.headers['x-real-ip'] || req.connection.remoteAddress;
  switch (method) {
    case 'POST':
      const hasSecret = await checkSecret(body.secret, ip);
      if (!hasSecret) {
        return res.status(401).end('Unauthorized');
      }
      const result = await generatorMap[body.type](body);
      res.status(200).json({ result });
      break;
    default:
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
