import Login from 'src/components/page/naples/login';
import Layout from 'src/components/page/naples/layout';
import {
  saveSecret,
  checkSecret,
  getUsername,
  saveUsername,
} from 'src/libs/naples/admin/clientside';
import { useRouter } from 'next/router';
import { useCallback, useState, useEffect } from 'react';

const props = {
  header: {
    title: 'Admin',
    content: 'Naples Admin Page',
  },
  isHome: true,
};

export default function Index() {
  const router = useRouter();
  const [secretText, setSecretText] = useState('');
  const [usernameText, setUsernameText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(false);
  useEffect(() => {
    const localUsername = getUsername();
    if (localUsername) {
      setUsernameText(localUsername);
    }
  }, []);
  const onSecretTextChange = useCallback(
    e => {
      setSecretText(e.target.value);
      setError(false);
    },
    [setSecretText]
  );
  const onUsernameTextChange = useCallback(
    e => {
      setUsernameText(e.target.value);
    },
    [setUsernameText]
  );
  const onSubmit = useCallback(
    e => {
      e.preventDefault();
      if (submitting) {
        return false;
      }
      setSubmitting(true);
      checkSecret(secretText)
        .then(res => {
          if (res.data.valid) {
            saveSecret(secretText);
            saveUsername(usernameText.trim());
            router.push('/naples');
          } else {
            setError(true);
          }
        })
        .catch(() => {
          setError(true);
        })
        .finally(() => {
          setSubmitting(false);
        });
    },
    [submitting, usernameText, secretText, router]
  );
  return (
    <Layout {...props}>
      <Login
        secretText={secretText}
        onSecretTextChange={onSecretTextChange}
        usernameText={usernameText}
        onUsernameTextChange={onUsernameTextChange}
        onSubmit={onSubmit}
        error={error}
        submitting={submitting}
      />
    </Layout>
  );
}
