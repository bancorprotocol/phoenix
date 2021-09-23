import {
  tokenLists$,
  userPreferredListIds$,
  keeperDaoTokens$,
  listOfLists,
  tokens$,
  tokensNoBalance$,
  pools2$
} from 'services/observables/tokens';
import {
  setKeeperDaoTokens,
  setTokenList,
  setTokenLists,
  setPools,
} from 'redux/bancor/bancor';
import { Subscription } from 'rxjs';
import { getTokenListLS, setTokenListLS } from 'utils/localStorage';
import { fullPositions$, positions$ } from './protectedPositions';
import { lockedBalances$ } from './lockedBalances';
import { onLogin$, onLogout$ } from './user';
import { setUser } from 'redux/user/user';
import { take } from 'rxjs/operators';
import { loadingBalances$ } from './user';
import { setLoadingBalances } from 'redux/user/user';
import { statistics$ } from 'services/observables/statistics';
import { setStats } from 'redux/bancor/pool';
import { setPools as setPools2 } from "redux/bancor/pool"
import { pools$ } from './pools';

let tokenSub: Subscription;
let tokenListsSub: Subscription;
let keeperDaoSub: Subscription;
let loadingBalancesSub: Subscription;
let poolsSub: Subscription;
let statsSub: Subscription;
let pools2Sub: Subscription;

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

  onLogin$.subscribe((user) => setUser(user));
  onLogout$.subscribe((user) => setUser(user));

  pools$.subscribe((pools) => {
    dispatch(setPools(pools));
  });

  keeperDaoTokens$.subscribe((keeperDaoTokens) => {
    setKeeperDaoTokens(keeperDaoTokens);
  });

  positions$.subscribe((x) => console.log(x, 'came from positions'));

  fullPositions$.subscribe((x) => console.log(x, 'was full positons'));
  lockedBalances$.subscribe((lockedBalances) =>
    console.log(lockedBalances, 'are the locked balances')
  );

  keeperDaoSub = keeperDaoTokens$.subscribe((keeperDaoTokens) => {
    setKeeperDaoTokens(keeperDaoTokens);
  });

  poolsSub = pools$.subscribe((pools) => {
    dispatch(setPools(pools));
  });

  statsSub = statistics$.subscribe((stats) => {
    dispatch(setStats(stats));
  });

  pools2Sub = pools2$.subscribe((pools) => {
    dispatch(setPools2(pools));
  });
};
