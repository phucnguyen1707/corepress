import { redirect } from 'next/navigation';

import { defaultRoute } from '@/route';

const HomePage = () => {
  redirect(defaultRoute);
};

export default HomePage;
