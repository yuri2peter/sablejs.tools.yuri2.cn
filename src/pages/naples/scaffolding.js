import axios from 'axios';
import Scaffolding from 'src/components/page/naples/scaffolding';
import Layout from 'src/components/page/naples/layout';
import {
  getUsername,
  getSecret,
  checkSecret,
  saveSecret,
} from 'src/libs/naples/admin/clientside';
import { useRouter } from 'next/router';
import { useState, useEffect, useCallback } from 'react';

const layoutProps = {
  header: {
    title: 'Scaffolding',
    content: 'Naples Scaffolding',
  },
  isHome: false,
};

export default function Index() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  useEffect(() => {
    const localSecret = getSecret();
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

  const onForm1Submit = useCallback(
    e => {
      e.preventDefault();
      if (submitting) return;
      setSubmitting(true);
      const data = {
        type: 'component',
        username: getUsername(),
        secret: getSecret(),
        path: e.target.path.value.trim(),
        withStyle: e.target.cb1_1.checked,
      };
      axios.post('/api/naples/scaffolding', data).finally(() => {
        setSubmitting(false);
      });
    },
    [submitting]
  );

  const onForm2Submit = useCallback(
    e => {
      e.preventDefault();
      if (submitting) return;
      setSubmitting(true);
      const data = {
        type: 'page',
        username: getUsername(),
        secret: getSecret(),
        path: e.target.path.value.trim(),
      };
      axios.post('/api/naples/scaffolding', data).finally(() => {
        setSubmitting(false);
      });
    },
    [submitting]
  );
  const onForm3Submit = useCallback(
    e => {
      e.preventDefault();
      if (submitting) return;
      setSubmitting(true);
      const data = {
        type: 'api',
        username: getUsername(),
        secret: getSecret(),
        path: e.target.path.value.trim(),
        useGet: e.target.cb3_1.checked,
        usePost: e.target.cb3_2.checked,
        usePut: e.target.cb3_3.checked,
        useDelete: e.target.cb3_4.checked,
        useIP: e.target.cb3_5.checked,
        useDisableBodyParser: e.target.cb3_6.checked,
      };
      axios.post('/api/naples/scaffolding', data).finally(() => {
        setSubmitting(false);
      });
    },
    [submitting]
  );
  return (
    <Layout {...layoutProps}>
      <Scaffolding
        onForm1Submit={onForm1Submit}
        onForm2Submit={onForm2Submit}
        onForm3Submit={onForm3Submit}
        submitting={submitting}
      />
    </Layout>
  );
}
