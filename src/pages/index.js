import Home from 'src/components/page/home';

export default function Index() {
  return <Home stage={process.env.NEXT_PUBLIC_STAGE} />;
}
