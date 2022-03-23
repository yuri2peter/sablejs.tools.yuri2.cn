import Home from 'src/components/page/naples/home';
import Layout from 'src/components/page/naples/layout';
import {
  getSecret,
  checkSecret,
  saveSecret,
  getUsername,
} from 'src/libs/naples/admin/clientside';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

const layoutProps = {
  header: {
    title: 'Admin',
    content: 'Naples Admin Page',
  },
  isHome: true,
};

export default function Index() {
  const router = useRouter();
  const [localUsername, setLocalUsername] = useState('');
  useEffect(() => {
    const localSecret = getSecret();
    setLocalUsername(getUsername());
    if (!localSecret) {
      router.push('/naples/login');
    } else {
      checkSecret(localSecret).then(res => {
        if (!res.data.valid) {
          saveSecret('');
          router.push('/naples/login');
        }
      });
    }
  }, [router]);

  return (
    <Layout {...layoutProps}>
      <Home localUsername={localUsername} />
    </Layout>
  );
}
