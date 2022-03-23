/**
 * This file is generated automatically by naples scaffolding.
 * @create February 26o 2022, 5:02:51 pm
 * @author Yuri2
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/router';
import Examples from 'src/components/page/naples/examples';
import Layout from 'src/components/page/naples/layout';
import {
  getSecret,
  checkSecret,
  saveSecret,
} from 'src/libs/naples/admin/clientside';

const layoutProps = {
  header: {
    title: 'Examples',
    content: 'Naples Examples',
  },
  isHome: false,
};

export default function Index({}) {
  const router = useRouter();
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
  return (
    <Layout {...layoutProps}>
      <Examples />
    </Layout>
  );
}
