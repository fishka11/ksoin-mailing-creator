import React from 'react';
import useFetchData from './utils/useFetchData';
import Error from './components/Error';
import Loader from './components/Loader';
import Content from './components/Content';
import Layout from './templates/layout';
import config from './utils/data';

function App() {
  const { results, isLoading, error } = useFetchData(config);

  if (error) {
    return (
      <Layout>
        <Error error={error} />
      </Layout>
    );
  }
  return isLoading ? (
    <Layout>
      <Loader />
    </Layout>
  ) : (
    <Layout>
      <Content results={results} utm={config.utm} />
    </Layout>
  );
}

export default App;
