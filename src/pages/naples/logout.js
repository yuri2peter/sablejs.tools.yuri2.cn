/**
 * This file is generated automatically by naples scaffolding.
 * @create February 26o 2022, 8:27:12 pm
 * @author Yuri2
 */

import axios from 'axios';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Layout from 'src/components/page/naples/layout';
import {
  saveSecret,
  getSecret,
  checkSecret,
  getUsername,
  saveUsername,
} from 'src/libs/naples/admin/clientside';
import Logout from 'src/components/page/naples/logout';

const props = {
  header: {
    title: 'Admin',
    content: 'Naples Admin Page',
  },
  isHome: true,
};

export default function Index({}) {
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
  const onSubmit = useCallback(
    ({ checkedRemember, checkedReset }) => {
      if (!checkedRemember) {
        saveUsername('');
      }
      const logout = () => {
        saveSecret('');
        router.push('/naples/login');
      };
      if (checkedReset) {
        axios
          .put('/api/naples/secret', {
            secret: getSecret(),
          })
          .then(logout)
          .catch(() => {
            alert('Reset secret failed. Please try again later.');
          });
      } else {
        logout();
      }
    },
    [router]
  );
  return (
    <Layout {...props}>
      <Logout onSubmit={onSubmit} localUsername={localUsername} />
    </Layout>
  );
}
