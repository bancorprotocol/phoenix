import { getPoolById, SelectedPool } from 'redux/bancor/pool';
import { RouteComponentProps } from 'react-router-dom';
import { AddLiquiditySingle } from 'elements/earn/pools/addLiquidity/single/AddLiquiditySingle';
import { AddLiquidityDual } from 'elements/earn/pools/addLiquidity/dual/AddLiquidityDual';
import { AddLiquidityEmpty } from 'elements/earn/pools/addLiquidity/empty/AddLiquidityEmpty';
import { AddLiquidityLoading } from 'elements/earn/pools/addLiquidity/AddLiquidityLoading';
import { AddLiquidityError } from 'elements/earn/pools/addLiquidity/AddLiquidityError';
import { useAppSelector } from 'redux/index';
import { useCallback, useEffect, useState } from 'react';
import { fetchReserveBalances } from 'services/web3/contracts/liquidityProtection/wrapper';
import BigNumber from 'bignumber.js';

export const AddLiquidity = (props: RouteComponentProps<{ id: string }>) => {
  const { id } = props.match.params;
  const { status, pool } = useAppSelector<SelectedPool>(getPoolById(id));
  const [isCheckingType, setIsCheckingType] = useState(false);
  const [type, setType] = useState('');
  const [reserveBalances, setReserveBalances] = useState({
    tknBalance: '0',
    bntBalance: '0',
  });

  const checkType = useCallback(async () => {
    if (!pool) {
      return;
    }
    setIsCheckingType(true);
    if (pool.isProtected) {
      setType('single');
    } else {
      const { tknBalance, bntBalance } = await fetchReserveBalances(pool);
      setReserveBalances({ tknBalance, bntBalance });
      const isPoolEmpty = [tknBalance, bntBalance].some((b) =>
        new BigNumber(b).eq(0)
      );

      if (isPoolEmpty) {
        setType('empty');
      } else {
        setType('dual');
      }
    }
    setIsCheckingType(false);
  }, [pool]);

  useEffect(() => {
    void checkType();
  }, [id, checkType]);

  const isLoading = () => {
    return status === 'loading' || isCheckingType;
  };

  return (
    <div>
      <div>
        {isLoading() ? (
          <AddLiquidityLoading />
        ) : (
          <div>
            {!pool ? (
              <AddLiquidityError />
            ) : (
              <div>
                {type === 'single' && <AddLiquiditySingle pool={pool} />}
                {type === 'dual' && (
                  <AddLiquidityDual
                    pool={pool}
                    reserveBalances={reserveBalances}
                  />
                )}
                {type === 'empty' && <AddLiquidityEmpty pool={pool} />}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
