import axios from 'axios';
import Dashboard from 'src/components/page/naples/dashboard';
import Layout from 'src/components/page/naples/layout';
import {
  getSecret,
  checkSecret,
  saveSecret,
} from 'src/libs/naples/admin/clientside';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

const layoutProps = {
  header: {
    title: 'Dashboard',
    content: 'Naples Dashboard',
  },
  isHome: false,
};

export default function Index() {
  const router = useRouter();
  const [basicData, setBasicData] = useState({
    serverStartTime: null,
  });
  const [performanceData, setPerformanceData] = useState({});
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
      axios
        .get('/api/naples/dashboard', {
          params: { type: 'basic', secret: localSecret },
        })
        .then(res => {
          setBasicData(res.data);
        });
      const fetchPerformanceData = async () => {
        axios
          .get('/api/naples/dashboard', {
            params: {
              type: 'performance',
              secret: localSecret,
            },
          })
          .then(res => {
            setPerformanceData(res.data);
          });
      };
      fetchPerformanceData();
      const itv = setInterval(fetchPerformanceData, 3000);
      return () => clearInterval(itv);
    }
  }, [router]);

  return (
    <Layout {...layoutProps}>
      <Dashboard basicData={basicData} performanceData={performanceData} />
    </Layout>
  );
}
