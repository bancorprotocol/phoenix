import { useEffect, useState } from 'react';
// @ts-ignore
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { LayoutHeader } from './elements/layoutHeader/LayoutHeader';
import { useWeb3React } from '@web3-react/core';
import { Swap } from 'pages/Swap';
import { Loading } from 'pages/Loading';
import { NotFound } from 'pages/NotFound';
import { ButtonSamples } from 'pages/ButtonSamples';
import { UnsupportedNetwork } from 'pages/UnsupportedNetwork';
import { useAutoConnect } from 'web3/wallet/hooks';
import { isAutoLogin, isUnsupportedNetwork } from 'utils/pureFunctions';

export const App = () => {
  const dispatch = useDispatch();
  const { chainId } = useWeb3React();
  const [loading, setLoading] = useState(true);
  const unsupportedNetwork = isUnsupportedNetwork(chainId);
  const triedAutoLogin = useAutoConnect();

  useEffect(() => {
    if (chainId || triedAutoLogin || !isAutoLogin()) setLoading(false);
  }, [setLoading, chainId, isAutoLogin]);

  return (
    <BrowserRouter>
      <LayoutHeader />
      {loading ? (
        <Loading />
      ) : unsupportedNetwork ? (
        <UnsupportedNetwork />
      ) : (
        <Switch>
          <Route exact strict path="/" component={Swap} />
          <Route exact strict path="/buttons" component={ButtonSamples} />
          <Route component={NotFound} />
        </Switch>
      )}
    </BrowserRouter>
  );
};
