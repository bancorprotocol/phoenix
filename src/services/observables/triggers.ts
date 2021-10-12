import {
  tokenLists$,
  userPreferredListIds$,
  keeperDaoTokens$,
  listOfLists,
  tokens$,
  pools$,
  tokensNoBalance$,
} from 'services/observables/tokens';
import {
  setBntPrice,
  setKeeperDaoTokens,
  setTokenList,
  setTokenLists,
} from 'redux/bancor/bancor';
import { Subscription } from 'rxjs';
import { getTokenListLS, setTokenListLS } from 'utils/localStorage';
import { take } from 'rxjs/operators';
import { loadingBalances$ } from './user';
import { setLoadingBalances } from 'redux/user/user';
import { statistics$ } from 'services/observables/statistics';
import { setPools, setStats } from 'redux/bancor/pool';
import { bntPrice$ } from 'services/observables/bancor';

let tokenSub: Subscription;
let tokenListsSub: Subscription;
let keeperDaoSub: Subscription;
let loadingBalancesSub: Subscription;
let poolsSub: Subscription;
let statsSub: Subscription;
let bntPriceSub: Subscription;

export const loadCommonData = (dispatch: any) => {
  if (!tokenListsSub || tokenListsSub.closed)
    tokenListsSub = tokenLists$.subscribe((tokenLists) => {
      dispatch(setTokenLists(tokenLists));
    });

  tokensNoBalance$
    .pipe(take(1))
    .toPromise()
    .then((tokenList) => dispatch(setTokenList(tokenList)));

  loadingBalancesSub = loadingBalances$.subscribe((loading) =>
    dispatch(setLoadingBalances(loading))
  );

  const userListIds = getTokenListLS();
  if (userListIds.length === 0) {
    const firstFromList = [listOfLists[0].name];
    setTokenListLS(firstFromList);
    userPreferredListIds$.next(firstFromList);
  } else userPreferredListIds$.next(userListIds);

  tokenSub = tokens$.subscribe((tokenList) => {
    dispatch(setTokenList(tokenList));
  });

  keeperDaoSub = keeperDaoTokens$.subscribe((keeperDaoTokens) => {
    dispatch(setKeeperDaoTokens(keeperDaoTokens));
  });

  poolsSub = pools$.subscribe((pools) => {
    dispatch(setPools(pools));
  });

  statsSub = statistics$.subscribe((stats) => {
    dispatch(setStats(stats));
  });

  bntPriceSub = bntPrice$.subscribe((bntPrice) => {
    dispatch(setBntPrice(bntPrice));
  });
};
