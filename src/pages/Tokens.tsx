import { TopMovers } from 'elements/tokens/TopMovers';
import { TokenTable } from 'elements/tokens/TokenTable';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loadTokenData } from 'services/observables/triggers';

export const Tokens = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    loadTokenData(dispatch);
  }, [dispatch]);

  return (
    <div className="space-y-30 max-w-[1140px] mx-auto bg-grey-1 dark:bg-blue-3">
      <TopMovers />
      <TokenTable />
    </div>
  );
};
